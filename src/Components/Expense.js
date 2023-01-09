import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { handleDelete } from "../redux-state/AccountingReducer/AccountingActions";
import { useDispatch } from "react-redux";
import { HiCurrencyDollar } from "react-icons/hi";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(ArcElement, Tooltip, Legend);

/////////////////////////////////////////////////////////////////////////////////////////////////////

const Expense = () => {
  ////
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  const { user: currentUser } = useSelector((state) => state.AuthReducer);

  const { expenseList } = useSelector((state) => state.AccountingReducer);
  const dispatch = useDispatch();

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  // here we updating expenseList Array After Deleting
  useEffect(() => {
    if (expenseList.length !== 0) {
      (async () => {
        await setDoc(doc(db, "expense", currentUser.uid), {
          expense: expenseList,
        });
      })();
    }
  }, [expenseList, currentUser.uid]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const consolidator = (arg) => {
    const newArr = [];
    const mainArr = JSON.parse(JSON.stringify(arg));

    mainArr.forEach((arrItem) => {
      const i = newArr.findIndex((item) => item.category === arrItem.category);

      if (i === -1) {
        newArr.push(arrItem);
      } else {
        newArr[i].amount = Number(newArr[i].amount) + Number(arrItem.amount);
      }
    });
    return newArr;
  };

  const expenseItems = consolidator(expenseList);

  const totalExpenseAmounts = expenseItems.map((item) => Number(item.amount));

  const totalExpense = totalExpenseAmounts.reduce(
    (acc, current) => acc + current,
    0
  );

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const data = {
    labels: expenseItems.map((item) => item.category),
    datasets: [
      {
        label: "$",
        data: expenseItems.map((item) => item.amount),
        backgroundColor: [
          "rgba(75, 192, 192, 10)",
          "rgba(255, 159, 64, 10)",
          "rgba(455, 200, 150, 10)",
          "rgba(255, 99, 132, 10)",
          "rgba(54, 162, 235, 10)",
          "rgba(255, 206, 86, 10)",
          "rgba(153, 102, 255, 10)",
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="bg-white rounded-md w-screen h-full md:w-[70%] lg:w-[70%]  xl:w-[32%]  my-10 xl:my-0 flex flex-col ">
      <div className="expense  xl:h-[10%] flex justify-center items-center py-3 bg-blue-400 md:bg-white rounded-full xl:py-0">
        <h2 className=" text-2xl xl:text-3xl md:text-slate-600 text-white bg-blue-400 md:bg-white flex-auto  font-semibold flex items-center justify-center">
          Total Expense
          <HiCurrencyDollar className="text-red-600  bg-white rounded-full text-5xl  ml-3 mr-1" />
          {totalExpense.toLocaleString()}
        </h2>
      </div>
      <hr />
      <div className=" flex justify-center items-center h-[50%]  xl:h-[50%] py-4">
        <Doughnut data={data} />
      </div>
      <div className="array   rounded-md  flex flex-col justify-start h-[18rem] xl:h-[40%]  mx-3 mb-4 xl:mb-2 scrollbar-none hover:overflow-y-scroll overflow-hidden ">
        {expenseList.map((item) => (
          <div
            style={{
              boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
            }}
            key={item.id}
            className="flex  items-center   py-2 border-2 border-gray-400 my-2 md:mx-3 mx-1 rounded-md hover:bg-slate-100"
          >
            <div className="dollar flex items-center justify-center w-[11%]">
              {" "}
              <HiCurrencyDollar className="text-red-600 text-4xl" />
            </div>
            <div className="dollarlogo text-sm xl:text-lg md:text-lg whitespace-nowrap flex items-center justify-start w-[30%] truncate">
              {item.category}
            </div>

            <div className="amount text-sm xl:text-base md:text-lg flex items-center justify-center w-[28%] ">
              {item.date}
            </div>
            <div className="amount text-sm xl:text-base md:text-lg flex items-center justify-start  w-[20%]">
              $ {Number(item.amount).toLocaleString()}
            </div>

            <div className="deleteItem   flex items-center  w-[11%] justify-center">
              <button
                onClick={() => dispatch(handleDelete(item.id))}
                className="bg-blue-500 rounded-md p-[2px] text-white text-2xl hover:bg-red-600"
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

export default Expense;
