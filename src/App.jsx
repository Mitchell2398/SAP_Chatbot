import { TicketTable } from "./components/TicketTable/TicketTable";
import Chatbot from "./components/Chatbot/Chatbot";
import { useState } from "react";

function App() {
  const [ticket, setTicket] = useState({
    subject: "",
    priority: "",
    category: "",
    description: "",
    completed: false,
    editable: false,
    submitted: false,
  });

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-slate-200 w-screen gap-5 h-screen items-center max-h-screen">
      <Chatbot setTicket={setTicket} ticket={ticket} />
      <TicketTable ticket={ticket} setTicket={setTicket}/>

    </div>
  );
}

export default App;
