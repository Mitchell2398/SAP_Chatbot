// This is where each of the  tasks will be stored,
// and the data keys that will be used to generate the data from each task.

export const tasks = [
  {
    task_message: `You are an AI support bot for the company SAP, you help customers fill out a support ticket by asking one question at a time. Identify the problem the customer is facing call, then call nextTask function.`,
    task_summary: "user's problem description",
    properties: {
      subject: {
        type: "string",
        description: "user's problem description",
      },
    },
    funcName: "subjectFunc",
  },

  {
    task_message: `You are an AI support bot for the company SAP, you help customers fill out a support ticket by asking one question at a time. You identified the problem and now you need to get enough information to create replication steps that resulted in the users problem.Once you have achieved this, call the nextTask function`,
    task_summary: "replication steps",
    properties: {
      description: {
        type: "string",
        description: "get users replication steps",
      },
    },
    funcName: "descriptionFunc",
  },
  {
    task_message: `Ask can the SAP support engineer make configuration changes to the user's system if they need to. Once you have achieved this, call the nextTask function`,
    task_summary: "user permission for configuration changes",
    properties: {
      permission: {
        type: "string",
        description: "ask for user permission",
      },
    },
    funcName: "permissionFunc",
  },
];

export const getTaskInstructionMessage = (task) => `
Current Task: ${task.task_message}

`;

export function getTaskFunction(index) {
  return {
    name: tasks[index].funcName,
    description: tasks[index].task_summary,
    parameters: {
      type: "object",
      properties: tasks[index].properties,
    },
    required: ["data"],
  };
}

export const generateTaskMessages = () =>
  tasks.map((task) => getTaskInstructionMessage(task));
