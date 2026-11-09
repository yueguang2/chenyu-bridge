# 云GPU中间件（Chenyu Bridge）

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](Dockerfile)

把「晨羽智云 Pod 实例 + ComfyUI 工作流」包装成 HTTP 服务，**自带管理控制台、可独立部署**；
对外提供图片/视频生成接口，也可作为影策（open-ai-canvas）的系统渠道接入。纯 Node 服务，无第三方依赖。

## 能力

- 管理后台：概览、实例（开机/关机/重启/全部关机）、任务（测试生成/重试/取消/导出）、工作流（新增/编辑/上传/自动解析）、GPU 资源、设置、日志、接入文档。
- 工作流：内置预设 + 后台新增/覆盖，上传 ComfyUI `.api.json` 自动解析输出节点与字段映射；支持从晨羽 Pod 列表选 UUID。
- 稳定性：任务重启恢复、幂等去重、限流/队列上限、失败与开机失败快返、实例预热、SSE 实时任务推送。
- 成本：每日预算/最低余额/预算保护（任务估算 + 余额差校准）、无排队任务时立即关机。
- 鉴权：管理口令（`/api/bridge/*`）、可选业务接口密钥（`/v1/*`）。

## 快速开始

```bash
# 方式一：docker compose
docker compose -f docker-compose.example.yml up -d

# 方式二：docker run
docker run -d --name chenyu-bridge -p 3400:3400 \
  -v /你的数据目录:/app/data --restart unless-stopped chenyu-bridge:latest
```

打开 `http://<主机>:3400/`：

1. 设置 → 填写「晨羽 API Key」
2. 工作流 → 新增（选 Pod / 填 UUID，上传 `.api.json` 自动解析）→ 保存
3. 任务 → 测试生成，确认可出图/视频
4. 接入 → 复制服务地址与调用示例（详见 `DISTRIBUTE.md`）

## 接口

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/v1/models` | GET | 模型列表（`预设@GPU`） |
| `/v1/images/generations` | POST | 图片生成（OpenAI Images 兼容） |
| `/v1/videos` | POST | 提交视频任务（异步） |
| `/v1/videos/{id}` | GET | 查询视频任务 |
| `/v1/videos/{id}/cancel` | POST | 取消视频任务 |
| `/files/{name}` | GET | 获取产物文件 |
| `/healthz` | GET | 存活检查 |
| `/healthz/ready` | GET | 就绪检查（校验 API Key/余额） |

业务接口默认无鉴权；设置 `BRIDGE_API_KEY`（或后台「业务接口密钥」）后需 `Authorization: Bearer` 或 `x-api-key`。

## 环境变量（均可选，多数可在后台设置）

| 变量 | 说明 |
| --- | --- |
| `BRIDGE_ADMIN_TOKEN` | 管理口令，设置后 `/api/bridge/*` 需口令 |
| `BRIDGE_API_KEY` | 业务接口密钥，设置后 `/v1/*` 需鉴权 |
| `CHENYU_API_KEY` | 晨羽 API Key（也可在后台填写） |
| `BRIDGE_PORT` | 端口，默认 3400 |
| `BRIDGE_PUBLIC_BASE` | 对外访问地址，用于返回产物链接 |
| `BRIDGE_RATE_PER_MIN` / `BRIDGE_MAX_QUEUE` | 每分钟提交上限 / 队列上限 |

## 开发

```bash
npm start        # node server.mjs
npm test         # node --test
docker build -t chenyu-bridge:latest .
```

## 目录

- `server.mjs` HTTP 服务与接口；`lib.mjs` 实例/ComfyUI 调度；`runtime.mjs` 设置与日志
- `config.mjs` 默认配置与内置预设；`presets.mjs` 工作流预设持久化；`workflow-analyzer.mjs` 工作流自动解析
- `admin.html` 管理控制台；`workflows/` 内置工作流；`test/` 集成测试
- `DISTRIBUTE.md` 部署与对接说明

## 安全与费用

- 数据（`data/`：settings/presets/tasks/日志/上传工作流）已被 `.gitignore` 忽略，务必挂载卷持久化。
- 生成真实消耗 GPU 费用；请按需设置每日预算、最低余额与业务接口密钥，公网部署务必开启鉴权。

## 许可证

本项目采用 [MIT License](LICENSE) 许可证。
