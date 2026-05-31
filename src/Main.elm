module Main exposing (main)

import Browser
import Html exposing (Html, div, text, button, input, h1, h2, h3, p, span, br, node, ul, li, code)
import Html.Attributes exposing (class, value, style, placeholder, type_, src, rel, href)
import Html.Events exposing (onClick, onInput, on)
import Json.Decode as D
import Random
import Time


-- ============ TYPES ============

type alias Card =
    { value : Int
    , suit : String
    , display : String
    , color : String
    }

type MsgType = Success | Error | Info | None

type alias Model =
    { cards : List Card
    , input : String
    , message : String
    , messageType : MsgType
    , streak : Int
    , solved : Int
    , skipped : Int
    , showHint : Bool
    , hintText : String
    , allSolutions : List String
    , bestStreak : Int
    , totalGames : Int
    , timer : Int
    , showAllAnswers : Bool
    }

type Msg
    = NewCards (List Card)
    | UpdateInput String
    | SubmitAnswer
    | ShowHint
    | ShowAllAnswers
    | NewGame
    | Skip
    | Tick Time.Posix
    | NoOp


-- ============ EXPRESSION PARSER ============

type Expr
    = Num Float
    | AddE Expr Expr
    | SubE Expr Expr
    | MulE Expr Expr
    | DivE Expr Expr


tokenize : String -> List String
tokenize s =
    tokenizeHelp [] (String.toList (String.replace " " "" s))

tokenizeHelp : List String -> List Char -> List String
tokenizeHelp acc chars =
    case chars of
        [] -> List.reverse acc
        c :: rest ->
            if Char.isDigit c then
                let (digits, remaining) = span Char.isDigit (c :: rest)
                in tokenizeHelp (String.fromList digits :: acc) remaining
            else
                tokenizeHelp (String.fromList [c] :: acc) rest

span : (a -> Bool) -> List a -> (List a, List a)
span p list =
    case list of
        [] -> ([], [])
        x :: xs ->
            if p x then
                let (ys, zs) = span p xs
                in (x :: ys, zs)
            else ([], list)


parseExpr : List String -> Maybe (Expr, List String)
parseExpr tokens = parseAddSub tokens

parseAddSub : List String -> Maybe (Expr, List String)
parseAddSub tokens =
    parseMulDiv tokens |> Maybe.andThen
        (\(left, rest) ->
            case rest of
                "+" :: r2 -> parseAddSub r2 |> Maybe.map (\(right, r3) -> (AddE left right, r3))
                "-" :: r2 -> parseAddSub r2 |> Maybe.map (\(right, r3) -> (SubE left right, r3))
                _ -> Just (left, rest)
        )

parseMulDiv : List String -> Maybe (Expr, List String)
parseMulDiv tokens =
    parsePrimary tokens |> Maybe.andThen
        (\(left, rest) ->
            case rest of
                "*" :: r2 -> parseMulDiv r2 |> Maybe.map (\(right, r3) -> (MulE left right, r3))
                "/" :: r2 -> parseMulDiv r2 |> Maybe.map (\(right, r3) -> (DivE left right, r3))
                _ -> Just (left, rest)
        )

parsePrimary : List String -> Maybe (Expr, List String)
parsePrimary tokens =
    case tokens of
        "(" :: rest ->
            parseExpr rest |> Maybe.andThen
                (\(expr, r2) ->
                    case r2 of
                        ")" :: r3 -> Just (expr, r3)
                        _ -> Nothing
                )
        numStr :: rest ->
            String.toFloat numStr |> Maybe.map (\n -> (Num n, rest))
        _ -> Nothing


evalExpr : Expr -> Maybe Float
evalExpr e =
    case e of
        Num n -> Just n
        AddE l r -> Maybe.map2 (+) (evalExpr l) (evalExpr r)
        SubE l r -> Maybe.map2 (-) (evalExpr l) (evalExpr r)
        MulE l r -> Maybe.map2 (*) (evalExpr l) (evalExpr r)
        DivE l r ->
            evalExpr r |> Maybe.andThen
                (\denom ->
                    if denom == 0 then Nothing
                    else evalExpr l |> Maybe.map (\num -> num / denom)
                )


extractNums : Expr -> List Float
extractNums e =
    case e of
        Num n -> [n]
        AddE l r -> extractNums l ++ extractNums r
        SubE l r -> extractNums l ++ extractNums r
        MulE l r -> extractNums l ++ extractNums r
        DivE l r -> extractNums l ++ extractNums r


