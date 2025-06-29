import { Ollama } from "ollama";

export const ollama = new Ollama({
  host: process.env.OLLAMA_HOST ?? "http://localhost:11434",
});
export const MODEL = process.env.OLLAMA_MODEL ?? "llama3";

export class OllamaService {
  private baseURL: string;

  constructor(baseURL = "http://localhost:11434") {
    this.baseURL = baseURL;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1:latest",
          prompt: prompt,
          stream: false,
          temperature: 0.1,
          options: {
            stop: ["\n", "User:", "Assistant:"], // Stop tokens to prevent extra text
            num_predict: 100, // Limit response length
            top_p: 0.9,
            repeat_penalty: 1.1,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Ollama request failed");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Ollama error:", error);
      throw new Error("Failed to get AI response");
    }
  }
}
