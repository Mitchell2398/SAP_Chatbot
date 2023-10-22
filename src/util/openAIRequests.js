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
        functions:[
          {
              "name": "addReplicationSteps",
              "description": "Add data to a ticket",
              "parameters": {
                  "type": "object",
                  "properties": {
                    "subject": {
                      "type": "string",
                      "description": "Mandatory: the subject of the ticket",
                    },
                    "description": {
                        "type": "string",
                        "description": "Description of the ticket, include steps to replicate issue.",
                    },
                    "priority": {
                        "type": "string",
                        "description": "Mandatory: The priority of the ticket",
                    },
                    "category": {
                        "type": "string",
                        "description": "Mandatory: The category of the ticket",
                    },

                  },
                  "required": ["concise description with replication steps"],
              },
              
          }
      ]

      });
      return response.choices[0].message;
    } catch (error) {
      console.error(error);
    }
  };
  