# airgate-sdk — Claude 开发指南

> 叠加于根 `../CLAUDE.md`。SDK 是 core 与全部插件之间的**契约层**，改动影响面最大；先读「生态边界」「🚫 红线」。
> 生态现状权威依据：skill `core-dev`（契约细节见其「插件契约」`plugin-contract.md`）。

## 生态边界（动手前先归位）

全生态职责速查表见根 `../CLAUDE.md`「生态边界」，本节为 SDK 视角。

**SDK 负责**：core ↔ 插件之间的稳定契约——gRPC 协议 ABI（`protocol/proto/`，6 个 service）、插件作者 API（`sdkgo/`）、运行时桥（`runtimego/grpc/`）、脱核调试（`devkit/devserver/`）、前端主题（`theme/`）。

**SDK 不负责（出现即越界）**：任何产品/业务逻辑——用户/账号/计费/调度/任务编排的实现归 **core**，协议转换/上游对接归**插件**。SDK 只放"契约与桥"，出现业务规则即越界。

> **审计基线（2026-06，守住勿回退）**：SDK 契约层已确认**无业务逻辑泄漏**——`sdkgo`（40+ 导出符号全为接口/枚举/容器）、`protocol/proto`（6 service 均与厂商无关）、`runtimego/grpc`（纯适配，无成本计算/授权）均只放契约与桥；`Host` 为通用 `Invoke`/`InvokeStream` 通道（无业务方法名），`capability` 为扁平 method 级（授权在 Core），全仓无 `CalculateCost`/价格档/账号状态机/provider 字符串。新增能力若需在 SDK 写产品/计费/provider 逻辑即越界，应改放 Core 方法注册表 / 插件 Metadata / 插件私有 API（判断见 `docs/sdk-package-boundaries.md`）。

**扩展纪律（改 SDK 前按序考虑）**：

1. **优先不动 ABI**：新能力先用既有扩展点表达——`PluginInfo` / `RouteDefinition` / `ModelInfo` 的 `Metadata`（约定键登记于 `plugin-contract.md`）、`Host.Invoke` 新 method（在 core 方法注册表注册，无需改 proto）。**新插件接入不应需要改 proto**。
2. **ABI 兼容**：proto 字段只增不改不删、不复用 tag 号；破坏性变更评估半径 = core + 全部 7 个插件仓。
3. **capability 现状为扁平 method 级**（`sdkgo/capability.go`，`host.invoke.<method>`，`CapabilityForHostMethod` 生成）；SDK 仅做声明与类型自检，真正授权在 Core 方法注册表。

## 🚫 红线

- **勿将 core 产品逻辑写入 SDK**。SDK 仅放协议 ABI、插件接口、运行时桥、devkit、前端 theme。
- **`protocol/proto/` 为 ABI**：改后须 `make proto` 重新生成并提交 `*.pb.go`，并保持向后兼容；破坏性变更将打挂 core 与全部插件。
- **`sdkgo/` 插件接口为公共 API**：`Plugin`/`GatewayPlugin`/`ExtensionPlugin`/`MiddlewarePlugin`/`Host` 签名变更属破坏性变更，须同步评估全部插件仓。
- 改 `theme/` 后 `make theme`，提交生成的 `dist`/devserver CSS。
- 生成代码（`*.pb.go`、theme `dist`）不可手改。

## 包速览

| 目录 | 角色 |
|---|---|
| `protocol/proto/` | gRPC 协议定义 = ABI（core ↔ 插件，6 service：Plugin/Gateway/Extension/Middleware/Event/CoreInvoke） |
| `sdkgo/` | 插件作者 API：`plugin.go`（基础 `Plugin` 接口/`PluginInfo`）、`gateway.go`/`extension.go`/`middleware.go`（三类插件接口）、`host.go`（`Host`/`HostAware`）、`outcome.go`（`ForwardOutcome` 判决模型）、`capability.go`、`models.go`/`usage.go`/`task.go`/`schema.go`/`event.go`/`errors.go` |
| `runtimego/grpc/` | 插件运行时桥：`gateway_server.go`（接口→gRPC server）、`host_client.go`（gRPC→`sdk.Host`）、`go_plugin.go`（hashicorp/go-plugin 集成） |
| `devkit/devserver/` | 插件脱离 core 的独立调试服务 |
| `theme/` | 前端主题包 `@doudou-start/airgate-theme` + devserver theme.css |

## 命令（`airgate-sdk/`）

```bash
make proto          # 改 proto 后重新生成（装固定版本 protoc）
make proto-check    # 校验 proto 生成代码无漂移
make theme          # 构建 theme 包 + devserver theme.css
make test           # Go 测试（race + coverage）
make ci             # 完整 CI：lint + test + vet + build + proto-check + theme-package-check + theme-check
```

提交前运行 `make ci`，proto/theme 漂移检查在此把关。

## 相关 skill / 文档

- 包内边界细则（新能力归属判断、弱契约扩展点、用量/计费边界） → `docs/sdk-package-boundaries.md`
- 插件前端样式规范（theme 用法） → `docs/plugin-style-guide.md`
- 插件开发（消费 SDK 的一侧） → skill `develop-plugin`
- 提交前自检 → skill `airgate-ci-check`
- 契约现状（权威） → skill `core-dev`「插件契约」（`plugin-contract.md`）
