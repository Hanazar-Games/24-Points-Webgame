port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Html exposing (Html, div, text, button, input, h1, h3, h4, p, span, br, node, ul, li, code)
import Html.Attributes exposing (class, value, style, placeholder, type_, id, title)
import Html.Events exposing (onClick, onInput, on)
import Json.Decode as D
import Json.Encode as E
import Process
import Random
import Dict
import Set
import Task
import Time


-- ============ TYPES ============

type alias Card =
    { value : Int
    , suit : String
    , display : String
    , color : String
    }

type Difficulty = Easy | Normal | Hard

type Theme = Dark | Light

type GameMode = Classic | Daily | TimeAttack

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
    , hintLevel : Int
    , allSolutions : List String
    , bestStreak : Int
    , totalGames : Int
    , timer : Int
    , showAllAnswers : Bool
    , totalTime : Int
    , achievements : List String
    , newAchievements : List String
    , achievementTimer : Int
    , history : List String
    , sfxEnabled : Bool
    , pendingNewCards : Bool
    , difficulty : Difficulty
    , liveResult : String
    , gameMode : GameMode
    , theme : Theme
    , timeLeft : Int
    , timeAttackScore : Int
    , timeAttackBest : Int
    , dailyDate : String
    , dailyCompleted : Bool
    , dailyBestTime : Int
    , fastestSolve : Int
    , totalAttempts : Int
    , keypadEnabled : Bool
    , sharedCount : Int
    , stepsWithKeypad : Int
    , skippedProblems : List SkippedProblem
    , showSkippedProblems : Bool
    , solverCache : Dict.Dict String (List String)
    , comboDisplay : Maybe Int
    , shieldActive : Bool
    }

