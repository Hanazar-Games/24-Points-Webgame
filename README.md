# 🃏 24点挑战 v0.3.2 - 扑克牌益智游戏

一个用 **Elm** 语言构建的纯函数式 24点 Web 游戏，零运行时错误，直接部署在 GitHub Pages。

## 在线游玩

👉 **[点击开始游戏](https://hanazar-games.github.io/24-Points-Webgame)**

## 游戏规则

1. 系统随机发出 **4张扑克牌**（A=1, J=11, Q=12, K=13）
2. 用 **加、减、乘、除** 和 **括号** 将四个数字算出 **24**
3. **每张牌必须且只能用一次**
4. 支持分数运算（如 `8/(3-8/3) = 24`）

## 技术栈

- **Elm 0.19.1** — 小众纯函数式编程语言，编译到 JavaScript
- 自带 24点求解器算法（回溯 + 表达式树解析）
- 单文件 `index.html`，直接部署 GitHub Pages

## 本地运行

```bash
# 安装 Elm
npm install -g elm

# 编译（已生成 index.html，可直接打开）
elm make src/Main.elm --output=index.html

# 或用 elm reactor
elm reactor
```

## 项目结构

```
.
├── index.html      # 编译后的完整游戏（GitHub Pages 入口）
├── src/
│   └── Main.elm    # 全部 Elm 源代码
├── elm.json        # Elm 项目配置
└── README.md
```

## 经典例题

| 牌面 | 解法 |
|------|------|
| 3, 3, 8, 8 | `8/(3-8/3) = 24` |
| 4, 4, 10, 10 | `(10*10-4)/4 = 24` |
| 1, 5, 5, 5 | `5*(5-1/5) = 24` |
| 1, 3, 4, 6 | `6/(1-3/4) = 24` |

## License

MIT