matchCards : List Float -> List Float -> Bool
matchCards expected actual =
    let round3 n = round (n * 1000)
    in List.sort (List.map round3 expected) == List.sort (List.map round3 actual)


parseAndValidate : String -> List Float -> Result String Float
parseAndValidate input cardValues =
    let tokens = tokenize input
    in case parseExpr tokens of
        Nothing -> Err "表达式格式错误，请检查括号和数字"
        Just (expr, rest) ->
            if not (List.isEmpty rest) then
                Err "表达式有多余内容"
            else
                let usedNums = extractNums expr
                in
                if not (matchCards cardValues usedNums) then
                    Err "使用的数字与牌面不匹配（必须且只能用4张牌各一次）"
                else
                    case evalExpr expr of
                        Nothing -> Err "计算错误（可能除以零）"
                        Just result -> Ok result


-- ============ 24 SOLVER ============

type Op = Add | Sub | Mul | Div

applyOp : Op -> Float -> Float -> Maybe Float
applyOp op a b =
    case op of
        Add -> Just (a + b)
        Sub -> Just (a - b)
        Mul -> Just (a * b)
        Div -> if b == 0 then Nothing else Just (a / b)

opSymbol : Op -> String
opSymbol op =
    case op of
        Add -> "+"
        Sub -> "-"
        Mul -> "*"
        Div -> "/"

type alias ExprVal = { expr : String, value : Float }

fmt : Float -> String
fmt n =
    if n == toFloat (round n) then String.fromInt (round n)
    else String.fromFloat n

getAt : Int -> List a -> Maybe a
getAt idx list = List.drop idx list |> List.head

removeAt : Int -> List a -> List a
removeAt idx list = List.take idx list ++ List.drop (idx + 1) list

allPairs : Int -> List (Int, Int)
allPairs n =
    List.concatMap (\i -> List.map (\j -> (i, j)) (List.range (i + 1) (n - 1))) (List.range 0 (n - 2))

compute : List ExprVal -> List ExprVal
compute vals =
    case vals of
        [v] -> [v]
        _ -> List.concatMap (combinePair vals) (allPairs (List.length vals))

combinePair : List ExprVal -> (Int, Int) -> List ExprVal
combinePair vals (i, j) =
    let a = getAt i vals |> Maybe.withDefault {expr = "0", value = 0}
        b = getAt j vals |> Maybe.withDefault {expr = "0", value = 0}
        rest = removeAt (j - 1) (removeAt i vals)
    in
    List.concatMap
        (\(left, right) ->
            List.concatMap
                (\op ->
                    case applyOp op left.value right.value of
                        Nothing -> []
                        Just result ->
                            let combo = { expr = "(" ++ left.expr ++ opSymbol op ++ right.expr ++ ")", value = result }
                            in compute (combo :: rest)
                )
                [Add, Sub, Mul, Div]
        )
        [(a, b), (b, a)]

unique : List String -> List String
unique list = List.foldl (\x acc -> if List.member x acc then acc else acc ++ [x]) [] list

-- Expression simplification: remove unnecessary parentheses
exprToStringSimplified : Expr -> String
exprToStringSimplified e = exprToStr 1 False e

exprToStr : Int -> Bool -> Expr -> String
exprToStr parentPrec isRight e =
    case e of
        Num n -> fmt n
        AddE l r ->
            let s = exprToStr 1 False l ++ "+" ++ exprToStr 1 False r
            in if needsParens False parentPrec 1 then "(" ++ s ++ ")" else s
        SubE l r ->
            let s = exprToStr 1 False l ++ "-" ++ exprToStr 1 True r
            in if needsParens False parentPrec 1 then "(" ++ s ++ ")" else s
        MulE l r ->
            let s = exprToStr 2 False l ++ "*" ++ exprToStr 2 False r
            in if needsParens False parentPrec 2 then "(" ++ s ++ ")" else s
        DivE l r ->
            let s = exprToStr 2 False l ++ "/" ++ exprToStr 2 True r
            in if needsParens False parentPrec 2 then "(" ++ s ++ ")" else s

needsParens : Bool -> Int -> Int -> Bool
needsParens isRight parent child =
    child < parent || (isRight && child == parent)

