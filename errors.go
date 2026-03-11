package sdk

import "errors"

// ==================== 通用错误 ====================

// ErrNotSupported 插件不支持某项能力时返回此错误
var ErrNotSupported = errors.New("not supported")

// ErrInvalidCredentials 凭证无效（格式错误、缺少必填字段等）
var ErrInvalidCredentials = errors.New("invalid credentials")

// ErrUpstreamTimeout 上游 API 超时
var ErrUpstreamTimeout = errors.New("upstream timeout")

// ErrUpstreamUnavailable 上游 API 不可用（网络不通、DNS 解析失败等）
var ErrUpstreamUnavailable = errors.New("upstream unavailable")

// ==================== 账号状态错误 ====================

// ErrAccountRateLimited 账号被上游限流
var ErrAccountRateLimited = errors.New("account rate limited")

// ErrAccountDisabled 账号已被上游禁用
var ErrAccountDisabled = errors.New("account disabled")

// ErrAccountExpired 账号已过期
var ErrAccountExpired = errors.New("account expired")

// ErrAccountQuotaExhausted 账号额度已用尽
var ErrAccountQuotaExhausted = errors.New("account quota exhausted")

// ==================== 账号状态常量 ====================

// AccountStatus 账号状态常量，用于 ForwardResult.AccountStatus
const (
	AccountStatusOK          = ""             // 正常
	AccountStatusRateLimited = "rate_limited" // 被限流
	AccountStatusDisabled    = "disabled"     // 已禁用
	AccountStatusExpired     = "expired"      // 已过期
)
