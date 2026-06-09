port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Html exposing (Html, div, text, button, input, h1, h2, h3, h4, p, span, br, node, ul, li, code)
import Html.Attributes exposing (class, value, style, placeholder, type_, id, title, disabled)
import Html.Events exposing (onClick, onInput, on, stopPropagationOn)
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

type GameMode = Classic | Daily | TimeAttack | Review | Custom

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
    , timeAttackTotalQuestions : Int
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
    , comboTimer : Int
    , shieldActive : Bool
    , showSteps : Bool
    , stepByStep : List SolveStep
    , timeAttackHistory : List TimeAttackRecord
    , inputHint : String
    , dailyHistory : List String
    , showTutorial : Bool
    , canInstallPWA : Bool
    , isOnline : Bool
    , reduceMotion : Bool
    , customInput : String
    , showCustomPanel : Bool
    }

type alias SkippedProblem =
    { cardValues : List Int
    , answer : String
    }

type alias SolveStep =
    { before : String
    , result : Float
    }

type alias TimeAttackRecord =
    { score : Int
    , accuracy : String
    , date : String
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
    | ShowSteps
    | HideSteps
    | ExportData
    | TriggerImport
    | DismissTutorial
    | StartReview
    | ToggleCustomPanel
    | UpdateCustomInput String
    | StartCustomChallenge
    | CloseCustomPanel
    | InstallPWA
    | InstallPromptChanged Bool
    | NetworkChanged Bool
    | ReceiveSFXSetting Bool
    | NoOp

type alias Flags =
    { today : String
    , hash : String
    , prefersDark : Bool
    , isFirstVisit : Bool
    , prefersReducedMotion : Bool
    }


-- ============ PORTS ============

port saveToStorage : String -> Cmd msg
port loadFromStorage : () -> Cmd msg
port receiveFromStorage : (String -> msg) -> Sub msg
port playSound : String -> Cmd msg
port spawnParticles : Int -> Cmd msg
port setSFX : Bool -> Cmd msg
port receiveSFXSetting : (Bool -> msg) -> Sub msg
port copyToClipboard : String -> Cmd msg
port setHash : String -> Cmd msg
port vibrate : Int -> Cmd msg
port triggerImport : () -> Cmd msg
port requestWakeLock : () -> Cmd msg
port releaseWakeLock : () -> Cmd msg
port showInstallPrompt : () -> Cmd msg
port trackInstallPrompt : (Bool -> msg) -> Sub msg
port networkStatus : (Bool -> msg) -> Sub msg


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


parseCustomInput : String -> Result String (List Int)
parseCustomInput s =
    if String.isEmpty s then
        Err "请输入 4 个数字"
    else
        let nums = s |> String.split "," |> List.map String.trim |> List.filterMap String.toInt
        in
        if List.length nums /= 4 then
            Err "需要恰好 4 个数字，用逗号分隔"
        else if List.any (\n -> n < 1 || n > 13) nums then
            Err "每个数字必须在 1-13 之间（A=1, J=11, Q=12, K=13）"
        else
            Ok nums


validateCustomCards : Dict.Dict String (List String) -> List Int -> (Result String (List Int), Dict.Dict String (List String))
validateCustomCards cache nums =
    let (solutions, newCache) = solve24Cached cache (List.map toFloat nums)
    in
    if List.isEmpty solutions then
        (Err "这 4 个数字无法算出 24，请换一组试试", newCache)
    else
        (Ok nums, newCache)


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

expressionsEqual : Expr -> Expr -> Bool
expressionsEqual a b =
    case (a, b) of
        (Num n1, Num n2) -> abs(n1 - n2) < 0.0001
        (AddE l1 r1, AddE l2 r2) -> expressionsEqual l1 l2 && expressionsEqual r1 r2
        (SubE l1 r1, SubE l2 r2) -> expressionsEqual l1 l2 && expressionsEqual r1 r2
        (MulE l1 r1, MulE l2 r2) -> expressionsEqual l1 l2 && expressionsEqual r1 r2
        (DivE l1 r1, DivE l2 r2) -> expressionsEqual l1 l2 && expressionsEqual r1 r2
        _ -> False

findSimplestBinary : Expr -> Maybe Expr
findSimplestBinary e =
    case e of
        Num _ -> Nothing
        AddE (Num _) (Num _) -> Just e
        AddE l r ->
            case findSimplestBinary l of
                Just found -> Just found
                Nothing -> findSimplestBinary r
        SubE (Num _) (Num _) -> Just e
        SubE l r ->
            case findSimplestBinary l of
                Just found -> Just found
                Nothing -> findSimplestBinary r
        MulE (Num _) (Num _) -> Just e
        MulE l r ->
            case findSimplestBinary l of
                Just found -> Just found
                Nothing -> findSimplestBinary r
        DivE (Num _) (Num _) -> Just e
        DivE l r ->
            case findSimplestBinary l of
                Just found -> Just found
                Nothing -> findSimplestBinary r

replaceExpr : Expr -> Expr -> Expr -> Expr
replaceExpr target replacement expr =
    if expressionsEqual expr target then replacement
    else case expr of
        Num n -> Num n
        AddE l r -> AddE (replaceExpr target replacement l) (replaceExpr target replacement r)
        SubE l r -> SubE (replaceExpr target replacement l) (replaceExpr target replacement r)
        MulE l r -> MulE (replaceExpr target replacement l) (replaceExpr target replacement r)
        DivE l r -> DivE (replaceExpr target replacement l) (replaceExpr target replacement r)

stepByStepSolve : Expr -> List SolveStep
stepByStepSolve expr =
    case findSimplestBinary expr of
        Nothing -> []
        Just subExpr ->
            case evalExpr subExpr of
                Nothing -> []
                Just result ->
                    let newExpr = replaceExpr subExpr (Num result) expr
                        step = { before = exprToStringSimplified subExpr ++ " = " ++ fmt result, result = result }
                    in step :: stepByStepSolve newExpr

checkBrackets : String -> String
checkBrackets s =
    let opens = String.indices "(" s |> List.length
        closes = String.indices ")" s |> List.length
    in
    if opens > closes then "缺少 " ++ String.fromInt (opens - closes) ++ " 个 )"
    else if closes > opens then "缺少 " ++ String.fromInt (closes - opens) ++ " 个 ("
    else ""


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


valuesToCards : List Int -> List Card
valuesToCards values =
    List.indexedMap (\i v -> createCard v (modBy 4 i)) values


loadReviewProblem : List SkippedProblem -> Cmd Msg
loadReviewProblem problems =
    case problems of
        [] -> Task.succeed [] |> Task.perform NewCards
        _ ->
            let generator = Random.int 0 (List.length problems - 1)
            in Random.generate (\idx ->
                case getAt idx problems of
                    Nothing -> NewCards []
                    Just p -> NewCards (valuesToCards p.cardValues)
            ) generator


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
            , theme = if flags.prefersDark then Dark else Light
            , timeLeft = 0
            , timeAttackScore = 0
            , timeAttackBest = 0
            , timeAttackTotalQuestions = 0
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
            , comboTimer = 0
            , shieldActive = False
            , showSteps = False
            , stepByStep = []
            , timeAttackHistory = []
            , inputHint = ""
            , dailyHistory = []
            , showTutorial = flags.isFirstVisit
            , canInstallPWA = False
            , isOnline = True
            , reduceMotion = flags.prefersReducedMotion
            , customInput = ""
            , showCustomPanel = False
            }
    in
    case parseHashCards flags.hash of
        Just values ->
            let cards = List.indexedMap createCard values
            in ( { baseModel | message = "好友分享的题目！来挑战吧！", messageType = Info }
               , Task.succeed cards |> Task.perform NewCards
               )
        Nothing ->
            ( baseModel, generateCards Normal )


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

