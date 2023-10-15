import { TicketTable } from "./components/TicketTable/TicketTable";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <div className="flex flex-col sm:flex-row p-5 bg-slate-200 w-screen gap-5 h-screen items-center max-h-screen">
      <Chatbot />
      <TicketTable />

    </div>
  );
}

export default App;