type alias SkippedProblem =
    { cardValues : List Int
    , answer : String
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
    | ChangeDifficulty Difficulty
    | ChangeTheme Theme
    | SetGameMode GameMode
    | StartTimeAttack
    | CardClick Int
    | BackspaceInput
    | KeypadInput String
    | ToggleKeypad
    | ShareProblem
    | ToggleSkippedProblems
    | ClearCombo
    | NoOp

type alias Flags =
    { today : String
    , hash : String
    }


-- ============ PORTS ============

port saveToStorage : String -> Cmd msg
port loadFromStorage : () -> Cmd msg
port receiveFromStorage : (String -> msg) -> Sub msg
port playSound : String -> Cmd msg
port spawnParticles : Int -> Cmd msg
port setSFX : Bool -> Cmd msg
port copyToClipboard : String -> Cmd msg
port setHash : String -> Cmd msg


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
            if Char.isDigit c || c == '.' then
                let (digits, remaining) = spanList (\ch -> Char.isDigit ch || ch == '.') (c :: rest)
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
unique list = List.foldl (\x set -> Set.insert x set) Set.empty list |> Set.toList

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

cacheKey : List Float -> String
cacheKey nums = nums |> List.map (\n -> round (n * 1000)) |> List.sort |> List.map String.fromInt |> String.join ","

solve24Cached : Dict.Dict String (List String) -> List Float -> (List String, Dict.Dict String (List String))
solve24Cached cache nums =
    let key = cacheKey nums
    in case Dict.get key cache of
        Just solutions -> (solutions, cache)
        Nothing ->
            let solutions = solve24 nums
            in (solutions, Dict.insert key solutions cache)

parseHashCards : String -> Maybe (List Int)
parseHashCards hash =
    if String.isEmpty hash then Nothing
    else
        let nums = hash |> String.replace "#" "" |> String.split "," |> List.filterMap String.toInt
        in if List.length nums == 4 then Just nums else Nothing

hasDivision : String -> Bool
hasDivision s = String.contains "/" s

hasDivisionSolution : List String -> Bool
hasDivisionSolution solutions = List.any hasDivision solutions

exprHasDiv : Expr -> Bool
exprHasDiv e =
    case e of
        Num _ -> False
        DivE _ _ -> True
        AddE l r -> exprHasDiv l || exprHasDiv r
        SubE l r -> exprHasDiv l || exprHasDiv r
        MulE l r -> exprHasDiv l || exprHasDiv r

countOps : Expr -> Int
countOps e =
    case e of
        Num _ -> 0
        AddE l r -> 1 + countOps l + countOps r
        SubE l r -> 1 + countOps l + countOps r
        MulE l r -> 1 + countOps l + countOps r
        DivE l r -> 1 + countOps l + countOps r


-- ============ HINT SYSTEM ============

evalOrZero : Expr -> Float
evalOrZero e = Maybe.withDefault 0 (evalExpr e)

hintOpName : Expr -> String
hintOpName expr =
    case expr of
        AddE _ _ -> "加法"
        SubE _ _ -> "减法"
        MulE _ _ -> "乘法"
        DivE _ _ -> "除法"
        Num _ -> ""

hintLevel1 : Expr -> String
hintLevel1 expr =
    case expr of
        Num n -> "答案就是 " ++ fmt n
        _ ->
            let op = hintOpName expr
            in "提示：试着用" ++ op ++ "来完成最后一步"

hintLevel2 : Expr -> String
hintLevel2 expr =
    case expr of
        Num n -> "答案就是 " ++ fmt n
        AddE l r ->
            case (evalExpr l, evalExpr r) of
                (Just lv, Just rv) -> "提示：" ++ fmt lv ++ " + " ++ fmt rv ++ " = 24"
                _ -> hintLevel1 expr
        SubE l r ->
            case (evalExpr l, evalExpr r) of
                (Just lv, Just rv) -> "提示：" ++ fmt lv ++ " - " ++ fmt rv ++ " = 24"
                _ -> hintLevel1 expr
        MulE l r ->
            case (evalExpr l, evalExpr r) of
                (Just lv, Just rv) -> "提示：" ++ fmt lv ++ " × " ++ fmt rv ++ " = 24"
                _ -> hintLevel1 expr
        DivE l r ->
            case (evalExpr l, evalExpr r) of
                (Just lv, Just rv) -> "提示：" ++ fmt lv ++ " ÷ " ++ fmt rv ++ " = 24"
                _ -> hintLevel1 expr

getStepHint : Int -> String -> String
getStepHint level solution =
    case parseExpr (tokenize solution) of
        Nothing -> solution
        Just (expr, rest) ->
            if not (List.isEmpty rest) then solution
            else
                case level of
                    1 -> hintLevel1 expr
                    2 -> hintLevel2 expr
                    _ -> "参考解法：" ++ solution


-- ============ RANDOM CARDS ============

randomCard : Int -> Random.Generator Card
randomCard maxVal =
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
        (Random.int 1 maxVal)
        (Random.int 0 3)

generateCards : Difficulty -> Cmd Msg
generateCards diff =
    let
        maxVal = case diff of
            Easy -> 10
            Normal -> 13
            Hard -> 13
    in
    Random.generate NewCards (Random.list 4 (randomCard maxVal))

dateSeedInt : String -> Int
dateSeedInt s =
    String.foldl (\c acc -> modBy 2147483647 (acc * 31 + Char.toCode c)) 0 s

generateDailyCards : String -> Cmd Msg
generateDailyCards dateStr =
    let tryFindSuitable initSeed attempt =
            let generator = Random.list 4 (randomCard 13)
                (dailyCards, nextSeed) = Random.step generator initSeed
            in
            if List.isEmpty (solve24 (List.map (\c -> toFloat c.value) dailyCards)) && attempt < 100 then
                tryFindSuitable nextSeed (attempt + 1)
            else
                dailyCards
        dailySeed = Random.initialSeed (dateSeedInt dateStr)
        cards = tryFindSuitable dailySeed 0
    in
    Task.succeed cards |> Task.perform NewCards


-- ============ INIT / UPDATE ============

createCard : Int -> Int -> Card
createCard val suitIdx =
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

init : Flags -> (Model, Cmd Msg)
init flags =
    let baseModel =
            { cards = []
            , input = ""
            , message = "点击「新游戏」开始24点挑战！"
            , messageType = Info
            , streak = 0
            , solved = 0
            , skipped = 0
            , showHint = False
            , hintText = ""
            , hintLevel = 0
            , allSolutions = []
            , bestStreak = 0
            , totalGames = 0
            , timer = 0
            , showAllAnswers = False
            , totalTime = 0
            , achievements = []
            , newAchievements = []
            , achievementTimer = 0
            , history = []
            , sfxEnabled = True
            , pendingNewCards = False
            , difficulty = Normal
            , liveResult = ""
            , gameMode = Classic
            , theme = Dark
            , timeLeft = 0
            , timeAttackScore = 0
            , timeAttackBest = 0
            , dailyDate = flags.today
            , dailyCompleted = False
            , dailyBestTime = 0
            , fastestSolve = 0
            , totalAttempts = 0
            , keypadEnabled = True
            , sharedCount = 0
            , stepsWithKeypad = 0
            , skippedProblems = []
            , showSkippedProblems = False
            , solverCache = Dict.empty
            , comboDisplay = Nothing
            , shieldActive = False
            }
    in
    case parseHashCards flags.hash of
        Just values ->
            let cards = List.indexedMap createCard values
            in ( { baseModel | message = "好友分享的题目！来挑战吧！", messageType = Info }
               , Cmd.batch [ Task.succeed cards |> Task.perform NewCards, loadFromStorage () ]
               )
        Nothing ->
            ( baseModel, Cmd.batch [ generateCards Normal, loadFromStorage () ] )


-- ============ STORAGE ============

themeEncoder : Theme -> E.Value
themeEncoder t =
    case t of
        Dark -> E.string "dark"
        Light -> E.string "light"

themeDecoder : D.Decoder Theme
themeDecoder =
    D.string |> D.andThen (\s ->
        case s of
            "light" -> D.succeed Light
            _ -> D.succeed Dark
    )

encodeStats : Model -> String
encodeStats model =
    E.encode 0
        (E.object
            [ ("bestStreak", E.int model.bestStreak)
            , ("totalSolved", E.int model.solved)
            , ("totalSkipped", E.int model.skipped)
            , ("totalTime", E.int model.totalTime)
            , ("achievements", E.list E.string model.achievements)
            , ("sfxEnabled", E.bool model.sfxEnabled)
            , ("history", E.list E.string (List.take 20 model.history))
            , ("theme", themeEncoder model.theme)
            , ("timeAttackBest", E.int model.timeAttackBest)
            , ("dailyCompletedDate", E.string (if model.dailyCompleted then model.dailyDate else ""))
            , ("dailyBestTime", E.int model.dailyBestTime)
            , ("fastestSolve", E.int model.fastestSolve)
            , ("totalAttempts", E.int model.totalAttempts)
            , ("keypadEnabled", E.bool model.keypadEnabled)
            , ("sharedCount", E.int model.sharedCount)
            , ("stepsWithKeypad", E.int model.stepsWithKeypad)
            ]
        )

type alias DecodedBase =
    { bestStreak : Int
    , totalSolved : Int
    , totalSkipped : Int
    , totalTime : Int
    , achievements : List String
    , sfxEnabled : Bool
    , history : List String
    , theme : Theme
    }

decodeStats : String -> Model -> Model
decodeStats json model =
    let baseDecoder =
            D.map8 DecodedBase
                (D.maybe (D.field "bestStreak" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "totalSolved" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "totalSkipped" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "totalTime" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "achievements" (D.list D.string)) |> D.map (Maybe.withDefault []))
                (D.maybe (D.field "sfxEnabled" D.bool) |> D.map (Maybe.withDefault True))
                (D.maybe (D.field "history" (D.list D.string)) |> D.map (Maybe.withDefault []))
                (D.maybe (D.field "theme" themeDecoder) |> D.map (Maybe.withDefault Dark))
        
        fullDecoder =
            D.andThen
                (\base ->
                    D.map8
                        (\tab dcd dbt fs ta kb sc swk ->
                            { model
                                | bestStreak = max model.bestStreak base.bestStreak
                                , solved = model.solved + base.totalSolved
                                , skipped = model.skipped + base.totalSkipped
                                , totalTime = model.totalTime + base.totalTime
                                , achievements = model.achievements ++ base.achievements
                                , sfxEnabled = base.sfxEnabled
                                , history = model.history ++ base.history
                                , theme = base.theme
                                , timeAttackBest = tab
                                , dailyCompleted = (dcd == model.dailyDate)
                                , dailyBestTime = dbt
                                , fastestSolve = if fs > 0 then fs else model.fastestSolve
                                , totalAttempts = model.totalAttempts + ta
                                , keypadEnabled = kb
                                , sharedCount = sc
                                , stepsWithKeypad = swk
                                }
                        )
                        (D.maybe (D.field "timeAttackBest" D.int) |> D.map (Maybe.withDefault 0))
                        (D.maybe (D.field "dailyCompletedDate" D.string) |> D.map (Maybe.withDefault ""))
                        (D.maybe (D.field "dailyBestTime" D.int) |> D.map (Maybe.withDefault 0))
                        (D.maybe (D.field "fastestSolve" D.int) |> D.map (Maybe.withDefault 0))
                        (D.maybe (D.field "totalAttempts" D.int) |> D.map (Maybe.withDefault 0))
                        (D.maybe (D.field "keypadEnabled" D.bool) |> D.map (Maybe.withDefault True))
                        (D.maybe (D.field "sharedCount" D.int) |> D.map (Maybe.withDefault 0))
                        (D.maybe (D.field "stepsWithKeypad" D.int) |> D.map (Maybe.withDefault 0))
                )
                baseDecoder
    in
    case D.decodeString fullDecoder json of
        Ok newModel -> newModel
        Err _ -> model

saveCmd : Model -> Cmd Msg
saveCmd model =
    saveToStorage (encodeStats model)


-- ============ ACHIEVEMENTS ============

allAchievements : List String
allAchievements = ["首杀", "三连冠", "五连冠", "十连冠", "速算大师", "百题斩", "每日首胜", "极速60秒", "火神", "键盘侠", "分享达人", "步步为营"]

checkAchievements : Model -> List String
checkAchievements model =
    let all =
            [ ("首杀", model.solved >= 1)
            , ("三连冠", model.streak >= 3)
            , ("五连冠", model.streak >= 5)
            , ("十连冠", model.streak >= 10)
            , ("速算大师", model.timer <= 10 && model.solved > 0)
            , ("百题斩", model.solved >= 100)
            , ("每日首胜", model.gameMode == Daily && model.dailyCompleted)
            , ("极速60秒", model.timeAttackBest >= 5)
            , ("火神", model.streak >= 20)
            , ("键盘侠", model.stepsWithKeypad >= 10)
            , ("分享达人", model.sharedCount >= 3)
            , ("步步为营", model.solved >= 1)  -- 在handleCorrect中根据步数判断
            ]
    in List.filterMap (\(name, cond) -> if cond && not (List.member name model.achievements) then Just name else Nothing) all

addToHistory : String -> List String -> List String
addToHistory input hist =
    if String.isEmpty input then hist
    else if List.member input hist then hist
    else input :: hist

computeLiveResult : String -> List Float -> String
computeLiveResult input cardValues =
    if String.isEmpty input then ""
    else
        let tokens = tokenize input
        in case parseExpr tokens of
            Nothing -> ""
            Just (expr, rest) ->
                if not (List.isEmpty rest) then ""
                else
                    case evalExpr expr of
                        Nothing -> "计算错误"
                        Just result ->
                            let usedNums = extractNums expr
                                numsOk = matchCards cardValues usedNums
                            in
                            if not numsOk then ""
                            else "= " ++ fmt result

computeUsedNumsHint : String -> List Float -> String
computeUsedNumsHint input cardValues =
    if String.isEmpty input then ""
    else
        case parseExpr (tokenize input) of
            Nothing -> ""
            Just (expr, rest) ->
                if not (List.isEmpty rest) then ""
                else
                    let usedNums = extractNums expr |> List.sort
                        expected = List.sort cardValues
                        remaining = List.filter (\n -> not (List.member (round (n * 1000)) (List.map (\x -> round (x * 1000)) usedNums))) expected
                    in
                    if List.isEmpty remaining then
                        "已用全部数字 ✓"
                    else
                        let usedStr = String.join ", " (List.map fmt usedNums)
                            remStr = String.join ", " (List.map fmt remaining)
                        in
                        "已用: " ++ usedStr ++ " | 剩余: " ++ remStr


-- ============ UPDATE ============

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        NewCards cards ->
            let cardFloats = List.map (\c -> toFloat c.value) cards
                (solutions, newCache) = solve24Cached model.solverCache cardFloats
            in
            if List.isEmpty solutions then
                ( { model | solverCache = newCache }, generateCards model.difficulty )
            else if model.difficulty == Hard && not (hasDivisionSolution solutions) then
                ( { model | solverCache = newCache }, generateCards model.difficulty )
            else
                let isFirstGame = model.totalGames == 0
                    baseMsg = case model.gameMode of
                        Daily -> "今日挑战！用这4张牌算出24"
                        TimeAttack -> "计时挑战！答对+10秒，跳过-5秒"
                        _ -> if isFirstGame then "请用下面4张牌算出24点！" else "新的一组牌！"
                    hashCmd =
                        if model.gameMode == Classic then
                            setHash (String.join "," (List.map (\c -> String.fromInt c.value) cards))
                        else
                            Cmd.none
                in
                ( { model
                    | cards = cards
                    , allSolutions = solutions
                    , solverCache = newCache
                    , message = baseMsg
                    , messageType = Info
                    , input = ""
                    , showHint = False
                    , hintText = ""
                    , hintLevel = 0
                    , totalGames = model.totalGames + 1
                    , timer = 0
                    , pendingNewCards = False
                    , showAllAnswers = False
                  }
                , Cmd.batch [ playSound "deal", Task.attempt (\_ -> NoOp) (Dom.focus "expr-input"), hashCmd ]
                )

        UpdateInput s ->
            let live = computeLiveResult s (List.map (\c -> toFloat c.value) model.cards)
            in ( { model | input = s, liveResult = live }, Cmd.none )

        SubmitAnswer ->
            let cardValues = List.map (\c -> toFloat c.value) model.cards
                newAttempts = model.totalAttempts + 1
            in case parseAndValidate model.input cardValues of
                Ok result ->
                    if abs(result - 24) < 0.0001 then
                        if model.difficulty == Hard then
                            case parseExpr (tokenize model.input) of
                                Just (expr, rest) ->
                                    if List.isEmpty rest && exprHasDiv expr then
                                        handleCorrect { model | totalAttempts = newAttempts }
                                    else
                                        let newHistory = if String.isEmpty model.input then model.history else addToHistory model.input model.history
                                        in ( { model | message = "Hard 模式答案必须用到除法！", messageType = Error, streak = 0, history = newHistory, totalAttempts = newAttempts }, playSound "error" )
                                Nothing ->
                                    handleCorrect { model | totalAttempts = newAttempts }
                        else
                            handleCorrect { model | totalAttempts = newAttempts }
                    else
                        let newHistory = if String.isEmpty model.input then model.history else addToHistory model.input model.history
                            errModel = { model | message = "结果是 " ++ fmt result ++ "，不是24！", messageType = Error, streak = 0, history = newHistory, totalAttempts = newAttempts }
                        in ( errModel, playSound "error" )
                Err errMsg ->
                    let newHistory = if String.isEmpty model.input then model.history else addToHistory model.input model.history
                        newModel = { model | message = errMsg, messageType = Error, streak = 0, history = newHistory, totalAttempts = newAttempts }
                    in ( newModel, Cmd.batch [ saveCmd newModel, playSound "error" ] )

        ShowHint ->
            case model.allSolutions of
                [] ->
                    ( { model | message = "这道题无解！点击「跳过」换一组。", messageType = Info }, playSound "click" )
                first :: _ ->
                    let newLevel = min 3 (model.hintLevel + 1)
                        hint = getStepHint newLevel first
                    in
                    ( { model | showHint = True, hintLevel = newLevel, hintText = hint, message = "提示已显示（" ++ String.fromInt newLevel ++ "/3）", messageType = Info }, playSound "click" )

        ShowAllAnswers ->
            ( { model | showAllAnswers = True, message = "显示全部 " ++ String.fromInt (List.length model.allSolutions) ++ " 个解法", messageType = Info }, playSound "click" )

        NewGame ->
            case model.gameMode of
                TimeAttack ->
                    let newModel = { model | timeLeft = 60, timeAttackScore = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )
                _ ->
                    ( { model | streak = 0, message = "新游戏开始！", messageType = Info, timer = 0, showAllAnswers = False, newAchievements = [], pendingNewCards = True }
                    , Cmd.batch [ generateCards model.difficulty, playSound "click" ]
                    )

        Skip ->
            if model.pendingNewCards then
                ( model, Cmd.none )
            else
                let problem =
                        { cardValues = List.map .value model.cards
                        , answer = Maybe.withDefault "" (List.head model.allSolutions)
                        }
                    newSkippedProblems = problem :: List.take 19 model.skippedProblems
                    hasShield = model.streak >= 3 && not model.shieldActive
                in
                case model.gameMode of
                    TimeAttack ->
                        let newTimeLeft = max 0 (model.timeLeft - 5)
                            newModel =
                                { model
                                    | skipped = model.skipped + 1
                                    , streak = if hasShield then model.streak else 0
                                    , message = if hasShield then "护盾保护！跳过不中断连胜。答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions) else "跳过！扣5秒。答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions)
                                    , messageType = Info
                                    , showAllAnswers = True
                                    , timeLeft = newTimeLeft
                                    , pendingNewCards = True
                                    , skippedProblems = newSkippedProblems
                                    , shieldActive = if hasShield then True else model.shieldActive
                                }
                        in
                        ( newModel
                        , Cmd.batch
                            [ Task.perform (\_ -> DelayedNewCards) (Process.sleep 1500)
                            , saveCmd newModel
                            , playSound "click"
                            ]
                        )
                    _ ->
                        let newModel =
                                { model
                                    | skipped = model.skipped + 1
                                    , streak = if hasShield then model.streak else 0
                                    , message = if hasShield then "护盾保护！跳过不中断连胜。答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions) else "跳过！答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions)
                                    , messageType = Info
                                    , showAllAnswers = True
                                    , pendingNewCards = True
                                    , skippedProblems = newSkippedProblems
                                    , shieldActive = if hasShield then True else model.shieldActive
                                }
                        in
                        ( newModel
                        , Cmd.batch
                            [ Task.perform (\_ -> DelayedNewCards) (Process.sleep 1500)
                            , saveCmd newModel
                            , playSound "click"
                            ]
                        )

        Tick _ ->
            case model.gameMode of
                TimeAttack ->
                    if model.timeLeft <= 1 then
                        let finalScore = model.timeAttackScore
                            newBest = max finalScore model.timeAttackBest
                            gameOverModel = { model | timeLeft = 0, timeAttackBest = newBest, message = "时间到！最终得分：" ++ String.fromInt finalScore, messageType = Info, pendingNewCards = False }
                        in
                        ( gameOverModel, Cmd.batch [ saveCmd gameOverModel, playSound "error" ] )
                    else
                        let newTimeLeft = model.timeLeft - 1
                        in
                        ( { model | timeLeft = newTimeLeft, timer = model.timer + 1, totalTime = model.totalTime + 1 }
                        , if newTimeLeft <= 10 then playSound "tick" else Cmd.none
                        )
                _ ->
                    let newTimer = model.timer + 1
                        newTotalTime = model.totalTime + 1
                        newAchTimer = max 0 (model.achievementTimer - 1)
                        clearedAch = if newAchTimer == 0 && model.achievementTimer > 0 then [] else model.newAchievements
                    in
                    ( { model
                        | timer = newTimer
                        , totalTime = newTotalTime
                        , achievementTimer = newAchTimer
                        , newAchievements = clearedAch
                      }
                    , Cmd.none
                    )

        StorageLoaded json ->
            let newModel = decodeStats json model
            in ( newModel, Cmd.none )

        DelayedNewCards ->
            case model.gameMode of
                TimeAttack ->
                    if model.timeLeft <= 0 then
                        ( { model | pendingNewCards = False }, Cmd.none )
                    else
                        ( { model | pendingNewCards = False }, generateCards model.difficulty )
                _ ->
                    ( { model | pendingNewCards = False }, generateCards model.difficulty )

        DismissAchievements ->
            ( { model | newAchievements = [] }, Cmd.none )

        ToggleSFX ->
            let newModel = { model | sfxEnabled = not model.sfxEnabled }
            in ( newModel, setSFX newModel.sfxEnabled )

        ClearHistory ->
            let newModel = { model | history = [] }
            in ( newModel, saveCmd newModel )

        CopyAnswer ans ->
            ( { model | message = "已复制到剪贴板", messageType = Info }
            , copyToClipboard (ans ++ " = 24")
            )

        ChangeDifficulty diff ->
            ( { model | difficulty = diff, message = "难度切换为" ++ difficultyName diff, messageType = Info, streak = 0, showAllAnswers = False, newAchievements = [], pendingNewCards = True }
            , Cmd.batch [ generateCards diff, playSound "click" ]
            )

        ChangeTheme t ->
            let newModel = { model | theme = t }
            in ( newModel, saveCmd newModel )

        SetGameMode mode ->
            case mode of
                Daily ->
                    let newModel = { model | gameMode = Daily, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [] }
                    in ( newModel, Cmd.batch [ generateDailyCards model.dailyDate, playSound "click" ] )
                TimeAttack ->
                    let newModel = { model | gameMode = TimeAttack, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], timeLeft = 60, timeAttackScore = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )
                Classic ->
                    let newModel = { model | gameMode = Classic, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], message = "返回经典模式", messageType = Info }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )

        StartTimeAttack ->
            let newModel = { model | gameMode = TimeAttack, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], timeLeft = 60, timeAttackScore = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True }
            in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )

        CardClick val ->
            let newInput = model.input ++ String.fromInt val
                live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
            in ( { model | input = newInput, liveResult = live }, Cmd.batch [ playSound "key", Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] )

        BackspaceInput ->
            let tokens = tokenize model.input
                newTokens = List.take (max 0 (List.length tokens - 1)) tokens
                newInput = String.join "" newTokens
                live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
            in ( { model | input = newInput, liveResult = live }, Cmd.none )

        KeypadInput s ->
            let newInput = model.input ++ s
                live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
            in ( { model | input = newInput, liveResult = live }, playSound "key" )

        ToggleKeypad ->
            ( { model | keypadEnabled = not model.keypadEnabled }, Cmd.none )

        ToggleSkippedProblems ->
            ( { model | showSkippedProblems = not model.showSkippedProblems }, Cmd.none )

        ClearCombo ->
            ( { model | comboDisplay = Nothing }, Cmd.none )

        ShareProblem ->
            let shareText = "24点挑战：" ++ String.join ", " (List.map (\c -> c.display) model.cards) ++ "，你能算出24吗？ https://hanazar-games.github.io/24-Points-Webgame/"
                newShared = model.sharedCount + 1
            in ( { model | message = "题目已复制到剪贴板", messageType = Info, sharedCount = newShared }, copyToClipboard shareText )

        NoOp -> (model, Cmd.none )


