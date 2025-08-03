# get-local-ipinfo-mcp

获取本机公网 IP 及地理位置信息的 MCP 工具服务。

## 功能简介

- 通过 ipapi.co API 获取当前主机的公网 IP、网络、城市、地区、国家、经纬度等信息。
- 自动伪造请求头，提升反爬虫兼容性。
- 支持速率限制和 API 错误处理，返回详细错误及 HTTP 状态码。
- MCP 工具接口：`get_public_ip_info`，可集成到支持 MCP 协议的系统。

## 主要接口说明

- `get_public_ip_info`：获取公网 IP 及地理信息。
  - 成功时返回 IP 信息文本。
  - 失败时返回详细错误、HTTP 状态码、原因说明。

## 代码结构

- `src/index.ts`：主服务逻辑与工具注册。
- `build/`：编译后的 JS 文件。

## License

MIT
