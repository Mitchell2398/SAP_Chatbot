import { TicketTable } from "./components/TicketTable/TicketTable";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <div className="grid cols-2 h-screen">
      <TicketTable />
      <Chatbot />
    </div>
  );
}

export default App;