clearComboCmd : Cmd Msg
clearComboCmd = Task.perform (\_ -> ClearCombo) (Process.sleep 1500)


handleCorrect : Model -> (Model, Cmd Msg)
handleCorrect model =
    let newFastest = if model.timer > 0 && (model.fastestSolve == 0 || model.timer < model.fastestSolve) then model.timer else model.fastestSolve
        stepCount =
            case parseExpr (tokenize model.input) of
                Just (expr, rest) ->
                    if List.isEmpty rest then countOps expr else 0
                Nothing -> 0
        stepMsg = if stepCount > 0 then "（" ++ String.fromInt stepCount ++ "步运算）" else ""
        newStepsWithKeypad = if model.keypadEnabled then model.stepsWithKeypad + 1 else model.stepsWithKeypad
        bubuAchievement = if stepCount == 3 && not (List.member "步步为营" model.achievements) then ["步步为营"] else []
        newShield = if model.streak + 1 >= 3 then True else False
    in
    case model.gameMode of
        TimeAttack ->
            let newScore = model.timeAttackScore + 1
                newTimeLeft = model.timeLeft + 10
                newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newHistory = addToHistory model.input model.history
                newAch = checkAchievements { model | streak = newStreak, solved = model.solved + 1, stepsWithKeypad = newStepsWithKeypad } ++ bubuAchievement
                hasNewAch = not (List.isEmpty newAch)
                newModel = { model
                    | message = if hasNewAch then "解锁成就！" ++ model.input ++ " = 24 " ++ stepMsg else "+" ++ String.fromInt newScore ++ "分！+10秒！" ++ stepMsg
                    , messageType = Success
                    , streak = newStreak
                    , solved = model.solved + 1
                    , bestStreak = newBestStreak
                    , input = ""
                    , showHint = False
                    , hintLevel = 0
                    , history = newHistory
                    , timeLeft = newTimeLeft
                    , timeAttackScore = newScore
                    , pendingNewCards = True
                    , fastestSolve = newFastest
                    , stepsWithKeypad = newStepsWithKeypad
                    , achievements = model.achievements ++ newAch
                    , newAchievements = newAch
                    , achievementTimer = if hasNewAch then 5 else 0
                    , comboDisplay = Just newStreak
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles (30 + newStreak * 5) ]
                    else [ playSound "success", spawnParticles 30 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 600), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input"), clearComboCmd ] ++ sfx)
            )
        Daily ->
            let newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newSolved = model.solved + 1
                isFirstDaily = not model.dailyCompleted
                newDailyCompleted = True
                newDailyBestTime = if model.dailyBestTime == 0 || model.timer < model.dailyBestTime then model.timer else model.dailyBestTime
                newAch = checkAchievements { model | streak = newStreak, solved = newSolved, dailyCompleted = True, stepsWithKeypad = newStepsWithKeypad } ++ bubuAchievement
                hasNewAch = not (List.isEmpty newAch)
                newHistory = addToHistory model.input model.history
                newModel = { model
                    | message = if hasNewAch then "解锁成就！" ++ model.input ++ " = 24 " ++ stepMsg else if isFirstDaily then "今日挑战完成！" ++ model.input ++ " = 24 " ++ stepMsg else "正确！" ++ model.input ++ " = 24 " ++ stepMsg
                    , messageType = Success
                    , streak = newStreak
                    , solved = newSolved
                    , bestStreak = newBestStreak
                    , input = ""
                    , showHint = False
                    , hintLevel = 0
                    , achievements = model.achievements ++ newAch
                    , newAchievements = newAch
                    , achievementTimer = if hasNewAch then 5 else 0
                    , history = newHistory
                    , dailyCompleted = newDailyCompleted
                    , dailyBestTime = newDailyBestTime
                    , pendingNewCards = True
                    , fastestSolve = newFastest
                    , stepsWithKeypad = newStepsWithKeypad
                    , comboDisplay = Just newStreak
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40 ]
                    else [ playSound "success", spawnParticles 30 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input"), clearComboCmd ] ++ sfx)
            )
        Classic ->
            let newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newSolved = model.solved + 1
                newAch = checkAchievements { model | streak = newStreak, solved = newSolved, stepsWithKeypad = newStepsWithKeypad } ++ bubuAchievement
                hasNewAch = not (List.isEmpty newAch)
                newHistory = addToHistory model.input model.history
                newModel = { model
                    | message = if hasNewAch then "解锁成就！" ++ model.input ++ " = 24 " ++ stepMsg else "正确！" ++ model.input ++ " = 24 " ++ stepMsg
                    , messageType = Success
                    , streak = newStreak
                    , solved = newSolved
                    , bestStreak = newBestStreak
                    , input = ""
                    , showHint = False
                    , hintLevel = 0
                    , achievements = model.achievements ++ newAch
                    , newAchievements = newAch
                    , achievementTimer = if hasNewAch then 5 else 0
                    , history = newHistory
                    , pendingNewCards = True
                    , fastestSolve = newFastest
                    , stepsWithKeypad = newStepsWithKeypad
                    , comboDisplay = Just newStreak
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40 ]
                    else [ playSound "success", spawnParticles 30 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input"), clearComboCmd ] ++ sfx)
            )