encodeTimeAttackRecord : TimeAttackRecord -> E.Value
encodeTimeAttackRecord rec =
    E.object
        [ ("score", E.int rec.score)
        , ("accuracy", E.string rec.accuracy)
        , ("date", E.string rec.date)
        ]


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
            , ("timeAttackHistory", E.list encodeTimeAttackRecord model.timeAttackHistory)
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

type alias ExtraData =
    { timeAttackBest : Int
    , dailyCompletedDate : String
    , dailyBestTime : Int
    , fastestSolve : Int
    , totalAttempts : Int
    , keypadEnabled : Bool
    , sharedCount : Int
    , stepsWithKeypad : Int
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
        
        extraDecoder =
            D.map8 ExtraData
                (D.maybe (D.field "timeAttackBest" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "dailyCompletedDate" D.string) |> D.map (Maybe.withDefault ""))
                (D.maybe (D.field "dailyBestTime" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "fastestSolve" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "totalAttempts" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "keypadEnabled" D.bool) |> D.map (Maybe.withDefault True))
                (D.maybe (D.field "sharedCount" D.int) |> D.map (Maybe.withDefault 0))
                (D.maybe (D.field "stepsWithKeypad" D.int) |> D.map (Maybe.withDefault 0))
        
        timeAttackRecordDecoder =
            D.map3 TimeAttackRecord
                (D.field "score" D.int)
                (D.maybe (D.field "accuracy" D.string) |> D.map (Maybe.withDefault "N/A"))
                (D.maybe (D.field "date" D.string) |> D.map (Maybe.withDefault ""))

        timeAttackHistoryDecoder =
            D.oneOf
                [ D.list timeAttackRecordDecoder
                , D.list D.int |> D.map (List.map (\score -> { score = score, accuracy = "N/A", date = "" }))
                ]

        fullDecoder =
            D.map3
                (\base extra (tah, dh) ->
                    { model
                        | bestStreak = max model.bestStreak base.bestStreak
                        , solved = max model.solved base.totalSolved
                        , skipped = max model.skipped base.totalSkipped
                        , totalTime = max model.totalTime base.totalTime
                        , achievements = unique (model.achievements ++ base.achievements)
                        , sfxEnabled = base.sfxEnabled
                        , history = List.take 20 (model.history ++ base.history)
                        , theme = base.theme
                        , timeAttackBest = max model.timeAttackBest extra.timeAttackBest
                        , dailyCompleted = (extra.dailyCompletedDate == model.dailyDate)
                        , dailyBestTime = max model.dailyBestTime extra.dailyBestTime
                        , fastestSolve = if extra.fastestSolve > 0 then extra.fastestSolve else model.fastestSolve
                        , totalAttempts = max model.totalAttempts extra.totalAttempts
                        , keypadEnabled = extra.keypadEnabled
                        , sharedCount = max model.sharedCount extra.sharedCount
                        , stepsWithKeypad = max model.stepsWithKeypad extra.stepsWithKeypad
                        , timeAttackHistory = tah
                        , dailyHistory = dh
                        }
                )
                baseDecoder
                extraDecoder
                (D.map2 Tuple.pair
                    (D.maybe (D.field "timeAttackHistory" timeAttackHistoryDecoder) |> D.map (Maybe.withDefault []))
                    (D.maybe (D.field "dailyHistory" (D.list D.string)) |> D.map (Maybe.withDefault []))
                )
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
            , ("步步为营", model.solved >= 1)
            ]
    in List.filterMap (\(name, cond) -> if cond && not (List.member name model.achievements) then Just name else Nothing) all

