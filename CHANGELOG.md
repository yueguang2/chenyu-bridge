# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 风格，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.1.0] - 2026-11-09

### 新增

- 初版独立部署的云 GPU 中间件（Chenyu Bridge）：把晨羽智云 Pod + ComfyUI 工作流包装为 OpenAI/newapi 风格媒体 API。
- 管理控制台：概览、实例开关机、任务（测试生成/重试/取消/导出）、工作流管理、GPU 资源、设置、日志、接入文档。
- 工作流：内置预设 + 后台新增/覆盖，上传 ComfyUI `.api.json` 自动解析输出节点与字段映射。
- 稳定性：任务重启恢复、幂等去重、限流/队列上限、失败与开机失败快返、实例预热、SSE 实时任务推送。
- 成本控制：每日预算、最低余额、预算保护、无排队任务时立即关机。
- 鉴权：管理口令（`/api/bridge/*`）、可选业务接口密钥（`/v1/*`）。
- 容器化与文档：`Dockerfile`、`docker-compose.example.yml`、`README.md`、`DISTRIBUTE.md`。
