import OpenAI from "openai";
import React, { useState, useEffect } from "react";
import "./chatbot.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "SAPassist: How can I help you?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [replicationSteps, setReplicationSteps] = useState({});

  const sendMessage = (text, sender) => {
    const newMessage = { text, sender };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions while processing
    if (submitting) {
      return;
    }

    // Add the user message to the conversation
    const userMessage = inputValue.trim();

    if (userMessage === "") {
      window.alert("Please input the problem.");
      return; // Don't proceed if the input is empty
    }

    // Disable the submit button
    setSubmitting(true);

    setInputValue(""); // Clear the input field immediately
    sendMessage(`User: ${userMessage}`, "user");

    // You can use the ChatGPT API to generate responses based on user input.
    const response = await generateChatResponse(userMessage);
    sendMessage(`${response}`, "ai");

    // Reset the submitting state
    setSubmitting(false);
  };

  async function generateChatResponse(userInput) {
    try {
      const prompt =
        `You are a support AI Bot for SAP called SAPassit. Your job is to help customers report bugs/errors they encounter. 
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
                        User: Yes 
                        ###
                        \n
                        When you have reached the point in which you have received the replication steps and they appeapr to be actionable, 
                        you can generate a ticket by typing the indicator "JSONTICKET", 
                        followed by the replciation steps in json, 
                        The keys for the json object will be :
                          issue,
                          replication_steps,
                          permission_to_configure
                        it is imperative that you do not include any other text in your response or the system may fail if you do so, so just give the "JSONTICKET" header (for identification purposes) followed by raw json.
                        otherwise you can continue to ask questions.
                        \n Here is the current conversation history: ` +
        messages.map((message) => message.text).join("\n") +
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


      const jsonMatch = response.choices[0].message.content.match(/JSONTICKET\s*({[^}]+})/s);

      if (jsonMatch) {
        const jsonText = jsonMatch[1];
      
        try {
          // Parse the extracted JSON text as JSON
          const jsonData = JSON.parse(jsonText);
      
          // Now you can access the values in the JSON object
          console.log("Issue: " + jsonData.issue);
          console.log("Replication Steps: " + jsonData.replication_steps);
          console.log("Permission to Configure: " + jsonData.permission_to_configure);
          return "Thank you, your ticket has been generated and sent to the SAP support team. \n\n";
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.log("JSON data not found in the response.");
      }

      return response.choices[0].message.content; // Return the response text
    } catch (error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      // Reset the submitting state in case of an error
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
        {messages.map((message, index) => (
          <div key={index} className={`speech speech-${message.sender}`}>
            {message.text}
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
        {!submitting && (
          <button
            id="submit-btn"
            className={`submit-btn ${submitting ? "disabled" : ""}`}
            onClick={handleFormSubmit}
            disabled={submitting}
          >
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
