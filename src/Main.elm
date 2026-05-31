port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Html exposing (Html, div, text, button, input, h1, h2, h3, h4, p, span, br, node, ul, li, code)
import Html.Attributes exposing (class, value, style, placeholder, type_, src, rel, href, id, title)
import Html.Events exposing (onClick, onInput, on)
import Json.Decode as D
import Json.Encode as E
import Process
import Random
import Task
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
    , totalTime : Int
    , achievements : List String
    , newAchievements : List String
    , history : List String
    , sfxEnabled : Bool
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
    | StorageLoaded String
    | DelayedNewCards
    | DismissAchievements
    | ToggleSFX
    | ClearHistory
    | CopyAnswer String
    | NoOp


-- ============ PORTS ============

port saveToStorage : String -> Cmd msg
port loadFromStorage : () -> Cmd msg
port receiveFromStorage : (String -> msg) -> Sub msg
port playSound : String -> Cmd msg
port spawnParticles : Int -> Cmd msg
port setSFX : Bool -> Cmd msg
port copyToClipboard : String -> Cmd msg


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
                let (digits, remaining) = spanList Char.isDigit (c :: rest)
                in tokenizeHelp (String.fromList digits :: acc) remaining
            else
                tokenizeHelp (String.fromList [c] :: acc) rest

spanList : (a -> Bool) -> List a -> (List a, List a)
spanList p list =
    case list of
        [] -> ([], [])
        x :: xs ->
            if p x then
                let (ys, zs) = spanList p xs
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
      , totalTime = 0
      , achievements = []
      , newAchievements = []
      , history = []
      , sfxEnabled = True
      }
    , Cmd.batch [ generateCards, loadFromStorage () ]
    )


-- ============ STORAGE ============

encodeStats : Model -> String
encodeStats model =
    E.encode 0
        (E.object
            [ ("bestStreak", E.int model.bestStreak)
            , ("totalSolved", E.int model.solved)
            , ("totalSkipped", E.int model.skipped)
            , ("totalTime", E.int model.totalTime)
            , ("achievements", E.list E.string model.achievements)
            ]
        )

decodeStats : String -> Model -> Model
decodeStats json model =
    case D.decodeString
        (D.map5
            (\bs tsD tsk tt ach ->
                { model
                    | bestStreak = max model.bestStreak bs
                    , solved = model.solved + tsD
                    , skipped = model.skipped + tsk
                    , totalTime = model.totalTime + tt
                    , achievements = model.achievements ++ ach
                }
            )
            (D.maybe (D.field "bestStreak" D.int) |> D.map (Maybe.withDefault 0))
            (D.maybe (D.field "totalSolved" D.int) |> D.map (Maybe.withDefault 0))
            (D.maybe (D.field "totalSkipped" D.int) |> D.map (Maybe.withDefault 0))
            (D.maybe (D.field "totalTime" D.int) |> D.map (Maybe.withDefault 0))
            (D.maybe (D.field "achievements" (D.list D.string)) |> D.map (Maybe.withDefault []))
        )
        json of
        Ok newModel -> newModel
        Err _ -> model

saveCmd : Model -> Cmd Msg
saveCmd model =
    saveToStorage (encodeStats model)

-- ============ ACHIEVEMENTS ============

