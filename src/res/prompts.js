// This is where each of the  tasks will be stored,
// and the data keys that will be used to generate the data from each task.

export const tasks = [
  {
    task_message: `You are SAPassist, an AI support bot for SAP. Your primary function is to assist users in completing their tickets by obtaining specific information. Ask the user to briefly describe the problem they're facing with the system. Once you have achieved this, call the nextTask function`,
    task_summary: "user's problem description",
    properties: {
      subject: {
        type: "string",
        description: "user's problem description",
      },
      category: {
        type: "string",
        description: "the component of software affected"
      }
    },
    funcName: "subjectFunc",
  },

  {
    task_message: `You are SAPassist, an AI support bot for SAP. Your primary function is to assist users in completing their tickets by obtaining specific information. Inquire about the specific steps the user took that led to the problem. This will help in replicating the issue. Make sure you get enough information to create the replication steps,Once you have achieved this, call the nextTask function`,
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
    task_message: `You are SAPassist, an AI support bot for SAP. Your primary function is to assist users in completing their tickets by obtaining specific information. Ask the user did the get an error code when the problem occurred. Once you have achieved this, call the nextTask function`,
    task_summary: "error code inquiry",
    properties: {
      error_code: {
        type: "string",
        description: "make inquiry about error code",
      },
    },
    funcName: "errorCodeFunc",
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