simplifySolution : String -> String
simplifySolution s =
    case parseExpr (tokenize s) of
        Just (expr, rest) ->
            if List.isEmpty rest then exprToStringSimplified expr else s
        Nothing -> s

solve24 : List Float -> List String
solve24 nums =
    let initVals = List.map (\n -> {expr = fmt n, value = n}) nums
        allExprs = compute initVals
        solutions = List.filter (\e -> abs(e.value - 24) < 0.00001) allExprs
    in List.map (\e -> simplifySolution e.expr) solutions |> unique |> List.sort


-- ============ RANDOM CARDS ============

randomCard : Random.Generator Card
randomCard =
    Random.map2
        (\val suitIdx ->
            let suits = ["♠", "♥", "♣", "♦"]
                colors = ["#2c3e50", "#e74c3c", "#2c3e50", "#e74c3c"]
                suit = getAt suitIdx suits |> Maybe.withDefault "♠"
                color = getAt suitIdx colors |> Maybe.withDefault "#2c3e50"
                display = case val of
                    1 -> "A"
                    11 -> "J"
                    12 -> "Q"
                    13 -> "K"
                    _ -> String.fromInt val
            in { value = val, suit = suit, display = display, color = color }
        )
        (Random.int 1 13)
        (Random.int 0 3)

generateCards : Cmd Msg
generateCards = Random.generate NewCards (Random.list 4 randomCard)


-- ============ INIT / UPDATE ============

init : () -> (Model, Cmd Msg)
init _ =
    ( { cards = []
      , input = ""
      , message = "点击「新游戏」开始24点挑战！"
      , messageType = Info
      , streak = 0
      , solved = 0
      , skipped = 0
      , showHint = False
      , hintText = ""
      , allSolutions = []
      , bestStreak = 0
      , totalGames = 0
      , timer = 0
      , showAllAnswers = False
      }
    , generateCards
    )


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        NewCards cards ->
            let solutions = solve24 (List.map (\c -> toFloat c.value) cards)
            in
            if List.isEmpty solutions then
                ( model, generateCards )
            else
                ( { model
                    | cards = cards
                    , allSolutions = solutions
                    , message = if model.totalGames == 0 then "请用下面4张牌算出24点！" else "新的一组牌！"
                    , messageType = Info
                    , input = ""
                    , showHint = False
                    , hintText = ""
                    , totalGames = model.totalGames + 1
                    , timer = 0
                  }
                , Cmd.none
                )

        UpdateInput s ->
            ( { model | input = s }, Cmd.none )

        SubmitAnswer ->
            let cardValues = List.map (\c -> toFloat c.value) model.cards
            in case parseAndValidate model.input cardValues of
                Ok result ->
                    if abs(result - 24) < 0.0001 then
                        let newStreak = model.streak + 1
                            newBest = max newStreak model.bestStreak
                        in
                        ( { model
                            | message = "🎉 正确！「" ++ model.input ++ " = 24」"
                            , messageType = Success
                            , streak = newStreak
                            , solved = model.solved + 1
                            , bestStreak = newBest
                            , input = ""
                            , showHint = False
                          }
                        , generateCards
                        )
                    else
                        ( { model
                            | message = "❌ 结果是 " ++ fmt result ++ "，不是24！"
                            , messageType = Error
                            , streak = 0
                          }
                        , Cmd.none
                        )
                Err errMsg ->
                    ( { model | message = "❌ " ++ errMsg, messageType = Error, streak = 0 }, Cmd.none )

        ShowHint ->
            case model.allSolutions of
                [] ->
                    ( { model
                        | message = "💡 这道题无解！点击「跳过」换一组。"
                        , messageType = Info
                      }
                    , Cmd.none
                    )
                first :: _ ->
                    ( { model
                        | showHint = True
                        , hintText = first
                        , message = "💡 提示已显示"
                        , messageType = Info
                      }
                    , Cmd.none
                    )

        ShowAllAnswers ->
            ( { model | showAllAnswers = True, message = "📋 显示全部 " ++ String.fromInt (List.length model.allSolutions) ++ " 个解法", messageType = Info }, Cmd.none )

        NewGame ->
            ( { model
                | streak = 0
                , message = "新游戏开始！"
                , messageType = Info
                , timer = 0
                , showAllAnswers = False
              }
            , generateCards
            )

        Skip ->
            ( { model
                | skipped = model.skipped + 1
                , streak = 0
                , message = "跳过！答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions)
                , messageType = Info
                , showAllAnswers = True
              }
            , generateCards
            )

        Tick _ -> ( { model | timer = model.timer + 1 }, Cmd.none )

        NoOp -> (model, Cmd.none)


