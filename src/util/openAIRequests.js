import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getOpenAICompletion = async (messages) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        presence_penalty: -0.3,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  };
  