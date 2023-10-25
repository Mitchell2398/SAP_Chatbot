import React, { useState } from "react";

export const TicketTable = ({ setTicket, ticket }) => {
  // Initialize state for subject, priority, category, and description

  // Handle changes for all fields
  const handleFieldChange = (event, fieldName) => {
    const value = event.target.value;
    setTicket({ ...ticket, [fieldName]: value });
  };

 

  return (
    <div className="lg:w-[50%] h-[80%] w-full flex flex-col bg-slate-950 p-5 rounded-xl">
      <div className="flex flex-row justify-between  items-center mb-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold mt-1">Current Ticket</h1>
          <h1 className="font-semibold text-xs text-slate-500">
            Perimission Granted:
            {ticket.permission ? " Yes" : " No"}
          </h1>
        </div>
        <div className="flex flex-col text-right">
          <div className="flex flex-row gap-3 items-center p-1 border-b-2 border-blue-700 justify-start">
            <h1 className="text-sm font-semibold">Priority</h1>
            {ticket.editable ? (
              <select
                className="text-slate-300 text-sm border p-1 rounded-lg text-center w-fill border-slate-700 bg-slate-950"
                value={ticket.priority}
                onChange={(event) => handleFieldChange(event, "priority")}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <h1 className="text-slate-300  text-sm text-center w-fill border-slate-700 bg-slate-950">
                {ticket.priority}
              </h1>
            )}
          </div>
          {ticket.editable ? (
            <h1 className="rounded-md text-sm text-red-700 font-semibold mt-1">
              Editing
            </h1>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Subject, Priority, Category, Description */}
      <div className="flex flex-col flex-grow justify-center mt-2">
        <div className="flex flex-row justify-between gap-5">
          <div className="flex flex-row justify-start gap-5 mb-2 items-center">
            <h1 className="text-lg text-slate-200 font-semibold">Category</h1>
            {ticket.editable ? (
              <select
                className="text-slate-300 border-slate-700 border p-2 rounded-lg bg-slate-950"
                value={ticket.category}
                onChange={(event) => handleFieldChange(event, "category")}
              >
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <h1 className="text-slate-300 text-center w-fill border-slate-700 bg-slate-950">
                {ticket.completed ? ticket.category : ""}
              </h1>
            )}
          </div>
        </div>
        <div className="flex border-slate-600 flex-row gap-5 items-center gap-5 py-3">
          <h1 className="text-lg text-slate-200 font-semibold">Subject</h1>
          {ticket.editable ? (
            <input
              className="text-slate-300 border py-2 rounded-lg text-center w-fill border-slate-700 bg-slate-950"
              value={ticket.subject}
              onChange={(event) => handleFieldChange(event, "subject")}
            />
          ) : (
            <h1 className="text-slate-300 text-center w-fill border-slate-700 bg-slate-950">
              {ticket.completed ? ticket.subject : ""}
            </h1>
          )}
        </div>
        <div className="flex pt-3 border-t flex-grow h-full border-slate-600 flex-col">
          <h1 className="text-lg mb-3  text-slate-200 font-semibold">
            Description
          </h1>
          {ticket.editable ? (
            <textarea
              className="text-slate-300 border p-2 rounded-lg p-2 resize-none flex-grow border-slate-700  bg-slate-950"
              title={"Description."}
              placeholder="Issue decription including replication steps"
              value={ticket.description}
              onChange={(event) => handleFieldChange(event, "description")}
            />
          ) : (
            <h1 className="text-slate-300 px-3 text-left w-fill border-slate-700 whitespace-pre-line bg-slate-950">
              {ticket.completed ? ticket.description : ""}
            </h1>
          )}
        </div>
      </div>
    
    </div>
  );
};
