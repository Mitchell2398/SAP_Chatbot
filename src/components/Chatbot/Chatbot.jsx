import React, { useEffect, useState, useRef } from "react";
import "./Chatbot.css";
import { generateTaskMessages } from "../../res/prompts";
import { getOpenAICompletion } from "../../util/openAIRequests";

const taskMessages = generateTaskMessages();

export default function Chatbot({ setTicket, ticket }) {
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const [conversationHistory, setConversationHistory] = useState([
    { role: "SAPassist", content: "How can I help you?" },
  ]);

  const openAPIChatHistory = useRef([
    {
      role: "system",
      content:
        taskMessages[currentTaskIndex] 
    }
  ]);

  useEffect(() => {
    if (currentTaskIndex === 0) return;
    if (currentTaskIndex === taskMessages.length) {
      setTicket((ticket) => {
        return {
          ...ticket,
          completed: true,
        };
      });
      return;
    }
    openAPIChatHistory.current = [
      {
        role: "system",
        content:
          taskMessages[currentTaskIndex] 
      }
    ];

    // Get the next response from the backend.
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
    });
  }, [currentTaskIndex]);

  async function generateChatResponse() {
    // Add the user's message to the chat history
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

  

    // If data has been found.
    if (openAPIResponseMessage.function_call) {
      const ticketData = JSON.parse(
        openAPIResponseMessage.function_call.arguments
      );
      setTicket((ticket) => {
        return {
          ...ticket,
          ...ticketData,
        };
      });

      // Move onto the next question.
      setCurrentTaskIndex((currentTaskIndex) => {
        return currentTaskIndex + 1;
      });

      setConversationHistory((prevMessages) => [
        ...prevMessages,
        { role: "System", content: "Updated ticket data." },
      ]);

      return;
    }else{
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

  return (
    <div className="bg-slate-950 rounded-2xl max-h-[80%] h-[80%] w-full lg:w-[50%] flex flex-col p-8">
      <div className="flex flex-row justify-between items-center">
        <img src="/src/assets/Sap-logo.png" className="logo" alt="Logo" />
        <h1>
          SAP<span className="text-blue-400">assist</span>
        </h1>
        <p className="supportId">User ID: 2344</p>
      </div>

      <div
        className="chatbot-conversation-container flex flex-col-reverse gap-3 flex-grow"
        id="chatbot-conversation"
      >
                {ticket.completed && (
          <>

          <div className=" flex items-center rounded-lg flex-row justify-between px-4 py-3">
          <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Ticket Completed</h1>
          <p className="text-sm ">Does the information provided look accurate?</p>
          </div >
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
            <button className="
            border border-blue-400 text-slate-300 hover:bg-blue-400 hover:text-slate-900 transition-all duration-500 rounded-lg p-2
            "
            onClick={
              () => {
                setTicket((ticket) => {
                  return {
                    ...ticket,
                    editable: !ticket.editable,
                  };
                });
              }
            }>
              {!ticket.editable? "Edit Ticket": "Finish Edit"}
            </button>
          </div>
          </>
        )}
        {conversationHistory.toReversed().map((message, index) => (
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
              src="/src/assets/send-btn-icon.png"
              className="send-btn-icon"
            />
          )}
        </button>
      </form>
    </div>
  );
}