subscriptions : Model -> Sub Msg
subscriptions _ = Time.every 1000 Tick


-- ============ VIEW ============

css : Html msg
css =
    node "style"
        []
        [ text """
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); margin: 0; min-height: 100vh; color: #eee; }
.container { max-width: 800px; margin: 0 auto; padding: 20px; }
.header { text-align: center; margin-bottom: 30px; }
.header h1 { font-size: 3em; margin: 0; background: linear-gradient(90deg, #e94560, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 30px rgba(233,69,96,0.3); }
.header p { color: #a0a0a0; margin-top: 8px; font-size: 1.1em; }
.stats { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-box { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 24px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
.stat-label { font-size: 0.75em; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.stat-value { font-size: 1.5em; font-weight: bold; color: #e94560; }
.cards-area { display: flex; justify-content: center; gap: 15px; margin: 30px 0; flex-wrap: wrap; }
.card { width: 100px; height: 140px; background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.4); position: relative; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
.card:hover { transform: translateY(-8px) rotateY(5deg) scale(1.05); box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
@keyframes dealIn { 0% { opacity: 0; transform: translateY(-40px) scale(0.8); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.card { animation: dealIn 0.5s ease backwards; }
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }
.card-display { font-size: 2em; font-weight: bold; color: #333; }
.card-suit { font-size: 1.5em; margin-top: 4px; }
.card-value-bottom { position: absolute; bottom: 6px; right: 8px; font-size: 0.9em; font-weight: bold; color: #333; }
.input-area { display: flex; gap: 10px; justify-content: center; margin: 20px 0; flex-wrap: wrap; }
.expr-input { flex: 1; min-width: 250px; max-width: 400px; padding: 14px 18px; border: 2px solid rgba(233,69,96,0.3); border-radius: 10px; background: rgba(0,0,0,0.3); color: #fff; font-size: 1.1em; outline: none; transition: border-color 0.3s; }
.expr-input:focus { border-color: #e94560; }
.btn { padding: 14px 24px; border: none; border-radius: 10px; font-size: 1em; cursor: pointer; transition: all 0.3s; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.btn-primary { background: linear-gradient(135deg, #e94560, #c73e54); color: white; box-shadow: 0 4px 15px rgba(233,69,96,0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.5); }
.btn-secondary { background: rgba(255,255,255,0.1); color: #ddd; border: 1px solid rgba(255,255,255,0.2); }
.btn-secondary:hover { background: rgba(255,255,255,0.2); }
.btn-success { background: linear-gradient(135deg, #00d9ff, #0099cc); color: white; box-shadow: 0 4px 15px rgba(0,217,255,0.3); }
.btn-success:hover { transform: translateY(-2px); }
.message { text-align: center; padding: 16px; border-radius: 10px; margin: 15px 0; font-weight: 500; min-height: 24px; }
.msg-success { background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); color: #2ecc71; }
.msg-error { background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); color: #e74c3c; }
.msg-info { background: rgba(52, 152, 219, 0.15); border: 1px solid rgba(52, 152, 219, 0.3); color: #3498db; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
.msg-pulse { animation: pulse 0.5s ease; }
.msg-shake { animation: shake 0.5s ease; }
.hint-box { background: rgba(255, 193, 7, 0.1); border: 1px dashed rgba(255, 193, 7, 0.4); border-radius: 10px; padding: 15px; margin: 15px 0; text-align: center; color: #ffc107; font-family: monospace; font-size: 1.1em; }
.rules { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.08); }
.rules h3 { margin-top: 0; color: #e94560; }
.rules ul { padding-left: 20px; color: #bbb; line-height: 1.8; }
.rules code { background: rgba(233,69,96,0.15); padding: 2px 6px; border-radius: 4px; color: #e94560; }
.buttons-row { display: flex; gap: 10px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
.all-answers { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 15px 0; border: 1px solid rgba(255,255,255,0.1); }
.all-answers-title { font-weight: bold; color: #e94560; margin-bottom: 12px; font-size: 1.1em; }
.answers-list { display: flex; flex-direction: column; gap: 8px; }
.answer-item { background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 1.05em; color: #ddd; border-left: 3px solid #e94560; }
.footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.85em; }
        """ ]

