import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { HiCurrencyDollar } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { handleDelete } from "../redux-state/AccountingReducer/AccountingActions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend);

const Income = () => {
  ///
  ///////////////////////////////////////////////////////////////////
  const { user: currentUser } = useSelector((state) => state.AuthReducer);

  const { incomeList } = useSelector((state) => state.AccountingReducer);

  useEffect(() => {
    if (incomeList.length !== 0) {
      (async () => {
        await setDoc(doc(db, "income", currentUser.uid), {
          income: incomeList,
        });
      })();
    }
  }, [currentUser.uid, incomeList]);

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

        // weight: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      },
    ],
  };

  const options = {
    cutout: "60%",
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10,

            weight: "normal",
          },
          color: "white",
          padding: 10,
        },
      },
    },
  };

  ///////////////////////////////////////////////////////////////

  return (
    <div className="bg-white rounded-md w-screen h-full md:w-[70%] lg:w-[70%]  xl:w-[32%] flex flex-col order-last xl:order-first md:bg-[#1A1B21] ">
      <div className="expense  flex justify-center bg-blue-400 md:bg-transparent items-center py-3 rounded-full ">
        <h2 className=" text-2xl xl:text-xl  text-white flex-auto justify-center font-semibold flex items-center">
          Total Income
          <HiCurrencyDollar className="text-green-600  bg-white rounded-full text-2xl  ml-3 mr-2" />
          {totalIncome.toLocaleString()}
        </h2>
      </div>
      <div className=" flex justify-center items-center h-[50%]  xl:h-[53%] py-3">
        <Doughnut data={data} options={options} />
      </div>
      <div className="array   rounded-md  flex flex-col justify-start h-[18rem] xl:h-[36%]  mx-3 mb-6 xl:mb-2 hover:overflow-y-scroll overflow-hidden scrollbar-none">
        {incomeList.map((item) => (
          <div
            key={item.id}
            className="flex  items-center   py-2 border-[1px] border-gray-400 my-1 md:mx-3 mx-1 rounded-md hover:bg-opacity-50 shadow-[8px_7px_6px_0px_#a69999ad] md:shadow-none md:bg-[#23252C] md:text-white"
          >
            <div className="dollar flex items-center justify-center w-[11%]">
              <HiCurrencyDollar className="text-green-600 text-2xl" />
            </div>
            <div className="dollarlogo text-sm md:text-sm whitespace-nowrap flex items-center justify-start w-[30%] truncate ">
              {item.category}
            </div>

            <div className="amount text-sm md:text-sm flex items-center justify-center w-[28%] ">
              {format(new Date(item.date), "dd-MM-yyyy")}
            </div>
            <div className="amount text-sm md:text-sm flex items-center justify-start  w-[20%]">
              $ {Number(item.amount).toLocaleString()}
            </div>

            <div className="deleteItem   flex items-center  w-[11%] justify-center">
              <button
                onClick={() => dispatch(handleDelete(item.id))}
                className="bg-blue-500 rounded-md p-[2px] text-white text-lg hover:bg-red-600"
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