difficultyName : Difficulty -> String
difficultyName diff =
    case diff of
        Easy -> "初级（1-10）"
        Normal -> "中级（1-13）"
        Hard -> "高级（必须用除法）"

gameModeName : GameMode -> String
gameModeName mode =
    case mode of
        Classic -> "经典"
        Daily -> "每日"
        TimeAttack -> "计时"

themeName : Theme -> String
themeName t =
    case t of
        Dark -> "Dark"
        Light -> "Light"


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Time.every 1000 Tick
        , receiveFromStorage StorageLoaded
        ]


-- ============ VIEW ============

css : Theme -> Html msg
css theme =
    let
        themeCls =
            case theme of
                Dark ->
                    "dark"

                Light ->
                    "light"
    in
    node "style"
        []
        [ text ("""
body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin: 0; min-height: 100vh; }
.container { max-width: 900px; margin: 0 auto; padding: 16px; min-height: 100vh; }
.container.dark { background: radial-gradient(ellipse at top, #1a1a3e 0%, #0d0d1a 50%, #050510 100%); color: #eee; }
.container.light { background: radial-gradient(ellipse at top, #f5f5f7 0%, #e8e8ec 50%, #ddd 100%); color: #1a1a2e; }
.container, .expr-input, .stat-box, .btn-secondary, .message, .all-answers, .history-panel, .rules, .achievements-panel, .hint-box, .answer-item, .diff-btn, .mode-btn { transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; }

.header { text-align: center; margin-bottom: 24px; position: relative; }
.header h1 { font-size: 2.8em; margin: 0; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #e94560, #ff6b6b, #ffd93d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(233,69,96,0.4)); }
.container.light .header h1 { filter: drop-shadow(0 0 10px rgba(233,69,96,0.2)); }
.header p { margin-top: 6px; font-size: 1em; font-weight: 400; }
.container.dark .header p { color: #8892b0; }
.container.light .header p { color: #64748b; }

.stats { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.stat-box { border-radius: 14px; padding: 10px 16px; text-align: center; backdrop-filter: blur(20px); border: 1px solid; transition: all 0.3s; }
.container.dark .stat-box { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
.container.light .stat-box { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
.stat-box:hover { transform: translateY(-2px); }
.container.dark .stat-box:hover { background: rgba(255,255,255,0.08); }
.container.light .stat-box:hover { background: rgba(0,0,0,0.08); }
.stat-label { font-size: 0.65em; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
.container.dark .stat-label { color: #8892b0; }
.container.light .stat-label { color: #64748b; }
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

.card.streak-glow { box-shadow: 0 4px 20px rgba(233,69,96,0.3), 0 0 30px rgba(233,69,96,0.15); }
.card.streak-fire { box-shadow: 0 4px 20px rgba(255,107,59,0.4), 0 0 40px rgba(255,107,59,0.2); animation: fireGlow 1.5s ease infinite; }
.card.streak-god { box-shadow: 0 4px 20px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.3); animation: godGlow 1s ease infinite; }
@keyframes fireGlow { 0%,100% { box-shadow: 0 4px 20px rgba(255,107,59,0.4), 0 0 40px rgba(255,107,59,0.2); } 50% { box-shadow: 0 4px 20px rgba(255,107,59,0.6), 0 0 60px rgba(255,107,59,0.35); } }
@keyframes godGlow { 0%,100% { box-shadow: 0 4px 20px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.3); } 50% { box-shadow: 0 4px 20px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.5); } }

.input-area { display: flex; gap: 10px; justify-content: center; margin: 16px 0; flex-wrap: wrap; }
.expr-input { flex: 1; min-width: 220px; max-width: 380px; padding: 14px 20px; border: 2px solid rgba(233,69,96,0.25); border-radius: 12px; font-size: 1.15em; outline: none; transition: all 0.3s; font-family: monospace; }
.container.dark .expr-input { background: rgba(0,0,0,0.25); color: #fff; box-shadow: inset 0 2px 8px rgba(0,0,0,0.3); }
.container.light .expr-input { background: rgba(0,0,0,0.05); color: #1a1a2e; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); }
.expr-input:focus { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.2); }
.container.dark .expr-input::placeholder { color: #555; }
.container.light .expr-input::placeholder { color: #999; }

.btn { padding: 12px 20px; border: none; border-radius: 10px; font-size: 0.9em; cursor: pointer; transition: all 0.15s; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; position: relative; overflow: hidden; }
.btn::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.4s, height 0.4s; }
.btn:active::after { width: 200px; height: 200px; }
.btn:active { transform: scale(0.92); }
.btn-primary { background: linear-gradient(135deg, #e94560, #ff2e63); color: white; box-shadow: 0 4px 20px rgba(233,69,96,0.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(233,69,96,0.5); }
.btn-success { background: linear-gradient(135deg, #00c9ff, #0077ff); color: white; box-shadow: 0 4px 20px rgba(0,201,255,0.3); }
.btn-success:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,201,255,0.4); }
.btn-secondary { border: 1px solid; }
.container.dark .btn-secondary { background: rgba(255,255,255,0.06); color: #ccd6f6; border-color: rgba(255,255,255,0.1); }
.container.light .btn-secondary { background: rgba(0,0,0,0.04); color: #475569; border-color: rgba(0,0,0,0.1); }
.container.dark .btn-secondary:hover { background: rgba(255,255,255,0.12); }
.container.light .btn-secondary:hover { background: rgba(0,0,0,0.08); }

.message { text-align: center; padding: 14px 20px; border-radius: 12px; margin: 12px 0; font-weight: 600; min-height: 24px; font-size: 1.05em; backdrop-filter: blur(10px); }
.container.dark .msg-success { background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.25); color: #2ecc71; }
.container.light .msg-success { background: rgba(46, 204, 113, 0.08); border: 1px solid rgba(46, 204, 113, 0.2); color: #27ae60; }
.container.dark .msg-error { background: rgba(231, 76, 60, 0.12); border: 1px solid rgba(231, 76, 60, 0.25); color: #e74c3c; }
.container.light .msg-error { background: rgba(231, 76, 60, 0.08); border: 1px solid rgba(231, 76, 60, 0.2); color: #c0392b; }
.container.dark .msg-info { background: rgba(52, 152, 219, 0.12); border: 1px solid rgba(52, 152, 219, 0.25); color: #3498db; }
.container.light .msg-info { background: rgba(52, 152, 219, 0.08); border: 1px solid rgba(52, 152, 219, 0.2); color: #2980b9; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-10px) rotate(-1deg); } 30% { transform: translateX(10px) rotate(1deg); } 45% { transform: translateX(-6px); } 60% { transform: translateX(6px); } 75% { transform: translateX(-3px); } }
.msg-pulse { animation: pulse 0.6s ease; }
.msg-shake { animation: shake 0.6s ease; }

.hint-box { border: 1px dashed; border-radius: 12px; padding: 14px; margin: 12px 0; text-align: center; font-family: monospace; font-size: 1.05em; }
.container.dark .hint-box { background: rgba(255, 193, 7, 0.08); border-color: rgba(255, 193, 7, 0.35); color: #ffc107; }
.container.light .hint-box { background: rgba(255, 193, 7, 0.06); border-color: rgba(255, 193, 7, 0.3); color: #f39c12; }

.achievement-toast { position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ffd700, #ffaa00); color: #1a1a2e; padding: 16px 24px; border-radius: 14px; font-weight: 700; box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3); z-index: 10000; animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); max-width: 300px; }
.achievement-toast .ach-title { font-size: 0.75em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 4px; }
.achievement-toast .ach-name { font-size: 1.2em; }
@keyframes slideIn { 0% { transform: translateX(120%) scale(0.8); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; } }

.achievements-panel { border-radius: 14px; padding: 16px; margin: 12px 0; }
.container.dark .achievements-panel { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); }
.container.light .achievements-panel { background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.12); }
.achievements-panel h4 { margin: 0 0 10px 0; color: #ffd700; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
.ach-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75em; font-weight: 700; margin: 3px; border: 1px solid; }
.container.dark .ach-badge { background: rgba(255,255,255,0.08); color: #8892b0; border-color: rgba(255,255,255,0.1); }
.container.light .ach-badge { background: rgba(0,0,0,0.05); color: #64748b; border-color: rgba(0,0,0,0.08); }
.ach-badge.unlocked { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2)); color: #ffd700; border-color: rgba(255,215,0,0.3); }

.rules { border-radius: 14px; padding: 20px; margin-top: 24px; }
.container.dark .rules { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.container.light .rules { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }
.rules h3 { margin-top: 0; color: #e94560; font-size: 1.1em; }
.container.dark .rules ul { padding-left: 20px; color: #8892b0; line-height: 1.8; font-size: 0.95em; }
.container.light .rules ul { padding-left: 20px; color: #64748b; line-height: 1.8; font-size: 0.95em; }
.rules code { background: rgba(233,69,96,0.12); padding: 2px 8px; border-radius: 6px; color: #ff6b6b; font-family: monospace; font-size: 0.9em; }

.buttons-row { display: flex; gap: 8px; justify-content: center; margin-top: 8px; flex-wrap: wrap; }

.all-answers { border-radius: 14px; padding: 18px; margin: 12px 0; }
.container.dark .all-answers { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
.container.light .all-answers { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }
.all-answers-title { font-weight: 700; color: #e94560; margin-bottom: 10px; font-size: 1em; }
.answers-list { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }
.answer-item { padding: 10px 14px; border-radius: 8px; font-family: monospace; font-size: 1em; border-left: 3px solid #e94560; transition: all 0.2s; cursor: pointer; }
.container.dark .answer-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }
.container.light .answer-item { background: rgba(0,0,0,0.05); color: #475569; }
.container.dark .answer-item:hover { background: rgba(0,0,0,0.3); }
.container.light .answer-item:hover { background: rgba(0,0,0,0.1); }
.answer-item:hover { transform: translateX(4px); }

.sfx-toggle { position: absolute; top: 0; right: 0; border: 1px solid; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; }
.container.dark .sfx-toggle { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #ccd6f6; }
.container.light .sfx-toggle { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); color: #475569; }
.sfx-toggle:hover { transform: scale(1.05); }
.container.dark .sfx-toggle:hover { background: rgba(255,255,255,0.15); }
.container.light .sfx-toggle:hover { background: rgba(0,0,0,0.1); }

.theme-toggle { position: absolute; top: 0; left: 0; border: 1px solid; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; }
.container.dark .theme-toggle { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #ccd6f6; }
.container.light .theme-toggle { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); color: #475569; }
.theme-toggle:hover { transform: scale(1.05); }
.container.dark .theme-toggle:hover { background: rgba(255,255,255,0.15); }
.container.light .theme-toggle:hover { background: rgba(0,0,0,0.1); }

.difficulty-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 12px; }
.diff-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid; font-size: 0.75em; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
.container.dark .diff-btn { background: rgba(255,255,255,0.04); color: #8892b0; border-color: rgba(255,255,255,0.1); }
.container.light .diff-btn { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }
.container.dark .diff-btn:hover { background: rgba(255,255,255,0.1); }
.container.light .diff-btn:hover { background: rgba(0,0,0,0.08); }
.diff-btn.active { background: linear-gradient(135deg, #e94560, #ff2e63) !important; color: white !important; border-color: transparent !important; box-shadow: 0 4px 15px rgba(233,69,96,0.3); }

.mode-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
.mode-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid; font-size: 0.8em; font-weight: 700; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
.container.dark .mode-btn { background: rgba(255,255,255,0.04); color: #8892b0; border-color: rgba(255,255,255,0.1); }
.container.light .mode-btn { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }
.container.dark .mode-btn:hover { background: rgba(255,255,255,0.1); }
.container.light .mode-btn:hover { background: rgba(0,0,0,0.08); }
.mode-btn.active { background: linear-gradient(135deg, #00c9ff, #0077ff) !important; color: white !important; border-color: transparent !important; box-shadow: 0 4px 15px rgba(0,201,255,0.3); }

.live-result { text-align: center; font-family: monospace; font-size: 1.1em; min-height: 24px; margin: -6px 0 6px 0; transition: all 0.3s; }
.container.dark .live-result { color: #8892b0; }
.container.light .live-result { color: #64748b; }
.live-result.valid { color: #2ecc71; font-weight: 700; }

.history-panel { border-radius: 14px; padding: 14px; margin: 12px 0; }
.container.dark .history-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.container.light .history-panel { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.history-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
.container.dark .history-title { color: #8892b0; }
.container.light .history-title { color: #64748b; }
.history-clear { background: none; border: none; font-size: 0.75em; cursor: pointer; padding: 2px 8px; border-radius: 6px; transition: all 0.2s; }
.container.dark .history-clear { color: #e94560; }
.container.light .history-clear { color: #e94560; }
.container.dark .history-clear:hover { background: rgba(233,69,96,0.15); }
.container.light .history-clear:hover { background: rgba(233,69,96,0.1); }
.history-list { display: flex; flex-wrap: wrap; gap: 6px; }
.history-item { padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.85em; border: 1px solid; }
.container.dark .history-item { background: rgba(0,0,0,0.2); color: #8892b0; border-color: rgba(255,255,255,0.05); }
.container.light .history-item { background: rgba(0,0,0,0.05); color: #64748b; border-color: rgba(0,0,0,0.05); }

.time-attack-bar { width: 100%; height: 6px; border-radius: 3px; margin: 8px 0; overflow: hidden; }
.container.dark .time-attack-bar { background: rgba(255,255,255,0.1); }
.container.light .time-attack-bar { background: rgba(0,0,0,0.1); }
.time-attack-fill { height: 100%; border-radius: 3px; transition: width 1s linear; }
.time-attack-fill.ok { background: linear-gradient(90deg, #00c9ff, #0077ff); }
.time-attack-fill.warn { background: linear-gradient(90deg, #ffd93d, #ff6b6b); }
.time-attack-fill.danger { background: linear-gradient(90deg, #e94560, #ff2e63); }

.daily-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75em; font-weight: 700; margin-left: 8px; }
.container.dark .daily-badge { background: rgba(255,215,0,0.15); color: #ffd700; border: 1px solid rgba(255,215,0,0.3); }
.container.light .daily-badge { background: rgba(255,215,0,0.12); color: #d4a000; border: 1px solid rgba(255,215,0,0.25); }

.footer { text-align: center; margin-top: 24px; font-size: 0.8em; padding-bottom: 20px; }
.container.dark .footer { color: #555; }
.container.light .footer { color: #999; }

.keypad { display: flex; flex-direction: column; gap: 8px; align-items: center; margin: 12px 0; }
.keypad-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.keypad-btn { min-width: 48px; height: 44px; border-radius: 10px; border: 1px solid; font-size: 1.1em; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: monospace; }
.container.dark .keypad-btn { background: rgba(255,255,255,0.06); color: #ccd6f6; border-color: rgba(255,255,255,0.12); }
.container.light .keypad-btn { background: rgba(0,0,0,0.04); color: #475569; border-color: rgba(0,0,0,0.1); }
.container.dark .keypad-btn:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
.container.light .keypad-btn:hover { background: rgba(0,0,0,0.08); transform: translateY(-2px); }
.keypad-btn:active { transform: scale(0.92); }
.keypad-num { min-width: 52px; font-size: 1.2em; }
.keypad-op { min-width: 40px; }
.keypad-del { color: #e94560 !important; }
.keypad-clear { color: #ffd93d !important; }
.keypad-submit { background: linear-gradient(135deg, #e94560, #ff2e63) !important; color: white !important; border-color: transparent !important; }
.keypad-toggle { padding: 4px 12px; border-radius: 20px; border: 1px solid; font-size: 0.7em; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; }
.container.dark .keypad-toggle { background: rgba(255,255,255,0.06); color: #8892b0; border-color: rgba(255,255,255,0.1); }
.container.light .keypad-toggle { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }

.used-hint { text-align: center; font-size: 0.8em; margin: -4px 0 8px 0; font-weight: 600; }
.container.dark .used-hint { color: #6bcb77; }
.container.light .used-hint { color: #27ae60; }

.skipped-panel { border-radius: 14px; padding: 16px; margin: 12px 0; }
.container.dark .skipped-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.container.light .skipped-panel { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }
.skipped-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 8px; }
.skipped-header h4 { margin: 0; color: #e94560; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
.skipped-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; }
.skipped-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 0.9em; }
.container.dark .skipped-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }
.container.light .skipped-item { background: rgba(0,0,0,0.05); color: #475569; }
.skipped-ans { color: #e94560; font-size: 0.85em; }

@keyframes popUp { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
.pop-animation { animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

.combo-popup { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #e94560, #ff2e63); color: white; padding: 20px 40px; border-radius: 20px; font-size: 2em; font-weight: 900; z-index: 10001; box-shadow: 0 20px 60px rgba(233,69,96,0.5); animation: comboPop 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; pointer-events: none; text-align: center; }
.combo-shield { font-size: 0.5em; margin-top: 8px; color: #ffd700; font-weight: 700; }
@keyframes comboPop { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; } 70% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; } }

@media (max-width: 600px) {
    .header h1 { font-size: 2em; }
    .header { position: relative; }
    .sfx-toggle, .theme-toggle { position: relative; top: auto; right: auto; left: auto; margin-top: 8px; display: inline-block; }
    .card { width: 72px; height: 100px; }
    .card-center-suit { font-size: 2em; }
    .btn { padding: 10px 14px; font-size: 0.8em; }
    .stats { gap: 6px; }
    .stat-box { padding: 8px 10px; }
}
""") ]

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

