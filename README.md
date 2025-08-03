# get-local-ipinfo-mcp

> MCP 工具服务：获取本机公网 IP 及地理位置信息。

---

## 使用 get-local-ipinfo-mcp

本工具通过 MCP 协议，自动获取本机公网 IP 及地理信息。

1️⃣ 快速获取 IP 信息
2️⃣ 详细地理位置、网络、国家等数据
3️⃣ 友好的错误提示和状态码

---

## 🛠️ 安装

### 环境要求

- Node.js >= 18.0.0
- 支持 MCP 协议的客户端（如 Cursor、Claude Desktop 等）

### json 配置安装过程

1. 运行`npm install -g @littlesirius/get-local-ipinfo-mcp`安装到本地。
2. 运行`npm root -g`获得`node_modules`路径。
3. 将上面返回的结果，如：`C:\nvm4w\nodejs\node_modules`。替换下面 json 中的`$path$`，并且将\改为\\\\

```json
{
  "mcpServers": {
    "get-local-ipinfo-mcp": {
      "command": "npx",
      "args": [
        "tsx",
        "$path$\\@littlesirius\\get-local-ipinfo-mcp\\build\\index.js"
      ]
    }
  }
}
```

    如："C:\\nvm4w\\nodejs\\node_modules\\@littlesirius\\get-local-ipinfo-mcp\\build\\index.js"

4. 将改好的 json 复制\导入到 MCP 客户端

---

## 🔨 可用工具接口

- `get_public_ip_info`：获取当前主机公网 IP 及地理信息。
  - 返回 IP、网络、城市、地区、国家、经纬度等信息。
  - 支持详细错误、HTTP 状态码。

---

## 💻 开发与贡献

克隆项目并安装依赖：

```shell
git clone https://github.com/Xiao-Jiang-233/get-local-ipinfo-mcp.git
cd get-local-ipinfo-mcp
npm install
npm run build
```

通过 MCP Inspector 测试：

```shell
npx @modelcontextprotocol/inspector node build\\index.js
```

本地运行服务：

```shell
node build/index.js
```

---

## 🚨 常见问题

- API 请求失败或速率限制？请检查网络或更换 IP。
- ESM/模块解析错误？请确保 Node.js 版本 >= 18 且 package.json 配置正确。
- 其它 MCP 客户端兼容性问题？欢迎提交 issue。

---

## ⚠️ 免责声明

本项目为社区贡献，信息仅供参考。请勿用于非法用途，使用风险自负。

---

## 🤝 社区与联系

- [GitHub Issues](https://github.com/Xiao-Jiang-233/get-local-ipinfo-mcp/issues)
- [主页](https://github.com/Xiao-Jiang-233/get-local-ipinfo-mcp)

---

## 📄 License

MIT
