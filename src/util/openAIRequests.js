import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getOpenAICompletion = async (messages, taskKeys) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      presence_penalty: -0.3,
      functions: [
        {
          name: "addReplicationSteps",
          description: "Add data to a ticket",
          parameters: {
            type: "object",
            properties: {
              ...taskKeys,
            },
            required: ["task requirements"],
          },
        },
      ],
    });
    return response.choices[0].message;
  } catch (error) {
    console.error(error);
  }
};