viewCard : Card -> Int -> Html Msg
viewCard card streak =
    let glowClass =
            if streak >= 20 then " streak-god"
            else if streak >= 10 then " streak-fire"
            else if streak >= 3 then " streak-glow"
            else ""
    in
    div [ class ("card" ++ glowClass), onClick (CardClick card.value), title ("点击输入 " ++ String.fromInt card.value) ]
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

viewAchievementToast : Int -> String -> Html Msg
viewAchievementToast idx name =
    div [ class "achievement-toast", style "top" (String.fromInt (20 + idx * 80) ++ "px") ]
        [ div [ class "ach-title" ] [ text "解锁成就" ]
        , div [ class "ach-name" ] [ text name ]
        ]

keyDecoder : D.Decoder { key : String, ctrlKey : Bool }
keyDecoder =
    D.map2 (\k c -> { key = k, ctrlKey = c })
        (D.field "key" D.string)
        (D.oneOf [ D.field "ctrlKey" D.bool, D.succeed False ])

decodeKey : { key : String, ctrlKey : Bool } -> Msg
decodeKey { key, ctrlKey } =
    if key == "Enter" && ctrlKey then SubmitAnswer
    else if key == "Enter" then SubmitAnswer
    else if key == "Escape" then UpdateInput ""
    else if key == "Backspace" then BackspaceInput
    else NoOp

