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
import { loginFailure } from "../redux-state/AuthReducer/AuthActions";

const Balance = () => {
  /////////
  /////////
  const { user: currentUser } = useSelector((state) => state.AuthReducer);

  const { incomeList, expenseList } = useSelector(
    (state) => state.AccountingReducer
  );

  const dispatch = useDispatch();

  // const [userIncome, setUserIncome] = useState([]);
  const [user, setUser] = useState({});

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// this is to get complete collection of users or anything
  /// or to get all docs present in a collection
  // useEffect(() => {
  //   (async () => {
  //     const users = await getDocs(collection(db, "users"));
  //     const usersArr = [];
  //     users.forEach((user) => {
  //       usersArr.push({ ...user.data(), id: user.id });
  //     });
  //     setAllUsers(usersArr);
  //   })();
  // }, []);
  // console.log(allUsers);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// this is to get single doc or user from a specific collection
  ///fetching collection of user income
  // useEffect(() => {
  //   (async () => {
  //     const currentUserIncomeCollection = doc(db, "income", currentUser.uid);
  //     const currentUserIncomeArray = await getDoc(currentUserIncomeCollection);
  //     setUserIncome(currentUserIncomeArray.data());
  //   })();
  // }, [currentUser.uid]);

  // console.log(userIncome);

  // useEffect(() => {
  //   (async () => {
  //     const currentUserCredentials = doc(db, "users", currentUser.uid);
  //     const currentUserCredentialsData = await getDoc(currentUserCredentials);
  //     setUser(currentUserCredentialsData.data());
  //   })();
  // }, [currentUser.uid]);

  //this is realtime
  useEffect(() => {
    onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      const data = doc.data();
      setUser(data);
    });
  }, [currentUser.uid, dispatch]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionObject = {
      type: type,
      category: category,
      amount: amount,
      date: date,
      id: Math.round(Math.random() * 10000),
    };

    if (type === "Income") {
      (async () => {
        await setDoc(doc(db, "income", currentUser.uid), {
          income: [...(incomeList || []), transactionObject],
        });
      })();
    } else if (type === "Expense") {
      (async () => {
        await setDoc(doc(db, "expense", currentUser.uid), {
          expense: [...(expenseList || []), transactionObject],
        });
      })();
    }
    setType("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// Real Time DataBase Fetching
  useEffect(() => {
    onSnapshot(doc(db, "income", currentUser.uid), (doc) => {
      const data = doc.data();
      dispatch(addIncome(data.income));
      // console.log(data.income.map((item) => item.amount));
    });
  }, [currentUser.uid, dispatch]);

  useEffect(() => {
    onSnapshot(doc(db, "expense", currentUser.uid), (doc) => {
      const data = doc.data();
      dispatch(addExpense(data.expense));
      // console.log(data.income.map((item) => item.amount));
    });
  }, [currentUser.uid, dispatch]);

  const totalIncome = incomeList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const totalExpense = expenseList
    .map((item) => Number(item.amount))
    .reduce((acc, current) => acc + current, 0);

  const currentBalance = totalIncome - totalExpense;

  ///////////////////////////////////////////////////////////////////////
  const logOut = () => {
    signOut(auth)
      .then((user) => {
        dispatch(loginFailure(user));
        // localStorage.removeItem("user", JSON.stringify(null));
        localStorage.clear();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  ///////////////////////////////////////////////////////////////////////

  return (
    <div className="   bg-white w-screen md:w-[70%] lg:w-[70%] h-screen xl:w-[30%] xl:h-[100%]  rounded-md my-0 flex flex-col xl:block">
      {/* div 1 Main Heading */}
      {/* {allUsers.map((user) =>
        user.id === currentUser.uid ? (
          <div
            key={user.id}
            className="xl:my-2 mt-8 mb-1 text-center flex-auto text-slate-600"
          >
            <h1 className="xl:text-4xl uppercase md:text-5xl text-4xl font-bold py-2 ">
              {user.username}
            </h1>
          </div>
        ) : (
          ""
        )
      )} */}
      <div className="xl:my-2 mt-8 mb-1 text-center flex-auto text-slate-600">
        <h1 className="xl:text-4xl uppercase md:text-5xl text-4xl font-bold py-2 ">
          {user.username}
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
        className="flex flex-col xl:block flex-auto   "
        onSubmit={handleSubmit}
      >
        {/* Select Transaction Type */}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="border-2  border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1  hover:bg-slate-100  rounded-md"
        >
          <label className=" pl-1 text-gray-500 " htmlFor="type">
            Type
          </label>
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
          <label className=" pl-1 text-gray-500" htmlFor="category">
            Category
          </label>
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
          <label className=" pl-1 text-gray-500" htmlFor="date">
            Date
          </label>
          <input
            className="text-xl pt-2 w-full  hover:bg-slate-100 rounded-md focus:outline-none bg-white"
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
          className="border-2 border-gray-400 mx-5 xl:my-6 my-4 p-2 xl:p-1 hover:bg-slate-100 rounded-md"
        >
          <label className=" pl-1 text-gray-500" htmlFor="amount">
            Amount
          </label>
          <input
            name="amount"
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

      <div className="flex justify-center ">
        {" "}
        <div
          style={{
            boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
          }}
          className="buttons border-2 border-gray-400  mt-6 xl:mt-4 xl:mb-2 hover:bg-slate-200 rounded-md flex justify-center items-center xl:text-xl text-lg w-3/5 "
        >
          <button className="p-3 w-full" onClick={logOut}>
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
