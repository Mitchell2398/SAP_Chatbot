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
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl font-semibold mt-1">Current Ticket</h1>
        {
          ticket.editable?(
            <h1 className="p-1 rounded-md text-sm text-blue-700 font-semibold mt-1">Editting</h1>):
            (<h1 className="p-1 rounded-md text-sm text-red-500 font-semibold mt-1">Not Editable</h1>)

        }
      </div>
      <h1 className="font-semibold text-xs text-slate-500">Perimission Granted: 
      {ticket.permission? " Yes": " No"}
      </h1>
      {/* Subject, Priority, Category, Description */}
      <div className="flex flex-col flex-grow mt-2">
        <div className="flex flex-row justify-between gap-5 mx-3">
          <div className="flex border-slate-600 flex-row gap-5 items-center gap-5 justify-start">
            <h1 className="text-lg">Subject</h1>
            <input
              className="text-slate-300 text-center w-fill border-slate-700 bg-slate-950"
              value={ticket.subject}
              onChange={ticket.editable?(event) => handleFieldChange(event, "subject"):null}
            />
          </div>
          <div className="flex flex-row gap-3 items-center p-2 rounded-lg border-2 border-emerald-700 justify-start">
            <h1 className="text-base font-semibold">Priority</h1>
            <input
              className="text-base text-slate-300 text-center w-[3rem] border-slate-700  bg-slate-950"
              value={ticket.priority}
              onChange={ticket.editable?(event) => handleFieldChange(event, "priority"):null}
            />
          </div>
        </div>

        <div className="flex flex-row p-3 justify-start gap-5 mb-2 items-center">
          <h1 className="text-lg">Category</h1>
          <input
            className="text-slate-300 border-slate-700 bg-slate-950"
            value={ticket.category}
            onChange={ticket.editable?(event) => handleFieldChange(event, "category"):null}
          />
        </div>
        <div className="flex p-3 border-t flex-grow h-full border-slate-600 flex-col">
          <h1 className="text-lg mb-3">Description</h1>
          <textarea
            className="text-slate-300 p-2 resize-none flex-grow border-slate-700  bg-slate-950"
            title={"Description."}
            placeholder="Issue decription including replication steps"
            value={ticket.description}
            onChange={ticket.editable?(event) => handleFieldChange(event, "description"):null}
          />
        </div>
      </div>
    </div>
  );
};
