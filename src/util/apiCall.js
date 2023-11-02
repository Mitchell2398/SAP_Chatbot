import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Retries an ASYNC function. 
// If the promise is rejected, OR IF IT TAKES LONGER THAN timeoutDelay
// it will retry the function call up to maxRetries times.
const maxRetries = 10;
const timeoutDelay = 4500;

const retryAsyncFunc = async (attempt) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Current timestamp ms
      const timeMs = new Date().getTime();
      console.log(
        "OpenAPI Request: attempt " +
          (retries + 1) +
          " of " +
          maxRetries +
          ". With timeout " +
          timeoutDelay +
          "ms"
      );
      const response = await Promise.race([
        attempt(),
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
            retries++;
          }, timeoutDelay+retries*(timeoutDelay/8))
        ),
      ]);

      if (response) {
        console.log(
          
          (response === "Success"?"TICKET DATA: ":"CHAT MESSAGE: ") +"OpenAPI Request: Success, Took " +
            (
              (new Date().getTime() - timeMs + timeoutDelay * retries) /
              1000
            ).toFixed(2) +
            "s total and " +
            (retries +
            1) +
            " attempts."
        );
        return response;
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed: ${error}`);
      retries++;
    }
  }

  throw new Error("Max retries reached, request failed.");
};

export const getOpenAICompletion = async (messages) => {
  const attempt = async () => {
    return openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: messages,
      presence_penalty: -0.3,
      temperature: 0.2,
      frequency_penalty: -0.3,
      functions: [
        {
          name: "nextTask",
          description: "Once you get enough information to complete the task",
          parameters: {
            type: "object",
            properties: {},
          },
          required: ["subject", "replication steps", ["permission"]],
        },
      ],
    });
  };

  const reponse = await retryAsyncFunc(attempt);

  return reponse.choices[0].message;
};

export const completeTicketOpenAi = async (messages, func, ticket, setData) => {
  const attemps = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: messages,
        presence_penalty: -0.3,
        temperature: 0.2,
        frequency_penalty: -0.3,
        functions: [func],
      });
      if (response.choices[0].message.function_call) {
        const functionArgs = JSON.parse(
          response.choices[0].message.function_call.arguments
        );

        if (
          response.choices[0].message.function_call.name == "descriptionFunc"
        ) {
          setCategoryandPriority({ ...ticket, ...functionArgs }, setData);
        }
        console.log(functionArgs);
        setData((prev) => {
          return { ...prev, ...functionArgs };
        });
        return "Success";
      } else {
        console.log("no data");
        return null;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  await retryAsyncFunc(attemps);
};

const setCategoryandPriority = async (ticket, setData) => {
  const attempt = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "system",
            content:
              "You are a support engineer for SAP, You have a ticket with description: " +
              ticket.description +
              " and subject: " +
              ticket.subject +
              ". Make a function call now.",
          },
        ],
        presence_penalty: -0.3,
        temperature: 0.2,
        frequency_penalty: -0.3,
        functions: [
          {
            name: "getCategoryandPriority",
            description:
              "Call immediately, deduce category and priority from ticket given",
            parameters: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description:
                    "category of ticket Example category: Warning or Error Message ",
                },
                priority: {
                  type: "string",
                  description:
                    "priority of ticket: Impact on business operations : Low - no impact, Medium - some impact, High - critical impact",
                },
              },
            },
            required: ["category", "priority"],
          },
        ],
      });

      if (response.choices[0].message.function_call) {
        const functionArgs = JSON.parse(
          response.choices[0].message.function_call.arguments
        );
        console.log(functionArgs);
        setData((prev) => {
          return { ...prev, ...functionArgs };
        });
        return "Success";
      } else {
        console.log("no data");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  await retryAsyncFunc(attempt);
};
