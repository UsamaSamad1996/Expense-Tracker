import React from "react";
import Balance from "../Components/Balance";
import Expense from "../Components/Expense";
import Income from "../Components/Income";

const HomePage = () => {
  return (
    <div className="flex  xl:h-screen xl:items-center">
      <div className="flex flex-col h-full items-center xl:flex-row xl:justify-evenly  xl:h-screen xl:py-10 flex-auto bg-white md:bg-blue-500">
        <Income className="xl:flex-auto " />
        <Balance className="xl:flex-auto" />
        <Expense className="xl:flex-auto" />
      </div>
    </div>
  );
};

export default HomePage;