checkAchievements : Model -> List String
checkAchievements model =
    let all =
            [ ("首杀", model.solved >= 1)
            , ("三连冠", model.streak >= 3)
            , ("五连冠", model.streak >= 5)
            , ("十连冠", model.streak >= 10)
            , ("速算大师", model.timer <= 10 && model.solved > 0)
            , ("百题斩", model.solved >= 100)
            ]
    in List.filterMap (\(name, cond) -> if cond && not (List.member name model.achievements) then Just name else Nothing) all


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
                            newModel = { model
                                | message = "🎉 正确！「" ++ model.input ++ " = 24」"
                                , messageType = Success
                                , streak = newStreak
                                , solved = model.solved + 1
                                , bestStreak = newBest
                                , input = ""
                                , showHint = False
                                }
                        in
                        ( newModel, Cmd.batch [ generateCards, saveCmd newModel ] )
                    else
                        let errModel = { model | message = "❌ 结果是 " ++ fmt result ++ "，不是24！", messageType = Error, streak = 0, history = model.input :: model.history }
                        in ( errModel, Cmd.none )
                Err errMsg ->
                    let newModel = { model | message = "❌ " ++ errMsg, messageType = Error, streak = 0, history = model.input :: model.history }
                    in ( newModel, Cmd.batch [ saveCmd newModel, playSound "error" ] )

        ShowHint ->
            case model.allSolutions of
                [] ->
                    ( { model | message = "💡 这道题无解！点击「跳过」换一组。", messageType = Info }, playSound "click" )
                first :: _ ->
                    ( { model | showHint = True, hintText = first, message = "💡 提示已显示", messageType = Info }, playSound "click" )

        ShowAllAnswers ->
            ( { model | showAllAnswers = True, message = "📋 显示全部 " ++ String.fromInt (List.length model.allSolutions) ++ " 个解法", messageType = Info }, playSound "click" )

        NewGame ->
            ( { model | streak = 0, message = "新游戏开始！", messageType = Info, timer = 0, showAllAnswers = False, newAchievements = [] }
            , Cmd.batch [ generateCards, playSound "click" ]
            )

        Skip ->
            let newModel =
                    { model
                        | skipped = model.skipped + 1
                        , streak = 0
                        , message = "跳过！答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions)
                        , messageType = Info
                        , showAllAnswers = True
                    }
            in
            ( newModel, Cmd.batch [ Task.perform (\_ -> DelayedNewCards) (Process.sleep 1500), saveCmd newModel, playSound "click" ] )

        Tick _ ->
            ( { model | timer = model.timer + 1, totalTime = model.totalTime + 1 }, Cmd.none )

        StorageLoaded json ->
            let newModel = decodeStats json model
            in ( newModel, Cmd.none )

        DelayedNewCards ->
            ( model, generateCards )

        DismissAchievements ->
            ( { model | newAchievements = [] }, Cmd.none )

        ToggleSFX ->
            let newModel = { model | sfxEnabled = not model.sfxEnabled }
            in ( newModel, setSFX newModel.sfxEnabled )

        ClearHistory ->
            ( { model | history = [] }, Cmd.none )

        CopyAnswer ans ->
            ( { model | message = "📋 已复制到剪贴板", messageType = Info }
            , copyToClipboard (ans ++ " = 24")
            )

        NoOp -> (model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Time.every 1000 Tick
        , receiveFromStorage StorageLoaded
        , if not (List.isEmpty model.newAchievements) then
            Time.every 4000 (\_ -> DismissAchievements)
          else
            Sub.none
        ]


-- ============ VIEW ============

