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

  const sendMessage = (text, sender) => {
    const newMessage = { text, sender };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

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
      const prompt = `You are a support AI Bot for SAP called SAPassit. Your job is to help customers report bugs/errors they encounter. 
                        Critically, your job is to get the replication steps the customer encountered, 
                        as this is the key information the support engineer needs. To do this you need to ask questions based off what the user is saying.
                         Once you get the replication steps, then you need to ask for persomission to 
                        change the configuration of the customers system. Once you gather all the information, it will be used to generate a customer support ticket to send to the engineer team 
                        Only ask one question at a time so you don't confuse the customer.
                        ###
                        Here is an example of a conversation
                        User: I cannot add team member to project
                        SAPassist: I am sorry to hear that, can you describe the different clicks you made that lead to the error message 
                        User: 1. I clicked on team members from the home page, 2. I then selected on the team members drop down menu, 3. I seleted team member which resulted in error message: 577 "cannot add team member"
                        SAPassist: I understand, before I generate a ticket for you, does a SAP support engineer have permission to make the necessary configuration changes?
                        User: Yes ` + messages.map((message) => message.text).join("\n") +
                        `\n\nPlease continue this conversation from where it left off.`;
                        

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: prompt,
          },
          {
            role: "user",
            content: `User: ${userInput}`,
          },
        ],
        temperature: 0.7, // Adjust temperature as needed
        max_tokens: 500, // Adjust max_tokens as needed
      });

      return response.choices[0].message.content; // Return the response text
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
        {submitting && (
          <div className="speech speech-ai">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>{" "}
          </div>
        )}
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
            <div class="spinner">
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
            </div>
          ) : (
            <img
              src="/src/assets/send-btn-icon.png"
              className="send-btn-icon"
            />
          </button>
        )}
      </form>
    </section>
  );
}
