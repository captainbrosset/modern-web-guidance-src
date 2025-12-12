import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getUseCasesByCategory, getGuide } from "../data/modern-practices.js";

export function registerModernWebTools(server: McpServer) {
  server.tool(
    "list_use_cases",
    {
      category: z.string().optional().describe("Category to filter by (e.g., 'webperf', 'ui')"),
    },
    async ({ category }) => {
      const useCases = getUseCasesByCategory(category);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(useCases, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    "get_best_practices",
    {
      use_case_id: z.string().describe("The ID of the use case to get the guide for"),
    },
    async ({ use_case_id }) => {
      const guide = await getGuide(use_case_id);
      if (!guide) {
        return {
          content: [
            {
              type: "text",
              text: `No guide found for use case: ${use_case_id}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: guide,
          },
        ],
      };
    }
  );
}
