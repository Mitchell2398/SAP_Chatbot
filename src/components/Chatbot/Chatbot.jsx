import React, { useEffect, useState, useRef } from "react";
import "./Chatbot.css";
import {
  generateTaskMessages,
  getTaskFunction,
  tasks,
} from "../../res/prompts";
import { getOpenAICompletion, completeTicketOpenAi } from "../../util/apiCall";

const taskMessages = generateTaskMessages();

export default function Chatbot({ setTicket, ticket }) {
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "SAPassist", content: "Hello, How can I help you?" },
  ]);

  const openAPIChatHistory = useRef([
    {
      role: "system",
      content: taskMessages[currentTaskIndex],
    },
  ]);


  // Calculate the width as a percentage
  const progress = ticket.completed?100:(currentTaskIndex / tasks.length) * 100;

  async function nextTask() {
    completeTicketOpenAi(

      [
        ...openAPIChatHistory.current,

        {
          role: "system",
          content: `You have completed the task, now call the function ${tasks[currentTaskIndex].funcName}. Make sure you pass all arguments. The nextTask function has already been called, so do not call it`,
        },
      ],
      getTaskFunction(currentTaskIndex),
      ticket,
      setTicket
    );
    
    if (currentTaskIndex < taskMessages.length - 1) {



      setCurrentTaskIndex((currentTaskIndex) => {
        return currentTaskIndex + 1;
      });

      setSubmitting(false);
      return;
    }
    setTicket((prevTicket) => ({
      ...prevTicket,
      completed: true,
    }));
    
  }

  // Can this be done in next task?
  useEffect(() => {
    if (currentTaskIndex === 0) return;

    openAPIChatHistory.current = [
      {
        role: "system",
        content: taskMessages[currentTaskIndex],
      },
    ];


    setSubmitting(true);
    getOpenAICompletion(openAPIChatHistory.current).then((message) => {
      openAPIChatHistory.current = [
        ...openAPIChatHistory.current,
        {
          role: "system",
          content: message.content,
        },
      ];

      setConversationHistory((prevMessages) => [
        ...prevMessages,
        { role: "SAPassist", content: message.content },
      ]);

      setSubmitting(false);
    });
  }, [currentTaskIndex]);


  async function generateChatResponse() {
    console.log(openAPIChatHistory);
    openAPIChatHistory.current = [
      ...openAPIChatHistory.current,

      {
        role: "user",
        content: inputValue,
      },
    ];

    let openAPIResponseMessage = await getOpenAICompletion(
      openAPIChatHistory.current
    );

    // Check if the AI intends to call a function
    if (openAPIResponseMessage.function_call) {
      const functionName = openAPIResponseMessage.function_call.name;

      if (functionName === "nextTask") {
        await nextTask();
      }
    } else {
      openAPIChatHistory.current = [
        ...openAPIChatHistory.current,
        {
          role: "system",
          content: openAPIResponseMessage.content,
        },
      ];

      setConversationHistory((prevMessages) => [
        ...prevMessages,
        { role: "SAPassist", content: openAPIResponseMessage.content },
      ]);
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === "") {
      return; // Don't proceed if the input is empty
    }

    // Update state and wait for it to complete
    await setConversationHistory((prevMessages) => [
      ...prevMessages,
      { role: "User", content: inputValue },
    ]);

    setSubmitting(true);
    setInputValue(""); // Clear the input field immediately
    await generateChatResponse(); // Now, the state is updated
    setSubmitting(false);
  };

  // Auto scroll functionality
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const chatElement = chatContainerRef.current;
    chatElement.scrollTop = chatElement.scrollHeight;
  }, [conversationHistory]);

  return (
    <div className="bg-slate-950 rounded-2xl max-h-[80%] h-[80%] w-full lg:w-[50%] flex flex-col p-8">

      <div className="flex flex-row justify-between items-center">
        <img
          src="https://res.cloudinary.com/dheko2ynz/image/upload/v1698009828/Sap-logo_qfsey0.png"
          className="logo"
          alt="Logo"
        />
        <h1>
          SAP<span className="text-blue-400">assist</span>
        </h1>
        <p className="supportId">User ID: 2344</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full mt-3 h-2.5 dark:bg-gray-700">
        <div className="h-2.5 rounded-full transition-all duration-[2s]" style={{width:`${progress}%`, backgroundColor:ticket.completed?"#059669":"#3b82f6"}}></div>
      </div>
      <div
        className="chatbot-conversation-container flex flex-col-reverse gap-3 flex-grow"
        id="chatbot-conversation"
        ref={chatContainerRef}
      >
        {ticket.completed && (
          <>
            <div className=" flex items-center rounded-lg flex-row justify-between px-4 py-3">
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Ticket Completed</h1>
                <p className="text-sm ">
                  Does the information provided look accurate?
                </p>
              </div>
              <button
                className="border border-blue-700 transition-all duration-500 text-slate-300 hover:bg-blue-700 rounded-lg p-2"
                onClick={() => {
                  setTicket((ticket) => {
                    return {
                      ...ticket,
                      submitted: true,
                      editable: false,
                    };
                  });
                }}
              >
                Submit Ticket
              </button>
              <button
                className="
            border border-blue-400 text-slate-300 hover:bg-blue-400 hover:text-slate-900 transition-all duration-500 rounded-lg p-2
            "
                onClick={() => {
                  setTicket((ticket) => {
                    return {
                      ...ticket,
                      editable: !ticket.editable,
                    };
                  });
                }}
              >
                {!ticket.editable ? "Edit Ticket" : "Finish Edit"}
              </button>
            </div>
          </>
        )}

        {submitting && (
          <div className=" speech speech-SAPassist">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        )}

        {conversationHistory
          .slice()
          .reverse()
          .map((message, index) => (
            <div key={index} className={`speech speech-${message.role}`}>
              {`${message.role}: ${message.content}`}
            </div>
          ))}
      </div>

      <form id="form" className="flex">
        <input
          name="user-input"
          type="text"
          id="user-input"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          required
        />
        <button
          id="submit-btn"
          className={`submit-btn ${submitting ? "disabled" : ""}`}
          onClick={handleFormSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          ) : (
            <img
              src="https://res.cloudinary.com/dheko2ynz/image/upload/v1698009828/send-btn-icon_vvhbud.png"
              className="send-btn-icon"
            />
          )}
        </button>
      </form>
    </div>
  );
}