achievementProgress : String -> Model -> String
achievementProgress name model =
    case name of
        "首杀" -> String.fromInt model.solved ++ "/1"
        "三连冠" -> String.fromInt model.streak ++ "/3"
        "五连冠" -> String.fromInt model.streak ++ "/5"
        "十连冠" -> String.fromInt model.streak ++ "/10"
        "速算大师" -> "≤10秒"
        "百题斩" -> String.fromInt model.solved ++ "/100"
        "每日首胜" -> if model.dailyCompleted then "已完成" else "未完成"
        "极速60秒" -> String.fromInt model.timeAttackBest ++ "/5"
        "火神" -> String.fromInt model.streak ++ "/20"
        "键盘侠" -> String.fromInt model.stepsWithKeypad ++ "/10"
        "分享达人" -> String.fromInt model.sharedCount ++ "/3"
        "步步为营" -> "恰好3步"
        _ -> ""

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
                if model.gameMode == Daily then
                    ( { model | solverCache = newCache }, generateDailyCards model.dailyDate )
                else
                    ( { model | solverCache = newCache }, generateCards model.difficulty )
            else if model.difficulty == Hard && not (hasDivisionSolution solutions) then
                if model.gameMode == Daily then
                    ( { model | solverCache = newCache }, generateDailyCards model.dailyDate )
                else
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
                    , timeAttackTotalQuestions = if model.gameMode == TimeAttack then model.timeAttackTotalQuestions + 1 else model.timeAttackTotalQuestions
                    , inputHint = ""
                    , liveResult = ""
                  }
                , Cmd.batch [ playSound "deal", Task.attempt (\_ -> NoOp) (Dom.focus "expr-input"), hashCmd ]
                )

        UpdateInput s ->
            let live = computeLiveResult s (List.map (\c -> toFloat c.value) model.cards)
                bracketHint = checkBrackets s
                usedHint = computeUsedNumsHint s (List.map (\c -> toFloat c.value) model.cards)
                combinedHint = if String.isEmpty bracketHint then usedHint else bracketHint ++ (if String.isEmpty usedHint then "" else " | " ++ usedHint)
            in ( { model | input = s, liveResult = live, inputHint = combinedHint }, Cmd.none )

        SubmitAnswer ->
            if model.pendingNewCards then
                ( model, Cmd.none )
            else if model.gameMode == TimeAttack && model.timeLeft <= 0 then
                ( model, Cmd.none )
            else
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
                            errModel = { model | message = "结果是 " ++ fmt result ++ "，不是24！", messageType = Error, streak = 0, shieldActive = False, history = newHistory, totalAttempts = newAttempts }
                        in ( errModel, playSound "error" )
                Err errMsg ->
                    let newHistory = if String.isEmpty model.input then model.history else addToHistory model.input model.history
                        newModel = { model | message = errMsg, messageType = Error, streak = 0, shieldActive = False, history = newHistory, totalAttempts = newAttempts }
                    in ( newModel, Cmd.batch [ saveCmd newModel, playSound "error", vibrate 150 ] )

        ShowHint ->
            if model.pendingNewCards then
                ( model, Cmd.none )
            else
                case model.allSolutions of
                    [] ->
                        ( { model | message = "这道题无解！点击「跳过」换一组。", messageType = Info }, playSound "click" )
                    first :: _ ->
                        let newLevel = min 3 (model.hintLevel + 1)
                            hint = getStepHint newLevel first
                            steps = case parseExpr (tokenize first) of
                                Just (expr, rest) ->
                                    if List.isEmpty rest then stepByStepSolve expr else []
                                Nothing -> []
                        in
                        ( { model | showHint = True, hintLevel = newLevel, hintText = hint, stepByStep = steps, message = "提示已显示（" ++ String.fromInt newLevel ++ "/3）", messageType = Info }, playSound "click" )

        ShowAllAnswers ->
            if model.pendingNewCards then
                ( model, Cmd.none )
            else if List.isEmpty model.allSolutions then
                ( { model | showAllAnswers = True, message = "这道题没有解法，请跳过换一组", messageType = Info }, playSound "click" )
            else
                ( { model | showAllAnswers = True, message = "显示全部 " ++ String.fromInt (List.length model.allSolutions) ++ " 个解法", messageType = Info }, playSound "click" )

        NewGame ->
            case model.gameMode of
                TimeAttack ->
                    let newModel = { model | timeLeft = 60, timeAttackScore = 0, timeAttackTotalQuestions = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True, shieldActive = False }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click", requestWakeLock () ] )
                Review ->
                    let newModel = { model | streak = 0, message = "错题复习新局！", messageType = Info, timer = 0, showAllAnswers = False, newAchievements = [], pendingNewCards = True, shieldActive = False }
                    in ( newModel, Cmd.batch [ loadReviewProblem model.skippedProblems, playSound "click" ] )
                Custom ->
                    ( { model | showCustomPanel = True, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, message = "请输入新的自定义题目", messageType = Info, shieldActive = False }
                    , playSound "click"
                    )
                _ ->
                    ( { model | streak = 0, message = "新游戏开始！", messageType = Info, timer = 0, showAllAnswers = False, newAchievements = [], pendingNewCards = True, shieldActive = False }
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
                    alreadyExists = List.any (\p -> p.cardValues == problem.cardValues) model.skippedProblems
                    newSkippedProblems = if alreadyExists then model.skippedProblems else problem :: List.take 19 model.skippedProblems
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
                    Custom ->
                        let newModel =
                                { model
                                    | streak = if hasShield then model.streak else 0
                                    , message = if hasShield then "护盾保护！跳过不中断连胜。答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions) else "跳过！答案是：" ++ Maybe.withDefault "" (List.head model.allSolutions)
                                    , messageType = Info
                                    , showAllAnswers = True
                                    , shieldActive = if hasShield then True else model.shieldActive
                                }
                        in
                        ( newModel
                        , Cmd.batch
                            [ saveCmd newModel
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
                            totalTA = model.timeAttackTotalQuestions
                            accuracyStr = if totalTA == 0 then "N/A" else String.fromInt (round (toFloat finalScore / toFloat totalTA * 100)) ++ "%"
                            newRecord = { score = finalScore, accuracy = accuracyStr, date = model.dailyDate }
                            newHistory = newRecord :: List.take 9 model.timeAttackHistory
                            isNewRecord = finalScore > model.timeAttackBest && finalScore > 0
                            recordMsg = if isNewRecord then " 🎉 新纪录！" else ""
                            gameOverModel = { model | timeLeft = 0, timeAttackBest = newBest, message = "时间到！得分：" ++ String.fromInt finalScore ++ " | 准确率：" ++ accuracyStr ++ " | 最佳：" ++ String.fromInt newBest ++ recordMsg, messageType = Info, pendingNewCards = False, timeAttackHistory = newHistory }
                        in
                        ( gameOverModel, Cmd.batch [ saveCmd gameOverModel, playSound "error", vibrate 300, releaseWakeLock () ] )
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
                        newComboTimer = max 0 (model.comboTimer - 1)
                        clearedCombo = if newComboTimer == 0 && model.comboTimer > 0 then Nothing else model.comboDisplay
                    in
                    ( { model
                        | timer = newTimer
                        , totalTime = newTotalTime
                        , achievementTimer = newAchTimer
                        , newAchievements = clearedAch
                        , comboTimer = newComboTimer
                        , comboDisplay = clearedCombo
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
            if model.pendingNewCards then
                ( model, Cmd.none )
            else
                ( { model | difficulty = diff, message = "难度切换为" ++ difficultyName diff, messageType = Info, streak = 0, showAllAnswers = False, newAchievements = [], pendingNewCards = True, shieldActive = False }
                , Cmd.batch [ generateCards diff, playSound "click" ]
                )

        ChangeTheme t ->
            let newModel = { model | theme = t }
            in ( newModel, saveCmd newModel )

        SetGameMode mode ->
            let wasTimeAttack = model.gameMode == TimeAttack
            in
            case mode of
                Daily ->
                    let newModel = { model | gameMode = Daily, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], shieldActive = False }
                    in ( newModel, Cmd.batch [ generateDailyCards model.dailyDate, playSound "click", if wasTimeAttack then releaseWakeLock () else Cmd.none ] )
                TimeAttack ->
                    let newModel = { model | gameMode = TimeAttack, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], timeLeft = 60, timeAttackScore = 0, timeAttackTotalQuestions = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True, shieldActive = False }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click", requestWakeLock () ] )
                Classic ->
                    let newModel = { model | gameMode = Classic, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], message = "返回经典模式", messageType = Info, shieldActive = False }
                    in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click", if wasTimeAttack then releaseWakeLock () else Cmd.none ] )
                Review ->
                    if List.isEmpty model.skippedProblems then
                        let newModel = { model | gameMode = Classic, message = "错题本为空，无法复习", messageType = Info, shieldActive = False }
                        in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )
                    else
                        let newModel = { model | gameMode = Review, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], message = "错题复习模式！复习你跳过的题目", messageType = Info, pendingNewCards = True, shieldActive = False }
                        in ( newModel, Cmd.batch [ loadReviewProblem model.skippedProblems, playSound "click", if wasTimeAttack then releaseWakeLock () else Cmd.none ] )
                Custom ->
                    let newModel = { model | gameMode = Custom, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], message = "自定义挑战模式！输入你想要的 4 个数字", messageType = Info, shieldActive = False, showCustomPanel = True }
                    in ( newModel, Cmd.batch [ if wasTimeAttack then releaseWakeLock () else Cmd.none, playSound "click" ] )

        StartTimeAttack ->
            let newModel = { model | gameMode = TimeAttack, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], timeLeft = 60, timeAttackScore = 0, timeAttackTotalQuestions = 0, timer = 0, message = "计时挑战开始！", messageType = Info, pendingNewCards = True, shieldActive = False }
            in ( newModel, Cmd.batch [ generateCards model.difficulty, playSound "click", requestWakeLock () ] )

        StartReview ->
            if List.isEmpty model.skippedProblems then
                ( { model | message = "错题本为空", messageType = Info, gameMode = Classic, shieldActive = False }, Cmd.batch [ generateCards model.difficulty, playSound "click" ] )
            else
                let newModel = { model | gameMode = Review, streak = 0, input = "", showAllAnswers = False, showHint = False, hintLevel = 0, newAchievements = [], message = "错题复习模式！", messageType = Info, pendingNewCards = True, shieldActive = False }
                in ( newModel, Cmd.batch [ loadReviewProblem model.skippedProblems, playSound "click" ] )

        ToggleCustomPanel ->
            ( { model | showCustomPanel = not model.showCustomPanel, customInput = if model.showCustomPanel then "" else model.customInput }, Cmd.none )

        UpdateCustomInput s ->
            ( { model | customInput = s }, Cmd.none )

        StartCustomChallenge ->
            case parseCustomInput model.customInput of
                Err errMsg ->
                    ( { model | message = errMsg, messageType = Error }, playSound "error" )
                Ok nums ->
                    let (validation, newCache) = validateCustomCards model.solverCache nums
                    in
                    case validation of
                        Err errMsg ->
                            ( { model | message = errMsg, messageType = Error, solverCache = newCache }, playSound "error" )
                        Ok _ ->
                            let cards = valuesToCards nums
                                newModel =
                                    { model
                                    | cards = cards
                                    , gameMode = Custom
                                    , streak = 0
                                    , input = ""
                                    , showAllAnswers = False
                                    , showHint = False
                                    , hintLevel = 0
                                    , newAchievements = []
                                    , message = "自定义挑战开始！用这 4 张牌算出 24"
                                    , messageType = Info
                                    , pendingNewCards = False
                                    , showCustomPanel = False
                                    , timer = 0
                                    , shieldActive = False
                                    , inputHint = ""
                                    , liveResult = ""
                                    }
                            in
                            ( newModel
                            , Cmd.batch
                                [ Task.succeed cards |> Task.perform NewCards
                                , playSound "click"
                                , if model.gameMode == TimeAttack then releaseWakeLock () else Cmd.none
                                ]
                            )

        CloseCustomPanel ->
            ( { model | showCustomPanel = False, customInput = "" }, Cmd.none )

        CardClick val ->
            if model.pendingNewCards || (model.gameMode == TimeAttack && model.timeLeft <= 0) then
                ( model, Cmd.none )
            else if List.any (\c -> c.value == val) model.cards then
                let newInput = model.input ++ String.fromInt val
                    live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
                    bracketHint = checkBrackets newInput
                    usedHint = computeUsedNumsHint newInput (List.map (\c -> toFloat c.value) model.cards)
                    combinedHint = if String.isEmpty bracketHint then usedHint else bracketHint ++ (if String.isEmpty usedHint then "" else " | " ++ usedHint)
                in ( { model | input = newInput, liveResult = live, inputHint = combinedHint }, Cmd.batch [ playSound "key", Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] )
            else
                ( model, Cmd.none )

        BackspaceInput ->
            if model.pendingNewCards || (model.gameMode == TimeAttack && model.timeLeft <= 0) then
                ( model, Cmd.none )
            else
                let newInput = String.dropRight 1 model.input
                    live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
                    bracketHint = checkBrackets newInput
                    usedHint = computeUsedNumsHint newInput (List.map (\c -> toFloat c.value) model.cards)
                    combinedHint = if String.isEmpty bracketHint then usedHint else bracketHint ++ (if String.isEmpty usedHint then "" else " | " ++ usedHint)
                in ( { model | input = newInput, liveResult = live, inputHint = combinedHint }, Cmd.none )

        KeypadInput s ->
            if model.pendingNewCards || (model.gameMode == TimeAttack && model.timeLeft <= 0) then
                ( model, Cmd.none )
            else
                let newInput = model.input ++ s
                    live = computeLiveResult newInput (List.map (\c -> toFloat c.value) model.cards)
                    bracketHint = checkBrackets newInput
                    usedHint = computeUsedNumsHint newInput (List.map (\c -> toFloat c.value) model.cards)
                    combinedHint = if String.isEmpty bracketHint then usedHint else bracketHint ++ (if String.isEmpty usedHint then "" else " | " ++ usedHint)
                in ( { model | input = newInput, liveResult = live, inputHint = combinedHint }, playSound "key" )

        ToggleKeypad ->
            ( { model | keypadEnabled = not model.keypadEnabled }, Cmd.none )

        ToggleSkippedProblems ->
            ( { model | showSkippedProblems = not model.showSkippedProblems }, Cmd.none )

        ShowSteps ->
            if model.pendingNewCards then
                ( model, Cmd.none )
            else if List.isEmpty model.allSolutions then
                ( { model | message = "这道题没有解法，无法显示步骤", messageType = Info }, playSound "click" )
            else
                let steps = case List.head model.allSolutions of
                        Nothing -> []
                        Just first ->
                            case parseExpr (tokenize first) of
                                Just (expr, rest) ->
                                    if List.isEmpty rest then stepByStepSolve expr else []
                                Nothing -> []
                in ( { model | showSteps = True, stepByStep = steps }, playSound "click" )

        HideSteps ->
            ( { model | showSteps = False }, Cmd.none )

        ShareProblem ->
            let hash = String.join "," (List.map (\c -> String.fromInt c.value) model.cards)
                shareText = "24点挑战：" ++ String.join ", " (List.map (\c -> c.display) model.cards) ++ "，你能算出24吗？ https://hanazar-games.github.io/24-Points-Webgame/#" ++ hash
                newShared = model.sharedCount + 1
            in ( { model | message = "题目已复制到剪贴板", messageType = Info, sharedCount = newShared }, copyToClipboard shareText )

        ExportData ->
            ( { model | message = "数据已复制到剪贴板", messageType = Info }
            , copyToClipboard (encodeStats model)
            )

        TriggerImport ->
            ( model, triggerImport () )

        DismissTutorial ->
            let newModel = { model | showTutorial = False }
            in ( newModel, saveCmd newModel )

        InstallPWA ->
            ( { model | canInstallPWA = False }, showInstallPrompt () )

        InstallPromptChanged canInstall ->
            ( { model | canInstallPWA = canInstall }, Cmd.none )

        NetworkChanged online ->
            let newModel = { model | isOnline = online }
            in ( newModel, Cmd.none )

        ReceiveSFXSetting enabled ->
            ( { model | sfxEnabled = enabled }, Cmd.none )

        NoOp -> (model, Cmd.none )


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
                    , comboTimer = 2
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50, vibrate 200 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles (30 + newStreak * 5), vibrate 80 ]
                    else [ playSound "success", spawnParticles 30, vibrate 80 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 600), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] ++ sfx)
            )
        Daily ->
            let newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newSolved = model.solved + 1
                isFirstDaily = not model.dailyCompleted
                newDailyCompleted = True
                newDailyBestTime = if model.dailyBestTime == 0 || model.timer < model.dailyBestTime then model.timer else model.dailyBestTime
                newDailyHistory = if isFirstDaily then model.dailyDate :: model.dailyHistory else model.dailyHistory
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
                    , comboTimer = 2
                    , shieldActive = newShield
                    , dailyHistory = newDailyHistory
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50, vibrate 200 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40, vibrate 80 ]
                    else [ playSound "success", spawnParticles 30, vibrate 80 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] ++ sfx)
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
                    , comboTimer = 2
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50, vibrate 200 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40, vibrate 80 ]
                    else [ playSound "success", spawnParticles 30, vibrate 80 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] ++ sfx)
            )
        Review ->
            let newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newSolved = model.solved + 1
                newAch = checkAchievements { model | streak = newStreak, solved = newSolved, stepsWithKeypad = newStepsWithKeypad } ++ bubuAchievement
                hasNewAch = not (List.isEmpty newAch)
                newHistory = addToHistory model.input model.history
                currentCardValues = List.map .value model.cards
                newSkippedProblems = List.filter (\p -> p.cardValues /= currentCardValues) model.skippedProblems
                newModel = { model
                    | message = if hasNewAch then "解锁成就！" ++ model.input ++ " = 24 " ++ stepMsg else "复习正确！已移除该错题 ✓" ++ stepMsg
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
                    , comboTimer = 2
                    , shieldActive = newShield
                    , skippedProblems = newSkippedProblems
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50, vibrate 200 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40, vibrate 80 ]
                    else [ playSound "success", spawnParticles 30, vibrate 80 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> DelayedNewCards) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] ++ sfx)
            )
        Custom ->
            let newStreak = model.streak + 1
                newBestStreak = max newStreak model.bestStreak
                newSolved = model.solved + 1
                newAch = checkAchievements { model | streak = newStreak, solved = newSolved, stepsWithKeypad = newStepsWithKeypad } ++ bubuAchievement
                hasNewAch = not (List.isEmpty newAch)
                newHistory = addToHistory model.input model.history
                newModel = { model
                    | message = if hasNewAch then "解锁成就！" ++ model.input ++ " = 24 " ++ stepMsg else "自定义挑战正确！" ++ model.input ++ " = 24 " ++ stepMsg
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
                    , pendingNewCards = False
                    , fastestSolve = newFastest
                    , stepsWithKeypad = newStepsWithKeypad
                    , comboDisplay = Just newStreak
                    , comboTimer = 2
                    , shieldActive = newShield
                    }
                sfx =
                    if hasNewAch then [ playSound "achievement", spawnParticles 50, vibrate 200 ]
                    else if newStreak >= 2 then [ playSound "success", playSound ("streak:" ++ String.fromInt newStreak), spawnParticles 40, vibrate 80 ]
                    else [ playSound "success", spawnParticles 30, vibrate 80 ]
            in
            ( newModel
            , Cmd.batch ([ Task.perform (\_ -> ToggleCustomPanel) (Process.sleep 800), saveCmd newModel, Task.attempt (\_ -> NoOp) (Dom.focus "expr-input") ] ++ sfx)
            )


