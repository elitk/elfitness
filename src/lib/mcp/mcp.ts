import { OllamaService } from '@/lib/ollama/ollama';
import { waterTrackingTools } from '@/lib/mcp/tools/water-tools';
import { MCPTool, ToolCall } from '@/lib/types';

export class MCPManager {
  private ollama: OllamaService;
  private tools: Map<string, MCPTool>;

  constructor() {
    this.ollama = new OllamaService();
    this.tools = new Map();
    
    // Register water tracking tools
    waterTrackingTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  private buildToolAwarePrompt(userMessage: string, userId: string): string {
    const toolDescriptions = Array.from(this.tools.values()).map(tool => 
      `- ${tool.name}: ${tool.description}`
    ).join('\n');

    return `You are a helpful assistant that can use tools to help users with water tracking.

Available tools:
${toolDescriptions}

When a user asks about water tracking, respond with a tool call in this exact format:
TOOL_CALL: {"tool_name": "tool_name_here", "parameters": {"userId": "${userId}", "other_param": "value"}}

User message: ${userMessage}

If the user wants to see their water tracking history, use the get_water_tracking tool.
If the user wants to add water intake, use the add_water_entry tool.

Response:JSON`;
  }

  private parseToolCall(response: string): ToolCall | null {
    try {
      const toolCallMatch = response.match(/TOOL_CALL:\s*({.*})/);
      if (toolCallMatch) {
        return JSON.parse(toolCallMatch[1]);
      }
      return null;
    } catch (error) {
      console.error('Error parsing tool call:', error);
      return null;
    }
  }

  private async executeTool(toolCall: ToolCall, userId: string): Promise<any> {
    const tool = this.tools.get(toolCall.tool_name);
    if (!tool) {
      throw new Error(`Tool ${toolCall.tool_name} not found`);
    }

    // Ensure userId is in parameters
    const params = { ...toolCall.parameters, userId };
    return await tool.function(params, userId);
  }

  private formatWaterData(data: any[]): string {
    if (!data || data.length === 0) {
      return 'No water tracking entries found.';
    }

    let table = '| Date | Time | Amount (ml) | Notes |\n';
    table += '|------|------|-------------|-------|\n';
    
    data.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const time = new Date(entry.timestamp).toLocaleTimeString();
      table += `| ${date} | ${time} | ${entry.amount} | ${entry.notes || '-'} |\n`;
    });

    const totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0);
    table += `\n**Total: ${totalAmount}ml**`;

    return table;
  }

  async processUserMessage(userMessage: string, userId: string): Promise<string> {
    try {
      // Step 1: Agent formats the request
      const prompt = this.buildToolAwarePrompt(userMessage, userId);
      
      // Step 2: Get AI response with tool call
      const aiResponse = await this.ollama.generateResponse(prompt);
      
      // Step 3: Parse tool call
      const toolCall = this.parseToolCall(aiResponse);
      
      if (!toolCall) {
        return "I couldn't understand your request. Please ask about water tracking (e.g., 'show my water intake' or 'add 500ml water').";
      }

      // Step 4: Execute MCP Tool (Firebase query)
      const toolResult = await this.executeTool(toolCall, userId);
      
      // Step 5: Format response based on tool result
      if (toolCall.tool_name === 'get_water_tracking') {
        if (toolResult.success) {
          const formattedTable = this.formatWaterData(toolResult.data);
          return `Here's your water tracking history:\n\n${formattedTable}`;
        } else {
          return `Sorry, I couldn't fetch your water tracking data: ${toolResult.error}`;
        }
      } else if (toolCall.tool_name === 'add_water_entry') {
        if (toolResult.success) {
          return `✅ ${toolResult.message}`;
        } else {
          return `❌ Failed to add water entry: ${toolResult.error}`;
        }
      }

      return 'Tool executed successfully!';
      
    } catch (error) {
      console.error('MCP processing error:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }
}
