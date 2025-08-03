import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import { z } from "zod";

const server = new McpServer({
  name: "get-local-ipinfo-mcp", // 修改为新名称
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {
      enabled: true,
    },
  },
});

/**
 * 获取当前主机的公网 IP 及地理位置信息
 * 优先使用 ipapi.co，自动伪造请求头，支持速率/反爬虫错误处理。
 * @returns {Promise<object>} 成功时返回 IP 信息对象，失败时返回错误对象（含 HTTP 状态码、原因等）。
 */
async function getIPInfo() {
  try {
    // 发送请求到 ipapi.co，获取 JSON 格式的 IP 信息
    const response = await fetch("https://ipapi.co/json/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });
    const data = await response.json();

    // 如果 API 返回错误（如限流），直接返回错误信息
    if ((data as any).error) {
      console.error("ipapi.co 响应原始数据:", data);
      return {
        error: true,
        message: (data as any).message || "未知错误",
        reason: (data as any).reason || "",
        status: response.status,
      };
    }

    // 定义 zod schema
    const ipInfoSchema = z.object({
      ip: z.string(),
      network: z.string().optional(),
      version: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      country: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    });

    // 校验和解析 data
    const result = ipInfoSchema.safeParse(data);
    if (!result.success) {
      console.error("ipapi.co 响应原始数据:", data);
      console.error("IP信息解析失败:", result.error);
      return {
        error: true,
        message: "IP信息解析失败",
        reason: result.error.message,
        status: response.status,
      };
    }
    const ipInfo = result.data;

    // 打印 IP 信息到 stderr，便于调试
    console.error("IP信息:", ipInfo);
    return ipInfo;
  } catch (error) {
    // 捕获并输出错误信息
    console.error("获取IP信息失败:", error);
  }
}

/**
 * 注册 MCP 工具方法 get_public_ip_info
 * 工具描述：获取当前主机公网 IP 地址及相关信息，自动处理 API 错误和限流。
 */
server.tool("get_public_ip_info", "获取公网 IP 地址信息", {}, async () => {
  // 调用辅助函数获取 IP 信息
  const ipInfo = await getIPInfo();
  if (!ipInfo || ("error" in ipInfo && ipInfo.error)) {
    // 获取失败时返回详细错误文本
    const err = ipInfo as {
      error: boolean;
      message?: string;
      reason?: string;
      status?: number;
    };
    let text = "获取公网 IP 信息失败。";
    if (err && err.status !== undefined) {
      text += `\nHTTP状态码: ${err.status}`;
    }
    if (err && err.message) {
      text += `\n原因: ${err.message}`;
    }
    if (err && err.reason) {
      text += `\n详情: ${err.reason}`;
    }
    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  // 拼接详细信息文本，便于展示
  const info = ipInfo as {
    ip: string;
    network?: string;
    version?: string;
    city?: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  const infoText = [
    `IP: ${info.ip}`,
    `Network: ${info.network}`,
    `Version: ${info.version}`,
    `City: ${info.city}`,
    `Region: ${info.region}`,
    `Country: ${info.country}`,
    `Latitude: ${info.latitude}`,
    `Longitude: ${info.longitude}`,
  ].join("\n");

  // 返回 IP 信息文本内容
  return {
    content: [
      {
        type: "text",
        text: infoText,
      },
    ],
  };
});

/**
 * MCP 服务器主入口
 * 使用 stdio 作为传输层，启动后等待请求。
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("get-local-ipinfo MCP 服务器已通过 stdio 运行");
}

main().catch((error) => {
  console.error("main() 中发生致命错误:", error);
  process.exit(1);
});
