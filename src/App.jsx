import { TicketTable } from "./components/TicketTable/TicketTable";
import Chatbot from "./components/Chatbot/Chatbot";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
  };
  return (
    <div style={bgImage} className="flex flex-col ">
      <div className="flex flex-col lg:flex-row pt-5 px-5 splash-bg bg-transparent max-h-[90%] w-screen gap-5 flex-grow items-center">
        <Chatbot setTicket={setTicket} ticket={ticket} />
        <TicketTable ticket={ticket} setTicket={setTicket} />
      </div>
      <div className="flex flex-row pb-[3rem] items-center gap-8 justify-center">
        <ContentCopyIcon
          className="text-slate-300 text-3xl cursor-pointer"
          onClick={() => navigator.clipboard.writeText("Hello , I am having a problem creating a new project stock order.")}
        />

        <ContentCopyIcon
          color="white"
          className="text-slate-300 text-3xl  cursor-pointer"
          onClick={() => navigator.clipboard.writeText("When I try to create a new project stock order, it says \"Project stock order not created, selection includes only services\"")}
        />

        <ContentCopyIcon
          className="text-slate-300 text-3xl  cursor-pointer"
          onClick={() => navigator.clipboard.writeText("Okay, I navigated to project management, then opened the projects view, searched for the project ID. Then I clicked the edit button , went to product overview. Then i selected a product and clicked create project stock order")}
        />
      </div>
    </div>
  );
}

export default App;
