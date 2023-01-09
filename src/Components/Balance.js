import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  addIncome,
} from "../redux-state/AccountingReducer/AccountingActions";
import { useEffect, useState } from "react";
import { HiCurrencyDollar } from "react-icons/hi";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { loggingOut } from "../redux-state/AuthReducer/AuthActions";
import { CircularProgress } from "@material-ui/core";

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
      date: date,
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
  /// here we get user expense collecton in form of array from firebase backend
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
    <div className=" bg-gradient-to-b from-blue-500 to-white  md:bg-gradient-to-b md:from-white md:to-white w-screen md:w-[70%] lg:w-[70%]  xl:w-[30%] h-full xl:rounded-md flex flex-col">
      <div className=" h-[13%] justify-center flex items-center  flex-wrap py-5 xl:py-0 ">
        <h1 className="capitalize px-5 pt-2 leading-snug text-5xl text-center font-bold text-white md:text-slate-600 xl:drop-shadow-none">
          {user.username}
        </h1>
      </div>
      {currentBalance ? (
        <div className="md:pt-5">
          {" "}
          {currentBalance >= 0 ? (
            <div className="h-[13%] flex justify-center items-center  pt-5 pb-3">
              <h2 className="text-2xl xl:text-3xl text-white  md:text-slate-600 font-semibold  flex justify-center items-center">
                Balance
                <HiCurrencyDollar className="text-green-600 bg-white rounded-full text-5xl ml-3 mr-1" />
                {Number(currentBalance).toLocaleString()}
              </h2>
            </div>
          ) : (
            <div className="h-[13%] flex justify-center items-center   py-5 ">
              <h2 className="text-2xl xl:text-3xl font-semibold text-white md:text-slate-600 flex justify-center items-center">
                Total Balance
                <HiCurrencyDollar className="text-red-600 bg-white rounded-full text-5xl ml-3 mr-1" />
                {Number(currentBalance).toLocaleString()}
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[13%] flex justify-center items-center   py-5 ">
          <h2 className="text-2xl xl:text-3xl font-semibold text-white md:text-slate-600 flex justify-center items-center">
            <CircularProgress size="50px" />
          </h2>
        </div>
      )}

      <div className=" h-[61%] flex flex-col py-5 ">
        {" "}
        <form className="h-full  " onSubmit={handleSubmit}>
          {/* Select Transaction Type */}
          <div
            style={{
              boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
            }}
            className="border-b-2 md:border-2 border-gray-400 flex flex-col justify-evenly p-1 h-[15%] mb-4 mt-3 mx-4 hover:bg-slate-100 rounded-md bg-white "
          >
            <label className=" px-2 text-gray-500 text-sm" htmlFor="type">
              Type
            </label>
            <select
              className="text-md px-1 w-full hover:bg-slate-100 rounded-md focus:outline-none mt-2 xl:mt-0 bg-white"
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
            className="border-b-2 md:border-2 border-gray-400 flex flex-col justify-evenly p-1 h-[15%] mb-4 mx-4 hover:bg-slate-100 rounded-md bg-white"
          >
            <label className=" px-2 text-gray-500 text-sm" htmlFor="category">
              Category
            </label>
            <select
              required
              className="text-md px-1 w-full  hover:bg-slate-100 rounded-md focus:outline-none mt-2 xl:mt-0 bg-white"
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
                  <option value="Miscellaneous Items">
                    Miscellaneous Items
                  </option>
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
            className="border-b-2 md:border-2 border-gray-400 flex flex-col justify-evenly p-1 h-[15%] mb-4 mx-4 hover:bg-slate-100 rounded-md bg-white"
          >
            <label className=" px-2 text-gray-500 text-sm" htmlFor="date">
              Date
            </label>
            <input
              className="text-md w-full px-1 hover:bg-slate-100 rounded-md focus:outline-none mt-2 xl:mt-0 bg-white"
              name="date"
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
            className="border-b-2 md:border-2 border-gray-400 flex flex-col justify-evenly   p-1 h-[15%] mb-4 mx-4 hover:bg-slate-100 rounded-md bg-white"
          >
            <label className=" px-2 text-gray-500 text-sm" htmlFor="amount">
              Amount
            </label>
            <input
              name="amount"
              className="text-md px-2 w-full  hover:bg-slate-100 rounded-md mt-2 xl:mt-0 focus:outline-none"
              type="number"
              required
              placeholder="Add Amount "
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Button Create Entry  */}

          <div className="flex  justify-center items-end h-[20%] pt-5 xl:py-0  ">
            {" "}
            <div
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className="buttons bg-blue-600 hover:bg-blue-500  rounded-md flex justify-center items-center text-xl w-4/5 md:w-3/5 xl:w-4/5 "
            >
              <button
                className="px-3 py-2 md:py-3 w-full text-white uppercase font-semibold"
                type="submit"
              >
                Create Transaction
              </button>
            </div>
          </div>
        </form>
      </div>
      <hr />
      <div className="flex justify-center items-center h-[13%] pb-8 pt-4">
        {" "}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="buttons bg-red-600   hover:bg-red-500 rounded-md flex justify-center items-center  text-xl w-3/5 "
        >
          <button
            className="px-3 py-2 md:py-3 w-full text-white font-semibold "
            onClick={logOut}
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
