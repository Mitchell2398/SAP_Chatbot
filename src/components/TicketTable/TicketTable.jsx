export const TicketTable = ({ subject, priority, category, description }) => {
  return (
    <div className="sm:w-[50%] h-[80%] w-full flex flex-col bg-slate-950 p-5 rounded-xl">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl font-semibold mt-1">Current Ticket</h1>
      </div>
      {/* Subject, Priority, Category, Description */}
      <div className="flex flex-col mt-5">
        <div className="flex flex-row justify-between gap-5 mx-3">
          <div className="flex border-slate-600 flex-row gap-5 items-center gap-5 justify-start">
            <h1 className="text-lg">Subject</h1>
            <p className="text-slate-300">{subject ? subject : "N/A"}</p>
          </div>
          <div className="flex flex-row gap-3 items-center  p-2 rounded-lg border-2 border-emerald-700 justify-start">
            <h1 className="text-base font-semibold ">Priority</h1>
            <p className="text-base text-slate-300">{priority ? priority : "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-row p-3 justify-start gap-5 items-center">
          <h1 className="text-lg">Category</h1>
          <p className="text-slate-300">{category ? category : "N/A"}</p>
        </div>
        <div className="flex p-3 border-t border-slate-600 flex-col">
          <h1 className="text-lg mb-3">Description</h1>
          <p className="text-slate-300">{description ? description : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};
