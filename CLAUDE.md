# airgate-sdk — Claude 开发指南

> 叠加于根 `../CLAUDE.md`。SDK 为 core 与全部插件之间的**契约层**，改动影响面最大，先读「🚫 红线」。
> 生态边界依据见 `../airgate-core/docs/architecture/ecosystem-v2.md`。

## 🚫 红线

- **勿将 core 产品逻辑写入 SDK**。SDK 仅放协议 ABI、插件接口、运行时桥、devkit、前端 theme；用户/账号/计费/调度等业务归 **core**（ecosystem-v2 边界审计结论）。
- **`protocol/proto/` 为 ABI**：改后须 `make proto` 重新生成并提交 `*.pb.go`，并保持向后兼容（字段只增不改不删、不复用 tag 号）；破坏性变更将打挂 core 与全部插件。
- **`sdkgo/` 插件接口为公共 API**：`GatewayPlugin`/`ExtensionPlugin`/`MiddlewarePlugin`/宿主能力 签名变更属破坏性变更，须同步评估全部插件仓。
- 改 `theme/` 后 `make theme`，提交生成的 `dist`/devserver CSS。
- 生成代码（`*.pb.go`、theme `dist`）不可手改。

## 包速览

| 目录 | 角色 |
|---|---|
| `protocol/proto/` | gRPC 协议定义 = ABI（core ↔ 插件） |
| `sdkgo/` | Go 插件接口：`gateway.go` / `extension.go` / `capability.go` / `event.go` / `errors.go` |
| `runtimego/grpc/` | 插件运行时桥（Go 实现接入 gRPC） |
| `devkit/devserver/` | 插件脱离 core 的独立调试服务 |
| `theme/` | 前端主题包 `@doudou-start/airgate-theme` + devserver theme.css |

## 命令（`airgate-sdk/`）

```bash
make proto          # 改 proto 后重新生成（装固定版本 protoc）
make proto-check    # 校验 proto 生成代码无漂移
make theme          # 构建 theme 包 + devserver theme.css
make test           # Go 测试（race + coverage）
make ci             # 完整 CI：lint + test + vet + build + proto-check + theme-check
```

提交前运行 `make ci`，proto/theme 漂移检查在此把关。
