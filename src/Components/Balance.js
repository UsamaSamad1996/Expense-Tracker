import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, addIncome } from "../redux-state/AccountingActions";
import { useState } from "react";
import { HiCurrencyDollar } from "react-icons/hi";

const Balance = () => {
  /////////
  /////////

  const { incomeList, expenseList } = useSelector(
    (state) => state.AccountingReducer
  );

  const dispatch = useDispatch();

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const totalIncome = incomeList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const totalExpense = expenseList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const currentBalance = totalIncome - totalExpense;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === "Income") {
      dispatch(
        addIncome(
          {
            type: type,
            category: category,
            amount: amount,
            date: date,
            id: Math.round(Math.random() * 10000),
          },
          totalIncome
        )
      );
    } else if (type === "Expense") {
      dispatch(
        addExpense(
          {
            type: type,
            category: category,
            amount: amount,
            date: date,
            id: Math.round(Math.random() * 10000),
          },
          totalExpense
        )
      );
    }
    setType("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  ///////////////////////////////////////////////////////////////////////
  return (
    <div className="   bg-white w-screen md:w-[70%] lg:w-[70%] h-full xl:w-[30%] xl:h-[92%]  rounded-md my-0 flex flex-col xl:block">
      {/* div 1 Main Heading */}
      <div className="xl:my-2 mt-8 mb-1 text-center flex-auto text-slate-600">
        <h1 className="xl:text-4xl uppercase md:text-5xl text-4xl font-bold py-2 ">
          Expense Tracker
        </h1>
      </div>
      {/* div 2 Total Balance */}
      {currentBalance >= 0 ? (
        <div className=" mt-5 mb-2 xl:my-3 text-center flex-auto text-slate-600">
          <h2 className="text-2xl xl:text-3xl font-semibold py-2 flex justify-center items-center">
            Total Balance
            <HiCurrencyDollar className="text-green-500 text-5xl ml-3" />
            {Number(currentBalance).toLocaleString()}
          </h2>
        </div>
      ) : (
        <div className=" mt-5 mb-2 xl:my-3 text-center flex-auto text-slate-600">
          <h2 className=" text-2xl xl:text-3xl font-semibold py-2 flex justify-center items-center">
            Total Balance
            <HiCurrencyDollar className="text-red-500 text-5xl ml-3" />
            {Number(currentBalance).toLocaleString()}
          </h2>
        </div>
      )}
      <hr />
      <form
        className="flex flex-col xl:block flex-auto mb-10  "
        onSubmit={handleSubmit}
      >
        {/* Select Transaction Type */}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="border-2  border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1  hover:bg-slate-100  rounded-md"
        >
          <p className=" pl-1 text-gray-500  ">Type</p>
          <select
            className="text-xl pt-2 w-full hover:bg-slate-100 rounded-md focus:outline-none bg-white"
            name="type"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="none">Transaction Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Select Category */}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="border-2 border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1 hover:bg-slate-100 rounded-md"
        >
          <p className=" pl-1 text-gray-500">Category</p>
          <select
            required
            className="text-xl pt-2 w-full  hover:bg-slate-100 rounded-md focus:outline-none bg-white"
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {type === "Income" ? (
              // Income Categories
              <>
                <option>Category</option>
                <option value="Business">Business</option>
                <option value="Investments Profit">
                  Profit On Investments
                </option>
                <option value="Extra Income">Extra Income</option>
                <option value="Salary">Salary</option>
                <option value="Savings">Savings</option>
                <option value="Rental Income">Rental Income</option>
                <option value="Loan">Loan</option>
              </>
            ) : type === "Expense" ? (
              // Expenses Categories
              <>
                <option>Category</option>
                <option value="Utilities">Utilities</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Clothes">Clothes</option>
                <option value="Travelling">Travelling</option>
                <option value="Food">Food</option>
                <option value="House">House</option>
                <option value="Phone">Phone</option>
                <option value="Entertainment">Entertainment</option>
                <option value="R/M Others">Repair Maintinance Others</option>
                <option value="Miscellaneous Items">Miscellaneous Items</option>
              </>
            ) : (
              ""
            )}
          </select>
        </div>

        {/* Select Date input field */}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="border-2 border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1 hover:bg-slate-100 rounded-md"
        >
          <p className=" pl-1 text-gray-500">Date</p>
          <input
            className="text-xl pt-2 w-full  hover:bg-slate-100 rounded-md focus:outline-none bg-white"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Add Amount input field */}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="border-2 border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1 hover:bg-slate-100 rounded-md"
        >
          <p className=" pl-1 text-gray-500">Amount</p>
          <input
            className="text-xl pt-2 w-full  hover:bg-slate-100 rounded-md focus:outline-none"
            type="number"
            required
            placeholder="Add Amount "
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Button Create Entry  */}

        <div className="flex justify-center ">
          {" "}
          <div
            style={{
              boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
            }}
            className="buttons border-2 border-gray-400  mt-6 xl:mt-4 xl:mb-2 hover:bg-slate-200 rounded-md flex justify-center items-center xl:text-xl text-lg w-3/5 "
          >
            <button className="p-3 w-full" type="submit">
              CREATE TRANSACTION
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Balance;