formatTime : Int -> String
formatTime seconds =
    let m = seconds // 60
        s = modBy 60 seconds
    in String.fromInt m ++ ":" ++ (if s < 10 then "0" else "") ++ String.fromInt s

msgClass : MsgType -> String
msgClass mt =
    case mt of
        Success -> "message msg-success msg-pulse"
        Error -> "message msg-error msg-shake"
        Info -> "message msg-info"
        None -> "message"


viewCard : Card -> Html Msg
viewCard card =
    div [ class "card", style "border" ("2px solid " ++ card.color) ]
        [ div [ class "card-display", style "color" card.color ] [ text card.display ]
        , div [ class "card-suit", style "color" card.color ] [ text card.suit ]
        , div [ class "card-value-bottom", style "color" card.color ] [ text card.display ]
        ]


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ css
        , div [ class "header" ]
            [ h1 [] [ text "🃏 24点挑战" ]
            , p [] [ text "用加减乘除和括号，让四张牌算出24" ]
            ]
        , div [ class "stats" ]
            [ div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "连胜" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.streak) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "已解" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.solved) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "最佳连胜" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.bestStreak) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "跳过" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.skipped) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "用时" ]
                , div [ class "stat-value" ] [ text (formatTime model.timer) ]
                ]
            ]
        , div [ class "cards-area" ] (List.map viewCard model.cards)
        , div [ class (msgClass model.messageType) ] [ text model.message ]
        , if model.showHint then
            div [ class "hint-box" ] [ text ("💡 参考解法：" ++ model.hintText) ]
          else
            text ""
        , div [ class "input-area" ]
            [ input
                [ class "expr-input"
                , type_ "text"
                , value model.input
                , placeholder "输入算式，如 (3+3)*8/2"
                , onInput UpdateInput
                , on "keydown" (D.map (\key -> if key == 13 then SubmitAnswer else NoOp) D.int)
                ]
                []
            ]
        , div [ class "buttons-row" ]
            [ button [ class "btn btn-primary", onClick SubmitAnswer ] [ text "✓ 提交答案" ]
            , button [ class "btn btn-success", onClick ShowHint ] [ text "💡 提示" ]
            , button [ class "btn btn-secondary", onClick ShowAllAnswers ] [ text "📋 显示全部" ]
            , button [ class "btn btn-secondary", onClick Skip ] [ text "⏭ 跳过" ]
            , button [ class "btn btn-secondary", onClick NewGame ] [ text "🔄 新游戏" ]
            ]
        , if model.showAllAnswers && not (List.isEmpty model.allSolutions) then
            div [ class "all-answers" ]
                [ div [ class "all-answers-title" ] [ text ("全部解法 (" ++ String.fromInt (List.length model.allSolutions) ++ " 个)") ]
                , div [ class "answers-list" ] (List.indexedMap (\i ans -> div [ class "answer-item" ] [ text (String.fromInt (i + 1) ++ ". " ++ ans ++ " = 24") ]) model.allSolutions)
                ]
          else
            text ""
        , div [ class "rules" ]
            [ h3 [] [ text "游戏规则" ]
            , p [] [ text "从扑克牌中随机抽取4张牌（A=1, J=11, Q=12, K=13），用加减乘除算出24" ]
            , ul []
                [ li [] [ text "只能使用加、减、乘、除和括号" ]
                , li [] [ text "每张牌必须且只能使用一次" ]
                , li [] [ text "最终结果必须恰好等于24" ]
                , li [] [ text "支持分数运算，如 (8/(3-8/3))*3 = 24" ]
                ]
            , p [] [ text "示例：" ]
            , ul []
                [ li [] [ text "牌面 3, 3, 8, 8：", code [] [ text "8/(3-8/3)" ], text " = 24" ]
                , li [] [ text "牌面 4, 4, 10, 10：", code [] [ text "(10*10-4)/4" ], text " = 24" ]
                , li [] [ text "牌面 1, 5, 5, 5：", code [] [ text "5*(5-1/5)" ], text " = 24" ]
                ]
            ]
        , div [ class "footer" ]
            [ text "用 Elm 语言构建 · 纯函数式编程 · 无运行时错误" ]
        ]


-- ============ MAIN ============

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
