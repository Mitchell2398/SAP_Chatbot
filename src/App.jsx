import { TicketTable } from "./components/TicketTable/TicketTable";
import Chatbot from "./components/Chatbot/Chatbot";
import { useState } from "react";

function App() {
  const [ticket, setTicket] = useState({
    subject: "TBD",
    priority: "TBD",
    category: "TBD",
    description: "TBD",
  });

  return (
    <div className="flex flex-col sm:flex-row p-5 bg-slate-200 w-screen gap-5 h-screen items-center max-h-screen">
      <Chatbot setTicket={setTicket} ticket={ticket} />
      <TicketTable subject={ticket.subject} priority={ticket.priority} category={ticket.category} description={ticket.description} />

    </div>
  );
}

export default App;
