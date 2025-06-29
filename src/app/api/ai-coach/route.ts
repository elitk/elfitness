import { NextRequest, NextResponse } from "next/server";
import { TOOL_MAP } from "@/lib/mcp/tools";

const toolDefs = [
  {
    name: "getWaterThisWeek",
    description: "Total litres of water the user drank this calendar week",
    parameters: {
      type: "object",
      properties: { userId: { type: "string" } },
      required: ["userId"],
    },
  },
  {
    name: "getCaloriesThisWeek",
    description: "Total calories burned in workouts this calendar week",
    parameters: {
      type: "object",
      properties: { userId: { type: "string" } },
      required: ["userId"],
    },
  },
] as const;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const firstResp = await fetch(
    `${
      process.env.OLLAMA_HOST ?? "http://localhost:11434"
    }/v1/chat/completions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL ?? "llama3",
        messages: [
          {
            role: "system",
            content:
              "You are a fitness assistant. Decide whether a tool is needed. If needed, call it.",
          },
          { role: "user", content: message },
        ],
        tools: toolDefs,
        tool_choice: "auto",
        stream: false,
      }),
    }
  );

  const first = await firstResp.json();
  const choice = first.choices[0];

  if (choice.finish_reason === "tool_calls") {
    const call = choice.message.tool_calls[0];
    const { name, arguments: args } = call;
    const result = await TOOL_MAP[name as keyof typeof TOOL_MAP](
      JSON.parse(args)
    );

    const secondResp = await fetch(
      `${
        process.env.OLLAMA_HOST ?? "http://localhost:11434"
      }/v1/chat/completions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL ?? "llama3",
          messages: [
            {
              role: "assistant",
              tool_call_id: call.id,
              name,
              arguments: args,
            },
            {
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            },
          ],
          stream: false,
        }),
      }
    );

    const second = await secondResp.json();
    return NextResponse.json({ reply: second.choices[0].message.content });
  }

  return NextResponse.json({ reply: choice.message.content });
}