dateToDays : String -> Int
dateToDays s =
    case String.split "-" s of
        [yStr, mStr, dStr] ->
            case (String.toInt yStr, String.toInt mStr, String.toInt dStr) of
                (Just y, Just m, Just d) ->
                    let yearDays = (y - 1970) * 365 + ((y - 1969) // 4) - ((y - 1901) // 100) + ((y - 1601) // 400)
                        monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
                        isLeap = (modBy 4 y == 0 && modBy 100 y /= 0) || (modBy 400 y == 0)
                        leapAdjust = if isLeap && m > 2 then 1 else 0
                        monthTotal = List.sum (List.take (m - 1) monthDays)
                    in yearDays + monthTotal + d + leapAdjust
                _ -> 0
        _ -> 0


consecutiveStreak : List String -> Int
consecutiveStreak dates =
    let uniqueDates = List.foldl (\x acc -> if List.member x acc then acc else x :: acc) [] dates
        sorted = List.sortBy dateToDays uniqueDates |> List.reverse
    in
    case sorted of
        [] -> 0
        first :: rest ->
            let go prevDay count remaining =
                    case remaining of
                        [] -> count
                        next :: restNext ->
                            if dateToDays prevDay - dateToDays next == 1 then
                                go next (count + 1) restNext
                            else
                                count
            in go first 1 rest


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
        Review -> "复习"
        Custom -> "自定义"

themeName : Theme -> String
themeName t =
    case t of
        Dark -> "深色"
        Light -> "浅色"


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Time.every 1000 Tick
        , receiveFromStorage StorageLoaded
        , trackInstallPrompt InstallPromptChanged
        , networkStatus NetworkChanged
        , receiveSFXSetting ReceiveSFXSetting
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

.daily-streak { border-radius: 14px; padding: 14px; margin: 12px 0; text-align: center; }
.container.dark .daily-streak { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); }
.container.light .daily-streak { background: rgba(255,215,0,0.04); border: 1px solid rgba(255,215,0,0.12); }
.daily-streak-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #ffd700; margin-bottom: 4px; }
.daily-streak-days { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
.daily-streak-num { font-size: 2em; font-weight: 900; color: #e94560; }
.daily-streak-unit { font-size: 0.9em; color: #8892b0; font-weight: 600; }
.daily-calendar { display: flex; gap: 6px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
.daily-calendar-day { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75em; font-weight: 700; }
.container.dark .daily-calendar-day { background: rgba(255,255,255,0.06); color: #8892b0; }
.container.light .daily-calendar-day { background: rgba(0,0,0,0.04); color: #64748b; }
.daily-calendar-day.completed { background: linear-gradient(135deg, rgba(46,204,113,0.2), rgba(39,174,96,0.2)) !important; color: #2ecc71 !important; }

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

.steps-panel { border-radius: 14px; padding: 18px; margin: 12px 0; }
.container.dark .steps-panel { background: rgba(0,201,255,0.05); border: 1px solid rgba(0,201,255,0.15); }
.container.light .steps-panel { background: rgba(0,201,255,0.03); border: 1px solid rgba(0,201,255,0.12); }
.steps-title { font-weight: 700; color: #00c9ff; margin-bottom: 12px; font-size: 1em; }
.steps-list { display: flex; flex-direction: column; gap: 8px; }
.step-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; font-family: monospace; font-size: 1em; }
.container.dark .step-item { background: rgba(0,0,0,0.2); color: #ccd6f6; }
.container.light .step-item { background: rgba(0,0,0,0.05); color: #475569; }
.step-num { min-width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #00c9ff, #0077ff); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8em; font-weight: 700; }
.step-arrow { color: #00c9ff; font-size: 1.2em; }
.step-result { color: #e94560; font-weight: 700; }

.ta-history { border-radius: 14px; padding: 14px; margin: 12px 0; text-align: center; }
.container.dark .ta-history { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.container.light .ta-history { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); }
.ta-history-title { font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.container.dark .ta-history-title { color: #8892b0; }
.container.light .ta-history-title { color: #64748b; }
.ta-scores { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.ta-score { padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 700; }
.container.dark .ta-score { background: rgba(0,201,255,0.1); color: #00c9ff; }
.container.light .ta-score { background: rgba(0,201,255,0.08); color: #0077ff; }
.ta-score.best { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,170,0,0.2)) !important; color: #ffd700 !important; }

.tutorial-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
.tutorial-box { max-width: 420px; width: 100%; border-radius: 20px; padding: 28px; text-align: center; animation: popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.container.dark .tutorial-box { background: #1a1a3e; border: 1px solid rgba(255,255,255,0.1); color: #eee; }
.container.light .tutorial-box { background: #fff; border: 1px solid rgba(0,0,0,0.1); color: #1a1a2e; }
.tutorial-box h2 { margin: 0 0 12px 0; font-size: 1.5em; font-weight: 900; color: #e94560; }
.tutorial-box p { margin: 8px 0; font-size: 0.95em; line-height: 1.6; }
.container.dark .tutorial-box p { color: #8892b0; }
.container.light .tutorial-box p { color: #64748b; }
.tutorial-box .btn { margin-top: 16px; }

.custom-input { width: 100%; padding: 12px 16px; border: 2px solid rgba(233,69,96,0.25); border-radius: 12px; font-size: 1.1em; font-family: monospace; text-align: center; margin: 12px 0; box-sizing: border-box; outline: none; transition: all 0.3s; }
.container.dark .custom-input { background: rgba(0,0,0,0.25); color: #fff; }
.container.light .custom-input { background: rgba(0,0,0,0.05); color: #1a1a2e; }
.custom-input:focus { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.2); }

.custom-examples { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin: 8px 0 16px 0; }
.custom-example { padding: 4px 10px; border-radius: 20px; font-size: 0.75em; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid; }
.container.dark .custom-example { background: rgba(255,255,255,0.06); color: #8892b0; border-color: rgba(255,255,255,0.1); }
.container.light .custom-example { background: rgba(0,0,0,0.04); color: #64748b; border-color: rgba(0,0,0,0.1); }
.container.dark .custom-example:hover { background: rgba(233,69,96,0.2); color: #fff; border-color: rgba(233,69,96,0.4); }
.container.light .custom-example:hover { background: rgba(233,69,96,0.1); color: #1a1a2e; border-color: rgba(233,69,96,0.3); }

.reduce-motion .particle { display: none; }
.reduce-motion .card { animation: none; }
.reduce-motion .msg-pulse { animation: none; }
.reduce-motion .msg-shake { animation: none; }
.reduce-motion .combo-popup { animation: none; opacity: 1; }
.reduce-motion .achievement-toast { animation: none; }
.reduce-motion .pop-animation { animation: none; }
.reduce-motion .stat-fire { animation: none; }

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
    div [ class ("card" ++ glowClass), onClick (CardClick card.value), title ("点击输入 " ++ card.display) ]
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
        isReview = model.gameMode == Review
        isCustom = model.gameMode == Custom
    in
    div [ class ("container " ++ themeClass ++ if model.reduceMotion then " reduce-motion" else "") ]
        [ css model.theme
        , if model.showTutorial then
            div [ class "tutorial-overlay", onClick DismissTutorial ]
                [ div [ class "tutorial-box" ]
                    [ h2 [] [ text "👋 欢迎来到 24点挑战" ]
                    , p [] [ text "用加减乘除和括号，让 4 张牌算出 24 点。" ]
                    , p [] [ text "🃏 点击牌面快速输入数字" ]
                    , p [] [ text "⌨️ 支持键盘和虚拟键盘" ]
                    , p [] [ text "🔥 连击解锁护盾保护" ]
                    , p [] [ text "📱 支持 PWA 离线游玩" ]
                    , button [ class "btn btn-primary", onClick DismissTutorial ] [ text "开始挑战" ]
                    ]
                ]
          else
            text ""
        , if model.showCustomPanel then
            div [ class "tutorial-overlay", onClick CloseCustomPanel ]
                [ div [ class "tutorial-box", stopPropagationOn "click" (D.succeed (NoOp, True)) ]
                    [ h2 [] [ text "🎯 自定义挑战" ]
                    , p [] [ text "输入 4 个 1-13 的数字，用逗号分隔" ]
                    , input
                        [ class "custom-input"
                        , type_ "text"
                        , value model.customInput
                        , placeholder "例如：3,3,8,8"
                        , onInput UpdateCustomInput
                        ]
                        []
                    , div [ class "custom-examples" ]
                        [ span [ class "custom-example", onClick (UpdateCustomInput "3,3,8,8") ] [ text "3,3,8,8" ]
                        , span [ class "custom-example", onClick (UpdateCustomInput "4,4,10,10") ] [ text "4,4,10,10" ]
                        , span [ class "custom-example", onClick (UpdateCustomInput "1,5,5,5") ] [ text "1,5,5,5" ]
                        , span [ class "custom-example", onClick (UpdateCustomInput "1,3,4,6") ] [ text "1,3,4,6" ]
                        ]
                    , div [ class "buttons-row" ]
                        [ button [ class "btn btn-primary", onClick StartCustomChallenge ] [ text "开始挑战" ]
                        , button [ class "btn btn-secondary", onClick CloseCustomPanel ] [ text "取消" ]
                        ]
                    ]
                ]
          else
            text ""
        , div [ class "header" ]
            [ button [ class "theme-toggle", onClick (ChangeTheme (if model.theme == Dark then Light else Dark)) ]
                [ text (themeName model.theme) ]
            , h1 [] [ text "24点挑战" ]
            , p [] [ text "用加减乘除和括号，让四张牌算出 24" ]
            , button [ class "sfx-toggle", onClick ToggleSFX ]
                [ text (if model.sfxEnabled then "音效开" else "音效关") ]
            , if model.canInstallPWA then
                button [ class "sfx-toggle", onClick InstallPWA, style "right" "80px", title "安装为本地应用" ] [ text "📲 安装" ]
              else
                text ""
            ]
        , if not model.isOnline then
            div [ class "message msg-error" ] [ text "⚠️ 当前处于离线状态" ]
          else
            text ""
        , div [ class "mode-row" ]
            [ button [ class (if model.gameMode == Classic then "mode-btn active" else "mode-btn"), onClick (SetGameMode Classic) ] [ text "经典" ]
            , button [ class (if model.gameMode == Daily then "mode-btn active" else "mode-btn"), onClick (SetGameMode Daily) ]
                [ text ("每日挑战" ++ if isDaily && model.dailyCompleted then " ✓" else "") ]
            , button [ class (if model.gameMode == TimeAttack then "mode-btn active" else "mode-btn"), onClick (SetGameMode TimeAttack) ] [ text "计时挑战" ]
            , button [ class (if model.gameMode == Review then "mode-btn active" else "mode-btn"), onClick (SetGameMode Review), title "复习错题本中的题目" ]
                [ text ("错题复习" ++ if List.isEmpty model.skippedProblems then "" else " (" ++ String.fromInt (List.length model.skippedProblems) ++ ")") ]
            , button [ class (if model.gameMode == Custom then "mode-btn active" else "mode-btn"), onClick ToggleCustomPanel, title "输入自定义的 4 个数字" ] [ text "自定义" ]
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
        , if not isTimeAttack && not isReview && not isCustom then
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
                , disabled (model.pendingNewCards || (model.gameMode == TimeAttack && model.timeLeft <= 0))
                ]
                []
            ]
        , if String.isEmpty model.liveResult then
            text ""
          else
            div [ class (if String.contains "= 24" model.liveResult then "live-result valid" else "live-result") ] [ text model.liveResult ]
        , if String.isEmpty model.inputHint then text "" else div [ class "used-hint" ] [ text model.inputHint ]

        , div [ class "buttons-row" ]
            [ button [ class "btn btn-primary", onClick SubmitAnswer ] [ text "提交" ]
            , button [ class "btn btn-success", onClick ShowHint ] [ text "提示" ]
            , button [ class "btn btn-secondary", onClick ShowAllAnswers ] [ text "全部" ]
            , button [ class "btn btn-secondary", onClick ShowSteps ] [ text "步骤" ]
            , button [ class "btn btn-secondary", onClick Skip ] [ text "跳过" ]
            , button [ class "btn btn-secondary", onClick ShareProblem ] [ text "分享" ]
            , if isTimeAttack && model.timeLeft <= 0 then
                button [ class "btn btn-primary", onClick StartTimeAttack ] [ text "再来一局" ]
              else if isCustom then
                button [ class "btn btn-secondary", onClick NewGame ] [ text "自定义新题" ]
              else
                button [ class "btn btn-secondary", onClick NewGame ] [ text "新局" ]
            ]
        , if not isTimeAttack then viewKeypad model else text ""
        , if not (List.isEmpty model.history) then
            div [ class "history-panel" ]
                [ div [ class "history-header" ]
                    [ span [ class "history-title" ] [ text "尝试记录" ]
                    , div []
                        [ button [ class "history-clear", onClick ExportData, title "导出数据到剪贴板" ] [ text "导出" ]
                        , button [ class "history-clear", onClick ClearHistory ] [ text "清除" ]
                        ]
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
        , if model.showSteps && not (List.isEmpty model.stepByStep) then
            div [ class "steps-panel" ]
                [ div [ class "steps-title" ] [ text "解题步骤" ]
                , div [ class "steps-list" ]
                    (List.indexedMap (\i step ->
                        div [ class "step-item" ]
                            [ div [ class "step-num" ] [ text (String.fromInt (i + 1)) ]
                            , span [] [ text step.before ]
                            , span [ class "step-arrow" ] [ text "→" ]
                            , span [ class "step-result" ] [ text (fmt step.result) ]
                            ]
                    ) model.stepByStep)
                , div [ style "text-align" "center", style "margin-top" "10px" ]
                    [ button [ class "btn btn-secondary", onClick HideSteps ] [ text "关闭" ]
                    ]
                ]
          else
            text ""
        , if isTimeAttack && not (List.isEmpty model.timeAttackHistory) then
            div [ class "ta-history" ]
                [ div [ class "ta-history-title" ] [ text "历史得分" ]
                , div [ class "ta-scores" ]
                    (List.indexedMap (\i rec ->
                        div [ class (if i == 0 then "ta-score best" else "ta-score"), title ("准确率: " ++ rec.accuracy ++ if String.isEmpty rec.date then "" else " | 日期: " ++ rec.date) ] [ text (String.fromInt rec.score) ]
                    ) model.timeAttackHistory)
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
                    let isUnlocked = List.member a model.achievements
                        progress = if isUnlocked then "" else achievementProgress a model
                        label = if isUnlocked then a else a ++ " " ++ progress
                    in
                    span [ class (if isUnlocked then "ach-badge unlocked" else "ach-badge"), title (if isUnlocked then "已解锁" else "进度: " ++ progress) ] [ text label ]
                ) allAchievements)
            ]
        , if not (List.isEmpty model.dailyHistory) then
            div [ class "daily-streak" ]
                [ div [ class "daily-streak-title" ] [ text "连续打卡" ]
                , div [ class "daily-streak-days" ]
                    [ span [ class "daily-streak-num" ] [ text (String.fromInt (consecutiveStreak model.dailyHistory)) ]
                    , span [ class "daily-streak-unit" ] [ text "天" ]
                    ]
                , div [ class "daily-calendar" ]
                    (List.map (\date ->
                        div [ class "daily-calendar-day completed", title date ] [ text (String.right 2 date) ]
                    ) (List.take 14 model.dailyHistory))
                ]
          else
            text ""
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
        , div [ class "buttons-row" ]
            [ button [ class "btn btn-secondary", onClick TriggerImport, title "从剪贴板导入备份数据" ] [ text "📥 导入数据" ]
            ]
        , div [ class "footer" ]
            [ text "Elm · 纯函数式 · 零运行时错误 · PWA 离线可玩 v0.4.14" ]
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
