import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  addIncome,
} from "../redux-state/AccountingReducer/AccountingActions";
import { useEffect, useState } from "react";
import { HiCurrencyDollar } from "react-icons/hi";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
// import { collection, query, where } from "firebase/firestore";

import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { loggingOut } from "../redux-state/AuthReducer/AuthActions";
import { CircularProgress } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Balance = () => {
  /////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /// State Declarations

  const { user: currentUser } = useSelector((state) => state.AuthReducer);

  const { incomeList, expenseList } = useSelector(
    (state) => state.AccountingReducer
  );

  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  console.log({ date });

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /// here we get user information stored when user created
  useEffect(() => {
    onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      const data = doc.data();
      setUser(data);
    });
  }, [currentUser.uid, dispatch]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /// here we create user transactions and update user collections on firebase
  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionObject = {
      type: type,
      category: category,
      amount: amount,
      date: String(date),
      id: Math.round(Math.random() * 10000),
    };

    if (category === "") {
      alert("Please Select Category");
    } else {
      if (amount < 1) {
        alert("Invalid Amount! Amount must be Greater than Zero");
      } else {
        if (type === "Income") {
          (async () => {
            await setDoc(doc(db, "income", currentUser.uid), {
              income: [...(incomeList || []), transactionObject],
            });
          })();
          setType("");
          setAmount("");
          setCategory("");
          setDate("");
        } else if (type === "Expense") {
          (async () => {
            await setDoc(doc(db, "expense", currentUser.uid), {
              expense: [...(expenseList || []), transactionObject],
            });
          })();
          setType("");
          setAmount("");
          setCategory("");
          setDate("");
        }
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /// Real Time DataBase Fetching
  /// here we get user income collecton in form of array from firebase backend
  useEffect(() => {
    onSnapshot(doc(db, "income", currentUser.uid), (doc) => {
      const data = doc.data();
      dispatch(addIncome(data.income));
    });
  }, [currentUser.uid, dispatch]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  /// Real Time DataBase Fetching
  /// here we get user expense collecton in form of array from firebase backend & updating state in reducer
  useEffect(() => {
    onSnapshot(doc(db, "expense", currentUser.uid), (doc) => {
      const data = doc.data();
      dispatch(addExpense(data.expense));
    });
  }, [currentUser.uid, dispatch]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///here we are calculating user Current Account Balance
  const totalIncome = incomeList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const totalExpense = expenseList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const currentBalance = totalIncome - totalExpense;

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const logOut = () => {
    signOut(auth)
      .then((user) => {
        dispatch(loggingOut(user));
        localStorage.removeItem("user");
      })
      .catch((error) => {});
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className=" bg-gradient-to-b from-blue-500 to-white  md:bg-gradient-to-b md:from-[#1A1B21] md:to-[#1A1B21] w-screen md:w-[70%] lg:w-[70%]  xl:w-[30%] h-full xl:rounded-md flex flex-col">
      <div className=" justify-center flex items-center  flex-wrap py-5 xl:py-0 ">
        <h1 className="capitalize px-5 pt-5 tracking-wide text-2xl text-center font-semibold text-white  xl:drop-shadow-none">
          {user.username}
        </h1>
      </div>
      {currentBalance ? (
        <div className=" flex justify-center items-end ">
          <h2 className="text-2xl xl:text-xl text-white  pt-5 font-semibold  flex justify-center items-center">
            Balance
            <HiCurrencyDollar
              className={`${
                currentBalance >= 0 ? "text-green-600" : "text-red-600"
              }   bg-white rounded-full text-2xl ml-3 mr-2`}
            />
            {Number(currentBalance).toLocaleString()}
          </h2>
        </div>
      ) : (
        <div className="h-[10%] flex justify-center items-center   py-5 ">
          <h2 className="text-2xl xl:text-3xl font-semibold text-white  flex justify-center items-center">
            <CircularProgress size="50px" />
          </h2>
        </div>
      )}
      <form className="flex flex-col py-3  " onSubmit={handleSubmit}>
        {/* Select Transaction Type */}
        <div className="border-b-2 md:border-0 border-gray-400 flex flex-col justify-evenly p-[6px]  mb-4 mt-3 mx-4  rounded-md md:bg-[#23252C] bg-white md:text-white ">
          <label
            className=" px-2 text-gray-500 md:text-white text-[11px] "
            htmlFor="type"
          >
            Type
          </label>
          <select
            className="text-md w-full px-1  rounded-md focus:outline-none mt-2 xl:mt-2 md:bg-[#23252C] bg-white md:text-white"
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
        <div className="border-b-2 md:border-0 border-gray-400 flex flex-col justify-evenly p-[6px]  mb-4 mx-4  rounded-md md:bg-[#23252C] bg-white md:text-white">
          <label
            className=" px-2 text-gray-500 md:text-white text-[11px] "
            htmlFor="category"
          >
            Category
          </label>
          <select
            required
            className="text-md w-full px-1  rounded-md focus:outline-none mt-2 xl:mt-2 md:bg-[#23252C] bg-white md:text-white"
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
        <div className="border-b-2 md:border-0 border-gray-400 flex flex-col justify-evenly p-[6px]  mb-4 mx-4  rounded-md md:bg-[#23252C] bg-white md:text-white">
          <label
            className=" px-2 text-gray-500 md:text-white text-[11px] "
            htmlFor="date"
          >
            Date
          </label>
          <DatePicker
            className="text-md w-full px-2  rounded-md focus:outline-none mt-2 xl:mt-2 md:bg-[#23252C] bg-white md:text-white placeholder:text-sm placeholder:pl-0"
            selected={date}
            onChange={(e) => setDate(e)}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Date"
          />
        </div>

        {/* Add Amount input field */}
        <div className="border-b-2 md:border-0 border-gray-400 flex flex-col justify-evenly p-[6px]  mb-4 mx-4  rounded-md md:bg-[#23252C] bg-white md:text-white">
          <label
            className=" px-2 text-gray-500 md:text-white text-[11px] "
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            name="amount"
            className="text-md w-full px-2  rounded-md focus:outline-none mt-2 xl:mt-2 md:bg-[#23252C] bg-white md:text-white placeholder:text-sm placeholder:pl-0"
            type="number"
            required
            placeholder="Add Amount "
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Button Create Entry  */}

        <div className="buttons w-full  p-2  flex justify-center items-center  ">
          <button
            className="px-16 py-2 md:py-1 bg-blue-600 hover:bg-blue-500 rounded-sm  text-white  font-semibold"
            type="submit"
          >
            Create Transaction
          </button>
        </div>
      </form>
      <div className="buttons  flex justify-center items-center pb-2 ">
        <button
          className="px-14 py-2 md:py-1 text-white font-semibold bg-red-600  rounded-sm  hover:bg-red-500 "
          onClick={logOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Balance;
