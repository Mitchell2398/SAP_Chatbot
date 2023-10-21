// This is where each of the  tasks will be stored,
// and the data keys that will be used to generate the data from each task.

const tasks = [
  {
    task_message: `Ask the user to describe the different clicks 
    they made that lead to the error message,
    and you will ask them to describe the error message they received.`,
    task_summary: "replication steps and error message",
    data_keys: ["subject", "priority", "category", "description"],
  },
  {
    task_message: `Ask for permission for an SAP support engineer to make the configuration changes 
    to the users system, in the case where it is necessary. If permission is not granted, that is okay.`,
    task_summary: "permission to make the necessary configuration changes",
    data_keys: ["permission: boolean (true/false)"],
  },
];

export const getTaskRetreivalMessage = (task) => `
You are a support AI Bot for SAP called SAPassist. 
Your job is to follow tasks in order to complete missing ticket data. 
To do this you need to ask questions based off what the user is saying, and the task you have been given.
Only ask one question at a time so you don't confuse the customer.

Here is your current task,

${task.task_message}

###

When you have reached the point in which you have received the information asked for in the task and it is sufficiently clear, 
you will immediately add the data to a ticket by typing the indicator "JSON_DATA", 
followed by the ${task.task_summary} data, in JSON format. 
The keys will be :
    ${task.data_keys.map((key) => key + ",\n")}
It is imperative that you give the accurate JSON object so that it is system-readable. 
Follow the task as given, do not attempt to retreive information unrelated to the task.

###

Example:
# could you please provide information of 'X'?
# 'X' is 'Y'.
# JSON_DATA: {/*JSON Object goes here with required keys*/}
`;

export const getContextMessage = (currentTaskIndex, ticket) => {
  // If no tasks are completed return no context.
  if (currentTaskIndex === 0) {
    return ``;
  }
  return `Here is the current ticket you are working on. You do not have to investigate topics which have already been covered.
          TASKS ALREADY COMPLETED: ${currentTaskIndex} out of ${tasks.length}.
      ${tasks.slice(0, currentTaskIndex).map((task, i) => {
        return `Task ${i} : ${task.task_summary},\n`;
      })}.
      The current ticket information is as follows:
      ${JSON.stringify(ticket, null, 1)}
`;
};

export const generateTaskMessages = () =>
  tasks.map((task) => getTaskRetreivalMessage(task));
