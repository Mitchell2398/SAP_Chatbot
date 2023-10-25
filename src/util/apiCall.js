import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getOpenAICompletion = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      presence_penalty: -0.3,
      temperature: 0.2,
      frequency_penalty: -0.3,
      functions: [
        {
          "name": "nextTask",
          "description": "Once you get enough information to complete the task",
          "parameters": {
            "type": "object",
            "properties": {},
          },
          "required" : ["subject", "replication steps", ["permission"]]
        }
      ]

    });
    return response.choices[0].message;
  } catch (error) {
    console.error(error);
  }
};


export const completeTicketOpenAi = async (messages, func, setData) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        presence_penalty: -0.3,
        temperature: 0.2,
        frequency_penalty: -0.3,
        functions: [func]
  
      });
      if (response.choices[0].message.function_call) {
        const functionArgs = JSON.parse(
            response.choices[0].message.function_call.arguments
        );
        console.log(functionArgs)
        setData((prev) => {return {...prev, ...functionArgs}})

      } else {
        console.log("no data")
        return  null
        
      }

    } catch (error) {
      console.error(error);
    }
  };
  