css : Html msg
css =
    node "style"
        []
        [ text """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: radial-gradient(ellipse at top, #1a1a3e 0%, #0d0d1a 50%, #050510 100%); margin: 0; min-height: 100vh; color: #eee; }
.container { max-width: 900px; margin: 0 auto; padding: 16px; }
.header { text-align: center; margin-bottom: 24px; position: relative; }
.header h1 { font-size: 2.8em; margin: 0; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #e94560, #ff6b6b, #ffd93d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(233,69,96,0.4)); }
.header p { color: #8892b0; margin-top: 6px; font-size: 1em; font-weight: 400; }
.stats { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.stat-box { background: rgba(255,255,255,0.04); border-radius: 14px; padding: 10px 16px; text-align: center; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; }
.stat-box:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
.stat-label { font-size: 0.65em; color: #8892b0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
.stat-value { font-size: 1.3em; font-weight: 700; color: #e94560; margin-top: 2px; }
.stat-fire { font-size: 1.1em; animation: firePulse 1s ease infinite; }
@keyframes firePulse { 0%,100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.2); filter: brightness(1.3); } }
.cards-area { display: flex; justify-content: center; gap: 12px; margin: 24px 0; flex-wrap: wrap; perspective: 800px; }
.card {
  width: 90px; height: 126px; background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 40%, #e8e8e8 100%);
  border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8);
  position: relative; transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer; overflow: hidden; border: 1px solid rgba(0,0,0,0.08);
}
.card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.015) 8px, rgba(0,0,0,0.015) 16px); pointer-events: none; }
.card:hover { transform: translateY(-10px) rotateX(8deg) rotateY(-5deg) scale(1.08); box-shadow: 0 20px 40px rgba(0,0,0,0.6); z-index: 10; }
.card:active { transform: scale(0.95); }
@keyframes dealIn { 0% { opacity: 0; transform: translateY(-60px) rotateZ(-10deg) scale(0.7); } 70% { transform: translateY(5px) rotateZ(2deg) scale(1.02); } 100% { opacity: 1; transform: translateY(0) rotateZ(0) scale(1); } }
.card { animation: dealIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
.card:nth-child(1) { animation-delay: 0.08s; }
.card:nth-child(2) { animation-delay: 0.16s; }
.card:nth-child(3) { animation-delay: 0.24s; }
.card:nth-child(4) { animation-delay: 0.32s; }
.card-corner-top { position: absolute; top: 6px; left: 8px; display: flex; flex-direction: column; align-items: center; line-height: 1; }
.card-corner-bottom { position: absolute; bottom: 6px; right: 8px; display: flex; flex-direction: column; align-items: center; line-height: 1; transform: rotate(180deg); }
.card-corner-val { font-size: 1.1em; font-weight: 800; }
.card-corner-suit { font-size: 0.85em; }
.card-center-suit { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.8em; opacity: 0.15; }
.input-area { display: flex; gap: 10px; justify-content: center; margin: 16px 0; flex-wrap: wrap; }
.expr-input { flex: 1; min-width: 220px; max-width: 380px; padding: 14px 20px; border: 2px solid rgba(233,69,96,0.25); border-radius: 12px; background: rgba(0,0,0,0.25); color: #fff; font-size: 1.15em; outline: none; transition: all 0.3s; font-family: monospace; box-shadow: inset 0 2px 8px rgba(0,0,0,0.3); }
.expr-input:focus { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.2), inset 0 2px 8px rgba(0,0,0,0.3); }
.expr-input::placeholder { color: #555; }
.btn { padding: 12px 20px; border: none; border-radius: 10px; font-size: 0.9em; cursor: pointer; transition: all 0.15s; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; position: relative; overflow: hidden; }
.btn::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.4s, height 0.4s; }
.btn:active::after { width: 200px; height: 200px; }
.btn:active { transform: scale(0.92); }
.btn-primary { background: linear-gradient(135deg, #e94560, #ff2e63); color: white; box-shadow: 0 4px 20px rgba(233,69,96,0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(233,69,96,0.5); }
.btn-secondary { background: rgba(255,255,255,0.06); color: #ccd6f6; border: 1px solid rgba(255,255,255,0.1); }
.btn-secondary:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
.btn-success { background: linear-gradient(135deg, #00c9ff, #0077ff); color: white; box-shadow: 0 4px 20px rgba(0,201,255,0.3); }
.btn-success:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,201,255,0.4); }
.message { text-align: center; padding: 14px 20px; border-radius: 12px; margin: 12px 0; font-weight: 600; min-height: 24px; font-size: 1.05em; backdrop-filter: blur(10px); }
.msg-success { background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.25); color: #2ecc71; }
.msg-error { background: rgba(231, 76, 60, 0.12); border: 1px solid rgba(231, 76, 60, 0.25); color: #e74c3c; }
.msg-info { background: rgba(52, 152, 219, 0.12); border: 1px solid rgba(52, 152, 219, 0.25); color: #3498db; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-10px) rotate(-1deg); } 30% { transform: translateX(10px) rotate(1deg); } 45% { transform: translateX(-6px); } 60% { transform: translateX(6px); } 75% { transform: translateX(-3px); } }
.msg-pulse { animation: pulse 0.6s ease; }
.msg-shake { animation: shake 0.6s ease; }
.hint-box { background: rgba(255, 193, 7, 0.08); border: 1px dashed rgba(255, 193, 7, 0.35); border-radius: 12px; padding: 14px; margin: 12px 0; text-align: center; color: #ffc107; font-family: monospace; font-size: 1.05em; }
.achievement-toast { position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ffd700, #ffaa00); color: #1a1a2e; padding: 16px 24px; border-radius: 14px; font-weight: 700; box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3); z-index: 10000; animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); max-width: 300px; }
.achievement-toast .ach-title { font-size: 0.75em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 4px; }
.achievement-toast .ach-name { font-size: 1.2em; }
@keyframes slideIn { 0% { transform: translateX(120%) scale(0.8); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; } }
.achievements-panel { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); border-radius: 14px; padding: 16px; margin: 12px 0; }
.achievements-panel h4 { margin: 0 0 10px 0; color: #ffd700; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
.ach-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75em; font-weight: 700; margin: 3px; background: rgba(255,255,255,0.08); color: #8892b0; border: 1px solid rgba(255,255,255,0.1); }
.ach-badge.unlocked { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2)); color: #ffd700; border-color: rgba(255,215,0,0.3); }
.rules { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 20px; margin-top: 24px; border: 1px solid rgba(255,255,255,0.06); }
.rules h3 { margin-top: 0; color: #e94560; font-size: 1.1em; }
.rules ul { padding-left: 20px; color: #8892b0; line-height: 1.8; font-size: 0.95em; }
.rules code { background: rgba(233,69,96,0.12); padding: 2px 8px; border-radius: 6px; color: #ff6b6b; font-family: monospace; font-size: 0.9em; }
.buttons-row { display: flex; gap: 8px; justify-content: center; margin-top: 8px; flex-wrap: wrap; }
.all-answers { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 18px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.08); }
.all-answers-title { font-weight: 700; color: #e94560; margin-bottom: 10px; font-size: 1em; }
.answers-list { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }
.answer-item { background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 1em; color: #ccd6f6; border-left: 3px solid #e94560; transition: all 0.2s; }
.answer-item:hover { background: rgba(0,0,0,0.3); transform: translateX(4px); }
.sfx-toggle { position: absolute; top: 0; right: 0; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #ccd6f6; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; }
.sfx-toggle:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }
.history-panel { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 14px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.06); }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.history-title { font-size: 0.8em; color: #8892b0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
.history-clear { background: none; border: none; color: #e94560; font-size: 0.75em; cursor: pointer; padding: 2px 8px; border-radius: 6px; transition: all 0.2s; }
.history-clear:hover { background: rgba(233,69,96,0.15); }
.history-list { display: flex; flex-wrap: wrap; gap: 6px; }
.history-item { background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.85em; color: #8892b0; border: 1px solid rgba(255,255,255,0.05); }
.footer { text-align: center; margin-top: 24px; color: #555; font-size: 0.8em; padding-bottom: 20px; }
@media (max-width: 600px) { .header h1 { font-size: 2em; } .header { position: relative; } .sfx-toggle { position: relative; top: auto; right: auto; margin-top: 8px; display: inline-block; } .card { width: 72px; height: 100px; } .card-center-suit { font-size: 2em; } .btn { padding: 10px 14px; font-size: 0.8em; } .stats { gap: 6px; } .stat-box { padding: 8px 10px; } }
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

allAchievements : List String
allAchievements = ["首杀", "三连冠", "五连冠", "十连冠", "速算大师", "百题斩"]

viewCard : Card -> Html Msg
viewCard card =
    div [ class "card" ]
        [ div [ class "card-corner-top" ]
            [ span [ style "color" card.color, style "font-size" "1.1em", style "font-weight" "800" ] [ text card.display ]
            , span [ style "color" card.color, style "font-size" "0.85em" ] [ text card.suit ]
            ]
        , div [ class "card-center-suit", style "color" card.color ] [ text card.suit ]
        , div [ class "card-corner-bottom" ]
            [ span [ style "color" card.color, style "font-size" "1.1em", style "font-weight" "800" ] [ text card.display ]
            , span [ style "color" card.color, style "font-size" "0.85em" ] [ text card.suit ]
            ]
        ]

viewAchievementToast : String -> Html Msg
viewAchievementToast name =
    div [ class "achievement-toast" ]
        [ div [ class "ach-title" ] [ text "🏆 解锁成就" ]
        , div [ class "ach-name" ] [ text name ]
        ]

keyDecoder : D.Decoder { key : String, ctrlKey : Bool }
keyDecoder =
    D.map2 (\k c -> { key = k, ctrlKey = c })
        (D.field "key" D.string)
        (D.field "ctrlKey" D.bool)

decodeKey : { key : String, ctrlKey : Bool } -> Msg
decodeKey { key, ctrlKey } =
    if key == "Enter" && ctrlKey then SubmitAnswer
    else if key == "Enter" then SubmitAnswer
    else if key == "Escape" then UpdateInput ""
    else NoOp

view : Model -> Html Msg
view model =
    let streakFire = if model.streak >= 2 then " 🔥" else ""
        total = model.solved + model.skipped
        winRate = if total == 0 then "0%" else String.fromInt (round (toFloat model.solved / toFloat total * 100)) ++ "%"
    in
    div [ class "container" ]
        [ css
        , div [ class "header" ]
            [ h1 [] [ text "24点挑战" ]
            , p [] [ text "用加减乘除和括号，让四张牌算出 24" ]
            , button [ class "sfx-toggle", onClick ToggleSFX ]
                [ text (if model.sfxEnabled then "🔊 音效开" else "🔇 音效关") ]
            ]
        , div [ class "stats" ]
            [ div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "连胜" ]
                , div [ class "stat-value" ] [ span [] [ text (String.fromInt model.streak) ], span [ class "stat-fire" ] [ text streakFire ] ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "已解" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.solved) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "最佳" ]
                , div [ class "stat-value" ] [ text (String.fromInt model.bestStreak) ]
                ]
            , div [ class "stat-box" ]
                [ div [ class "stat-label" ] [ text "胜率" ]
                , div [ class "stat-value" ] [ text winRate ]
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
                , id "expr-input"
                , value model.input
                , placeholder "输入算式，如 (3+3)*8/2  ·  Enter提交  ·  Esc清除"
                , onInput UpdateInput
                , on "keydown" (D.map decodeKey keyDecoder)
                ]
                []
            ]

        , div [ class "buttons-row" ]
            [ button [ class "btn btn-primary", onClick SubmitAnswer ] [ text "✓ 提交" ]
            , button [ class "btn btn-success", onClick ShowHint ] [ text "💡 提示" ]
            , button [ class "btn btn-secondary", onClick ShowAllAnswers ] [ text "📋 全部" ]
            , button [ class "btn btn-secondary", onClick Skip ] [ text "⏭ 跳过" ]
            , button [ class "btn btn-secondary", onClick NewGame ] [ text "🔄 新局" ]
            ]
        , if not (List.isEmpty model.history) then
            div [ class "history-panel" ]
                [ div [ class "history-header" ]
                    [ span [ class "history-title" ] [ text "📝 尝试记录" ]
                    , button [ class "history-clear", onClick ClearHistory ] [ text "清除" ]
                    ]
                , div [ class "history-list" ]
                    (List.indexedMap (\i h -> div [ class "history-item" ] [ text (String.fromInt (i + 1) ++ ". " ++ h) ]) (List.take 8 model.history))
                ]
          else
            text ""
        , if model.showAllAnswers && not (List.isEmpty model.allSolutions) then
            div [ class "all-answers" ]
                [ div [ class "all-answers-title" ] [ text ("全部解法 (" ++ String.fromInt (List.length model.allSolutions) ++ " 个)") ]
                , div [ class "answers-list" ] (List.indexedMap (\i ans -> div [ class "answer-item", onClick (CopyAnswer ans), title "点击复制" ] [ text (String.fromInt (i + 1) ++ ". " ++ ans ++ " = 24") ]) model.allSolutions)
                ]
          else
            text ""
        , if not (List.isEmpty model.newAchievements) then
            div []
                (List.map viewAchievementToast model.newAchievements
                    ++ [ div [ style "text-align" "center", style "margin-top" "8px" ] [ button [ class "btn btn-secondary", onClick DismissAchievements ] [ text "知道了 👍" ] ] ]
                )
          else
            text ""
        , div [ class "achievements-panel" ]
            [ h4 [] [ text "🏅 成就墙" ]
            , div []
                (List.map (\a ->
                    span [ class (if List.member a model.achievements then "ach-badge unlocked" else "ach-badge") ] [ text a ]
                ) allAchievements)
            ]
        , div [ class "rules" ]
            [ h3 [] [ text "游戏规则" ]
            , p [] [ text "从扑克牌中随机抽取4张牌（A=1, J=11, Q=12, K=13），用加减乘除算出24" ]
            , ul []
                [ li [] [ text "只能使用加、减、乘、除和括号" ]
                , li [] [ text "每张牌必须且只能使用一次" ]
                , li [] [ text "最终结果必须恰好等于24" ]
                , li [] [ text "支持分数运算，如 8/(3-8/3) = 24" ]
                ]
            , p [] [ text "示例：" ]
            , ul []
                [ li [] [ text "3, 3, 8, 8 → ", code [] [ text "8/(3-8/3)" ], text " = 24" ]
                , li [] [ text "4, 4, 10, 10 → ", code [] [ text "(10*10-4)/4" ], text " = 24" ]
                , li [] [ text "1, 5, 5, 5 → ", code [] [ text "5*(5-1/5)" ], text " = 24" ]
                ]
            ]
        , div [ class "footer" ]
            [ text "Elm · 纯函数式 · 零运行时错误 · PWA 离线可玩" ]
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
