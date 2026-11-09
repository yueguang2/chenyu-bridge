# 贡献指南

感谢你愿意参与云GPU中间件（Chenyu Bridge）！下面是参与开发的基本约定。

## 开发环境

- Node.js **>= 18**（推荐 22，与 Dockerfile 一致）
- 本项目**零第三方依赖**，请保持这一原则：仅使用 Node 内置模块。
- 无需数据库，运行数据写入 `data/`（已被 `.gitignore` 忽略）。

```bash
npm start     # 启动服务，默认 http://127.0.0.1:3400
npm test      # 运行测试（node --test）
```

> 注意：本机若已存在 `data/settings.json` 且设置了每日预算，可能影响 `test/` 的集成测试（测试读取运行时设置）。在干净检出（无 `data/`）下测试应当全部通过，CI 即按此环境运行。

## 分支与提交

1. 从 `main` 切出功能分支：`feat/xxx`、`fix/xxx`、`docs/xxx`。
2. 提交信息尽量使用约定式前缀：`feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:`。
3. 提交前确保 `npm test` 通过。
4. 发起 Pull Request，描述改动动机、行为变化与验证方式。

## 代码风格

- 纯 ESM（`type: module`），4 空格缩进，保持现有文件风格。
- 新增/修改接口请同步更新 `README.md` 与 `DISTRIBUTE.md` 的接口表。
- 涉及费用、鉴权、关机策略的改动请重点说明安全与成本影响。

## 报告问题

- 功能缺陷 / 建议：使用 Issue 模板提交。
- 安全问题：请勿公开，见 [SECURITY.md](SECURITY.md)。
