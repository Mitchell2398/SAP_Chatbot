import OpenAI from "openai";
import React, { useState } from "react";
import "./Chatbot.css";
import { initialPrompt } from "../../res/prompts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Chatbot({ticket, setTicket}) {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: initialPrompt,
    }]);
  const [renderMessages, setRenderMessages] = useState([
    { role: "SAPassist", content: "How can I help you?" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);



  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === "") {
      return; // Don't proceed if the input is empty
    }

    // Update state and wait for it to complete
    await setRenderMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputValue },
    ]);

    await setBackendMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputValue },
    ]);

    setSubmitting(true);
    setInputValue(""); // Clear the input field immediately
    await generateChatResponse(); // Now, the state is updated
    setSubmitting(false);
  };

  async function generateChatResponse() {
    try {
      let response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [...backendMessages, { role: "user", content: inputValue }],
        presence_penalty: -0.3, // Use the updated messages
      });

      let responseMessage = response.choices[0].message.content;

      const ticketData = extractJSON(responseMessage);

      // If data has been retreived
      if (ticketData) {
        // Update the ticket with the new data.
        setTicket((ticket) => {
          if (ticket) {
            return {
              ...ticket,
              ...ticketData,
            };
          }
          return ticketData;
        });

        // Move onto the next question.
        setCurrentTaskIndex((prev) => {
          if (prev + 1 >= tasks.length) {
            // All tasks are completed in this if statement, add terminating logic here.
            return prev;
          }

          return prev + 1;
        });

        // Get the next response from the backend.
        response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            ...backendMessages,
            { role: "system", content: responseMessage },
            { role: "system", content: "Well done!, you retreived the data" },
            { role: "system", content: tasks[currentTaskIndex + 1].message },
          ],
          presence_penalty: -0.3, // Use the updated messages
        });

        responseMessage = response.choices[0].message.content;
      }

      // Update messages
      setBackendMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: inputValue },
        { role: "system", content: responseMessage },
      ]);

      setRenderMessages((prevMessages) => [
        ...prevMessages,
        { role: "SAPassist", content: responseMessage },
      ]);
    } catch (error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      setSubmitting(false);
      throw error;
    }
  }

  return (
    <section className="chatbot-container">
      <div className="chatbot-header">
        <img src="/src/assets/Sap-logo.png" className="logo" alt="Logo" />
        <h1>
          SAP<span className="blue">assist</span>
        </h1>
        <p className="supportId">User ID: 2344</p>
      </div>

      <div className="chatbot-conversation-container flex-grow" id="chatbot-conversation">
        {renderMessages.map((message, index) => (
          <div key={index} className={`speech speech-${message.role}`}>
            {`${message.role}: ${message.content}`}
          </div>
        ))}
      </div>
      <form id="form" className="chatbot-input-container">
        <input
          name="user-input"
          type="text"
          id="user-input"
          onChange={handleInputChange}
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
    </section>
  );
}
