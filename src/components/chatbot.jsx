import OpenAI from "openai";
import React, { useState, useEffect } from "react";
import "./chatbot.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are a support AI Bot for SAP called SAPassit. Your job is to help customers report bugs/errors they encounter.`,
    },
  ]);
  const [renderMessages, setRenderMessages] = useState([
    { role: "SAPassist", content: "How can I help you?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === "") {
      window.alert("Please input the problem.");
      return; // Don't proceed if the input is empty
    }

    // Update state and wait for it to complete
    await setRenderMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputValue },
    ]);
    await setMessages((prevMessages) => [
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
      // Passing most up to date info, may need to swap to useEffect later
      const updatedMessages = [...messages];
      updatedMessages.push({ role: "user", content: inputValue });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: updatedMessages,
        presence_penalty: -0.5, 
        frequency_penalty: 0.3,

      });

      const responseMessage = response.choices[0].message;

      // Update the state with the response and the user message
      setMessages((prevMessages) => [
        ...prevMessages,
        ...updatedMessages,
        responseMessage,
      ]);
      setRenderMessages((prevMessages) => [
        ...prevMessages,
        { role: "SAPassist", content: responseMessage.content },
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
      <div className="chatbot-conversation-container" id="chatbot-conversation">
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
