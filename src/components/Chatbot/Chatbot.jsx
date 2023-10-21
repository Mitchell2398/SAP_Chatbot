import React, { useEffect, useState, useRef } from "react";
import "./Chatbot.css";
import {
  generateTaskMessages,
  getContextMessage,
  initialPrompt,
} from "../../res/prompts";
import { extractJSON } from "../../util/extractJSON";
import { getOpenAICompletion } from "../../util/openAIRequests";

const taskMessages = generateTaskMessages();

export default function Chatbot({ setTicket, ticket }) {
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const [chatBoxMessages, setChatBoxMessages] = useState([
    { role: "SAPassist", content: "How can I help you?" },
  ]);

  const openAPIChatHistory = useRef([
    {
      role: "system",
      content:
        initialPrompt +
        "\n" +
        taskMessages[currentTaskIndex] +
        "\n" +
        getContextMessage(currentTaskIndex, ticket),
    },
  ]);

  // Called when the current task index changes, delete conversation history and jsut give context
  const getNextChatHistory = () => {
    return [
      {
        role: "system",
        content:
          initialPrompt +
          "\n" +
          getContextMessage(currentTaskIndex, ticket) +
          "\n" +
          taskMessages[currentTaskIndex]
      }
    ];
  };

  useEffect(() => {
    // TODO : get next 'openAPImessages' object.
    openAPIChatHistory.current = getNextChatHistory();
  }, [currentTaskIndex]);

  async function generateChatResponse() {
    // TODO : get next 'openAPImessages' object.
    openAPIChatHistory.current = [
      ...openAPIChatHistory.current,
      {
        role: "user",
        content: inputValue,
      }
    ];
  
    let openAPIResponseMessage = await getOpenAICompletion(
      openAPIChatHistory.current
    );

    const ticketData = extractJSON(openAPIResponseMessage);

    // If data has been found.
    if (ticketData) {
      setTicket((ticket) => {
        return {
          ...ticket,
          ...ticketData,
        };
      });

      // Move onto the next question.
      setCurrentTaskIndex((currentTaskIndex) => {
        return currentTaskIndex + 1 >= taskMessages.length
          ? currentTaskIndex
          : currentTaskIndex + 1;
      });

      // Get the next response from the backend.
      openAPIResponseMessage = await getOpenAICompletion(
        openAPIChatHistory.current
      );
    }

    setChatBoxMessages((prevMessages) => [
      ...prevMessages,
      { role: "SAPassist", content: openAPIResponseMessage },
    ]);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === "") {
      return; // Don't proceed if the input is empty
    }

    // Update state and wait for it to complete
    await setChatBoxMessages((prevMessages) => [
      ...prevMessages,
      { role: "User", content: inputValue },
    ]);

    setSubmitting(true);
    setInputValue(""); // Clear the input field immediately
    await generateChatResponse(); // Now, the state is updated
    setSubmitting(false);
  };

  return (
    <div className="bg-slate-950 rounded-2xl max-h-[80%] h-[80%] w-full sm:w-[50%] flex flex-col p-8">
      <div className="flex flex-row justify-between items-center">
        <img src="/src/assets/Sap-logo.png" className="logo" alt="Logo" />
        <h1>
          SAP<span className="text-blue-400">assist</span>
        </h1>
        <p className="supportId">User ID: 2344</p>
      </div>

      <div
        className="chatbot-conversation-container flex-grow"
        id="chatbot-conversation"
      >
        {chatBoxMessages.map((message, index) => (
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