viewKeypad : Model -> Html Msg
viewKeypad model =
    let uniqueCards =
            model.cards
                |> List.foldl (\c acc -> if List.any (\existing -> existing.value == c.value) acc then acc else c :: acc) []
                |> List.sortBy .value
        ops = ["+", "-", "*", "/", "(", ")"]
    in
    div [ class "keypad" ]
        [ button [ class "keypad-toggle", onClick ToggleKeypad ] [ text (if model.keypadEnabled then "隐藏键盘" else "显示键盘") ]
        , if model.keypadEnabled then
            div []
                [ div [ class "keypad-row" ] (List.map (\c -> button [ class "keypad-btn keypad-num", onClick (KeypadInput (String.fromInt c.value)) ] [ text c.display ]) uniqueCards)
                , div [ class "keypad-row" ] (List.map (\o -> button [ class "keypad-btn keypad-op", onClick (KeypadInput o) ] [ text o ]) ops)
                , div [ class "keypad-row" ]
                    [ button [ class "keypad-btn keypad-del", onClick BackspaceInput ] [ text "⌫" ]
                    , button [ class "keypad-btn keypad-clear", onClick (UpdateInput "") ] [ text "C" ]
                    , button [ class "keypad-btn keypad-submit", onClick SubmitAnswer ] [ text "✓" ]
                    ]
                ]
          else
            text ""
        ]

