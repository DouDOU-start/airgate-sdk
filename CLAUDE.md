# airgate-sdk — Claude 开发指南

> 叠加在 monorepo 根 `../CLAUDE.md` 之上。SDK 是 core 与所有插件之间的**契约层**，改动影响面最大，务必先读「🚫 红线」。
> 生态边界依据见 `../airgate-core/docs/architecture/ecosystem-v2.md`。

## 🚫 红线

- **不要把 core 的产品逻辑塞进 SDK**。SDK 只放：协议 ABI、插件接口、运行时桥、devkit、前端 theme。用户/账号/计费/调度等业务是 **core** 的事（这是 ecosystem-v2 明确的边界审计结论）。
- **`protocol/proto/` 是 ABI**：改了必须 `make proto` 重新生成并提交 `*.pb.go`；**保持向后兼容**（字段只增不改不删、不复用 tag 号）。破坏性变更会同时打挂 core 与所有插件。
- **`sdkgo/` 的插件接口是公共 API**：`GatewayPlugin`/`ExtensionPlugin`/`MiddlewarePlugin`/`Host capability` 签名变更属于破坏性变更，需同步评估所有插件仓。
- 改 `theme/` 后 `make theme`，提交生成的 `dist`/devserver CSS。
- 生成代码（`*.pb.go`、theme `dist`）不可手改。

## 包速览

| 目录 | 角色 |
|---|---|
| `protocol/proto/` | gRPC 协议定义 = ABI（core ↔ 插件） |
| `sdkgo/` | Go 插件接口：`gateway.go` / `extension.go` / `capability.go` / `event.go` / `errors.go` 等 |
| `runtimego/grpc/` | 插件运行时桥（把 Go 实现接到 gRPC） |
| `devkit/devserver/` | 插件脱离 core 的独立调试服务 |
| `theme/` | 前端主题包 `@doudou-start/airgate-theme` + devserver theme.css |

## 命令（从 `airgate-sdk/`）

```bash
make proto          # 改 proto 后重新生成（装固定版本 protoc）
make proto-check    # 校验 proto 生成代码无 drift
make theme          # 构建 theme 包 + devserver theme.css
make test           # 带 race + coverage 的 Go 测试
make ci             # 完整 CI：lint+test+vet+build+proto-check+theme-check
```

提交前跑 `make ci`，proto/theme 的 drift 检查在这里把关。
