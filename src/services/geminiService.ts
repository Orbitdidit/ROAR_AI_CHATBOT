/**
 * Client-side service to communicate with the Gemini API via our Express backend.
 */
export const geminiService = {
  /**
   * Sends a message to the Gemini chatbot.
   * @param prompt The user's message.
   * @param history Optional chat history.
   * @param systemInstruction Optional instructions for the model.
   * @returns The assistant's text response.
   */
  async chat(prompt: string, history?: any[], systemInstruction?: string): Promise<string> {
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          history,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Propagate specific error types if needed
        if (response.status === 429) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
        throw new Error(errorData.error || 'API_KEY_ISSUE');
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.error("geminiService.chat error:", error);
      throw error;
    }
  }
};
