import OpenAI from "openai";
import React, { useState } from "react";
import "./Chatbot.css";
import { initialPrompt } from "../../res/prompts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Chatbot({ ticket, setTicket }) {
  const [renderMessages, setRenderMessages] = useState([
    { role: "SAPassist", content: "How can I help you?" },
  ]);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
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
      When you have reached the point in which you have received the replication steps and they appear to be actionable, 
      you can generate a ticket by typing the indicator "JSONTICKET", 
      followed by the replication steps in json, 
      The keys for the json object will be :
        subject,
        priority,
        category,
        description,
      it is imperative that you do not include any other text in your response or the system may fail if you do so, so just give the "JSONTICKET" header (for identification purposes) followed by raw json.
      otherwise you can continue to ask questions.`
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === "") {
      window.alert("Please input the problem.");
      return; // Don't proceed if the input is empty
    }

    // Update state and wait for it to complete
    await setRenderMessages((prevMessages) => [
      ...prevMessages,
      { role: "User", content: inputValue },
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
        presence_penalty: -0.3, // Use the updated messages
      });

      const jsonMatch = response.choices[0].message.content.match(/JSONTICKET\s*({[^}]+})/s);

      if (jsonMatch) {
        const jsonText = jsonMatch[1];
      
        try {
          // Parse the extracted JSON text as JSON
          const jsonData = JSON.parse(jsonText);

          // Now you can access the values in the JSON object
          setTicket({
            subject: jsonData.subject,
            priority: jsonData.priority,
            category: jsonData.category,
            description: jsonData.description,
          });

          setRenderMessages((prev) => [...prev,{ role: "SAPAssist", content: "Thank you, I have now generated the ticket." }]);
          return;

         } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.log("JSON data not found in the response.");
      }

      const responseMessage = response.choices[0].message.content;
       // Return the response text
      // Update the state with the response and the user message
      setMessages((prevMessages) => [
        ...prevMessages,
        ...updatedMessages,
        {role:"system",content:responseMessage},
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
        {renderMessages.map((message, index) => (
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
