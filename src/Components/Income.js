import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { HiCurrencyDollar } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { handleDelete } from "../redux-state/AccountingActions";
import { useDispatch } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const Income = () => {
  ///
  ///////////////////////////////////////////////////////////////////

  const { incomeList } = useSelector((state) => state.AccountingReducer);

  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////////

  const consolidator = (arg) => {
    const newArr = [];

    const arr = JSON.parse(JSON.stringify(arg));

    arr.forEach((arrItem) => {
      const ind = newArr.findIndex(
        (item) => item.category === arrItem.category
      );

      if (ind === -1) {
        newArr.push(arrItem);
      } else {
        newArr[ind].amount =
          Number(newArr[ind].amount) + Number(arrItem.amount);
      }
    });

    // console.log(newArr);
    return newArr;
  };

  const incomingItems = consolidator(incomeList);

  const totalIncomeAmounts = incomingItems.map((item) => Number(item.amount));

  const totalIncome = totalIncomeAmounts.reduce(
    (acc, current) => acc + current,
    0
  );

  const data = {
    labels: incomingItems.map((item) => item.category),
    datasets: [
      {
        label: "$",
        data: incomingItems.map((item) => item.amount),
        backgroundColor: [
          "rgba(255, 99, 132, 10)",
          "rgba(54, 162, 235, 10)",
          "rgba(255, 206, 86, 10)",
          "rgba(75, 192, 192, 10)",
          "rgba(153, 102, 255, 10)",
          "rgba(255, 159, 64, 10)",
          "rgba(455, 200, 150, 10)",
        ],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)",
        // ],
        borderWidth: 0,
      },
    ],
  };

  ///////////////////////////////////////////////////////////////

  return (
    <div className="bg-white rounded-md w-screen h-screen md:w-[70%] lg:w-[70%]  xl:w-[32%] xl:h-[100%] order-last xl:order-first py-2 ">
      <div className="income mt-2 mb-2 flex justify-center items-center ">
        <h2 className="xl:text-3xl text-2xl text-slate-600 font-semibold flex items-center">
          Total Income
          <HiCurrencyDollar className="text-green-500 text-5xl ml-3" />
          {totalIncome.toLocaleString()}
        </h2>
      </div>
      <hr />
      <div className=" flex justify-center items-center mt-3 mb-3 xl:px-24 px-4">
        <Doughnut data={data} />
      </div>
      <div className="array   rounded-md mx-1 flex flex-col justify-start mt-8 xl:mt-0 h-[45%] xl:h-[40%] md:h-[55%] lg:[40%] xl:px-3 px-1 hover:overflow-y-scroll overflow-hidden">
        {incomeList.map((item) => (
          <div
            style={{
              boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
            }}
            key={item.id}
            className="flex  items-center   py-2 border-2 border-gray-400 my-2 rounded-md "
          >
            <div className="dollar flex items-center justify-center w-[11%]">
              {" "}
              <HiCurrencyDollar className="text-green-500 text-4xl" />
            </div>
            <div className="dollarlogo text-sm xl:text-lg md:text-lg whitespace-nowrap flex items-center justify-start w-[28%] ">
              {item.category}
            </div>

            <div className="amount text-sm xl:text-base md:text-lg flex items-center justify-center w-[28%] ">
              {item.date}
            </div>
            <div className="amount text-sm xl:text-base md:text-lg flex items-center justify-start  w-[22%]">
              $ {Number(item.amount).toLocaleString()}
            </div>

            <div className="deleteItem   flex items-center  w-[11%] justify-center">
              <button
                onClick={() => dispatch(handleDelete(item.id))}
                className="bg-blue-500 rounded-md p-[2px] text-white text-2xl"
              >
                <MdDeleteForever />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;
