import { TicketTable } from "./components/TicketTable/TicketTable";
import { Chatbot }  from "./components/Chatbot/Chatbot";

function App() {
  return (
    <div className="bodyContainer">
      <TicketTable />
      <Chatbot />
    </div>
  );
}

export default App;