viewTimeAttackBar : Int -> Html Msg
viewTimeAttackBar timeLeft =
    let pct = clamp 0 100 (timeLeft * 100 // 60)
        barClass =
            if timeLeft <= 10 then "time-attack-fill danger"
            else if timeLeft <= 25 then "time-attack-fill warn"
            else "time-attack-fill ok"
    in
    div [ class "time-attack-bar" ]
        [ div [ class barClass, style "width" (String.fromInt pct ++ "%") ] [] ]

view : Model -> Html Msg
view model =
    let streakFire = if model.streak >= 2 then " 🔥" else ""
        total = model.solved + model.skipped
        winRate = if total == 0 then "0%" else String.fromInt (round (toFloat model.solved / toFloat total * 100)) ++ "%"
        themeClass =
            case model.theme of
                Dark ->
                    "dark"

                Light ->
                    "light"
        isTimeAttack = model.gameMode == TimeAttack
        isDaily = model.gameMode == Daily
    in
    div [ class ("container " ++ themeClass) ]
        [ css model.theme
        , div [ class "header" ]
            [ button [ class "theme-toggle", onClick (ChangeTheme (if model.theme == Dark then Light else Dark)) ]
                [ text (themeName model.theme) ]
            , h1 [] [ text "24点挑战" ]
            , p [] [ text "用加减乘除和括号，让四张牌算出 24" ]
            , button [ class "sfx-toggle", onClick ToggleSFX ]
                [ text (if model.sfxEnabled then "音效开" else "音效关") ]
            ]
        , div [ class "mode-row" ]
            [ button [ class (if model.gameMode == Classic then "mode-btn active" else "mode-btn"), onClick (SetGameMode Classic) ] [ text "经典" ]
            , button [ class (if model.gameMode == Daily then "mode-btn active" else "mode-btn"), onClick (SetGameMode Daily) ]
                [ text ("每日挑战" ++ if isDaily && model.dailyCompleted then " ✓" else "") ]
            , button [ class (if model.gameMode == TimeAttack then "mode-btn active" else "mode-btn"), onClick (SetGameMode TimeAttack) ] [ text "计时挑战" ]
            ]
        , if isTimeAttack then
            div []
                [ div [ style "text-align" "center", style "font-size" "0.85em", style "color" "#e94560", style "font-weight" "700", style "margin-bottom" "4px" ]
                    [ text (String.fromInt model.timeLeft ++ "秒  |  得分: " ++ String.fromInt model.timeAttackScore ++ "  |  最佳: " ++ String.fromInt model.timeAttackBest) ]
                , viewTimeAttackBar model.timeLeft
                ]
          else
            text ""
        , if isDaily then
            div [ style "text-align" "center", style "font-size" "0.85em", style "margin-bottom" "8px" ]
                [ if model.dailyCompleted then
                    span [ style "color" "#2ecc71", style "font-weight" "600" ] [ text ("今日已完成！最佳用时: " ++ formatTime model.dailyBestTime) ]
                  else
                    span [ style "color" "#ffd700", style "font-weight" "600" ] [ text "完成今日挑战，解锁专属成就！" ]
                ]
          else
            text ""
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
            , if model.fastestSolve > 0 then
                div [ class "stat-box" ]
                    [ div [ class "stat-label" ] [ text "最快" ]
                    , div [ class "stat-value" ] [ text (formatTime model.fastestSolve) ]
                    ]
              else
                text ""
            ]
        , div [ class "cards-area" ] (List.map (\c -> viewCard c model.streak) model.cards)
        , case model.comboDisplay of
            Just n ->
                div [ class "combo-popup" ]
                    [ text (String.fromInt n ++ " 连击！")
                    , if model.shieldActive && n >= 3 then div [ class "combo-shield" ] [ text "🛡️ 护盾激活" ] else text ""
                    ]
            Nothing -> text ""
        , div [ class (msgClass model.messageType) ] [ text model.message ]
        , if model.showHint then
            div [ class "hint-box" ] [ text model.hintText ]
          else
            text ""
        , if not isTimeAttack then
            div [ class "difficulty-row" ]
                [ button [ class (if model.difficulty == Easy then "diff-btn active" else "diff-btn"), onClick (ChangeDifficulty Easy) ] [ text "初级" ]
                , button [ class (if model.difficulty == Normal then "diff-btn active" else "diff-btn"), onClick (ChangeDifficulty Normal) ] [ text "中级" ]
                , button [ class (if model.difficulty == Hard then "diff-btn active" else "diff-btn"), onClick (ChangeDifficulty Hard) ] [ text "高级" ]
                ]
          else
            text ""
        , div [ class "input-area" ]
            [ input
                [ class "expr-input"
                , type_ "text"
                , id "expr-input"
                , value model.input
                , placeholder "输入算式，如 (3+3)*8/2  ·  Enter提交  ·  Esc清除  ·  Backspace退格  ·  点击牌输入"
                , onInput UpdateInput
                , on "keydown" (D.map decodeKey keyDecoder)
                ]
                []
            ]
        , if String.isEmpty model.liveResult then
            text ""
          else
            div [ class (if String.contains "= 24" model.liveResult then "live-result valid" else "live-result") ] [ text model.liveResult ]
        , let usedHint = computeUsedNumsHint model.input (List.map (\c -> toFloat c.value) model.cards)
          in if String.isEmpty usedHint then text "" else div [ class "used-hint" ] [ text usedHint ]

        , div [ class "buttons-row" ]
            [ button [ class "btn btn-primary", onClick SubmitAnswer ] [ text "提交" ]
            , button [ class "btn btn-success", onClick ShowHint ] [ text "提示" ]
            , button [ class "btn btn-secondary", onClick ShowAllAnswers ] [ text "全部" ]
            , button [ class "btn btn-secondary", onClick Skip ] [ text "跳过" ]
            , button [ class "btn btn-secondary", onClick ShareProblem ] [ text "分享" ]
            , if isTimeAttack && model.timeLeft <= 0 then
                button [ class "btn btn-primary", onClick StartTimeAttack ] [ text "再来一局" ]
              else
                button [ class "btn btn-secondary", onClick NewGame ] [ text "新局" ]
            ]
        , if not isTimeAttack then viewKeypad model else text ""
        , if not (List.isEmpty model.history) then
            div [ class "history-panel" ]
                [ div [ class "history-header" ]
                    [ span [ class "history-title" ] [ text "尝试记录" ]
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
                (List.indexedMap viewAchievementToast model.newAchievements
                    ++ [ div [ style "text-align" "center", style "margin-top" "8px" ] [ button [ class "btn btn-secondary", onClick DismissAchievements ] [ text "知道了" ] ] ]
                )
          else
            text ""
        , div [ class "achievements-panel" ]
            [ h4 [] [ text "成就墙" ]
            , div []
                (List.map (\a ->
                    span [ class (if List.member a model.achievements then "ach-badge unlocked" else "ach-badge") ] [ text a ]
                ) allAchievements)
            ]
        , if not (List.isEmpty model.skippedProblems) then
            div [ class "skipped-panel" ]
                [ div [ class "skipped-header", onClick ToggleSkippedProblems ]
                    [ h4 [] [ text ("错题本 (" ++ String.fromInt (List.length model.skippedProblems) ++ ")") ]
                    , span [ style "font-size" "0.8em" ] [ text (if model.showSkippedProblems then "▲" else "▼") ]
                    ]
                , if model.showSkippedProblems then
                    div [ class "skipped-list" ]
                        (List.indexedMap (\i p ->
                            div [ class "skipped-item" ]
                                [ span [] [ text (String.fromInt (i + 1) ++ ". " ++ String.join ", " (List.map String.fromInt p.cardValues)) ]
                                , span [ class "skipped-ans" ] [ text ("答案: " ++ p.answer ++ " = 24") ]
                                ]
                        ) model.skippedProblems)
                  else
                    text ""
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

main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
