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

  const bgImage = {
    backgroundImage: `url("/bg-image2.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
  }
  return (
    <div style={bgImage} className="flex flex-col lg:flex-row p-5 splash-bg bg-slate-200 w-screen gap-5 h-screen items-center max-h-screen">
      <Chatbot setTicket={setTicket} ticket={ticket} />
      <TicketTable ticket={ticket} setTicket={setTicket}/>
    </div>
  );
}

export default App;
