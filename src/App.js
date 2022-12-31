import React from "react";
import Balance from "./Components/Balance";
import Expense from "./Components/Expense";
import Income from "./Components/Income";

const App = () => {
  ///
  //////////////////////////////////////////

  //////////////////////////////////////////////////

  return (
    <div className="flex  xl:h-screen xl:items-center">
      <div className="flex flex-col  xl:flex-row xl:justify-evenly items-center xl:h-screen xl:py-10 flex-auto bg-slate-400 md:bg-blue-500">
        <Income className="xl:flex-auto " />
        <Balance className="xl:flex-auto" />
        <Expense className="xl:flex-auto" />
      </div>
    </div>
  );
};

export default App;
