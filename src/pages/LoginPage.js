import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux-state/AuthReducer/AuthActions";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

const LoginPage = () => {
  /////

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  /////

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsFetching(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userData = userCredential.user;
        dispatch(loginSuccess(userData));
        setIsFetching(false);
        navigate("/");
      })
      .catch((error) => {
        setErrorMsg(` Invalid email OR password`);
        setIsFetching(false);
      });
  };

  return (
    <div className="body  h-screen flex flex-col  md:items-center  xl:grid xl:grid-cols-2 xl:h-screen xl:items-center  bg-gradient-to-b from-blue-500 to-white  md:from-[#23252C] md:to-[#23252C]">
      <div className="AppNameDescription flex-auto flex flex-col justify-center  xl:py-10 xl:pl-10 xl:ml-20 md:w-[70%] ">
        <h1
          style={{ textShadow: "2px 5px 4px red" }}
          className="  px-5 text-center text-5xl  font-bold xl:text-start text-white xl:py-5 "
        >
          aaSaaN CashBook
        </h1>
        <p className=" px-5 mt-6 text-center text-xl  md:text-lg xl:text-start text-white xl:mt-3  xl:b-2">
          Create your account & maintain your cash book to control your Daily
          Expenses & to keep track of your Income With{" "}
          <span>aaSaaN CashBook</span>
        </p>
        <p className=" hidden xl:flex  text-white xl:text-lg xl:text-start xl:my-2 xl:pl-5 ">
          We Provide you with easy Accounts Cash Book, Income & Expense Ledgers.
        </p>
      </div>

      <div className="loginForm flex-auto  px-5  xl:px-1  xl:py-10 flex flex-col  justify-start  xl:bg-[#1A1B21] xl:rounded-2xl xl:w-[65%] xl:ml-14 md:w-[70%] ">
        <form onSubmit={handleSubmit}>
          <div className="inputs mb-5 mt-0 flex-auto flex flex-col p-1  xl:w-full xl:ml-12  xl:mb-2">
            <input
              className=" xl:w-4/5 rounded-md p-[6px] placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-base"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              className=" xl:w-4/5 rounded-md p-[6px] placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-base"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="false"
            />
            <p className="text-red-600 pl-1 pt-1 text-sm h-5"> {errorMsg}</p>
          </div>
          {/* <div className="forgot flex-auto flex text-xl   text-red-600  xl:ml-14 pl-5  ">
            {errorMsg}
          </div> */}
          <div className="button flex-auto flex flex-col p-1  xl:w-full xl:ml-12 mb-8">
            <button
              type="submit"
              className="xl:w-4/5 rounded-md p-[7px]  placeholder-slate-500 text-white font-semibold mt-5 bg-blue-600 hover:bg-blue-500 text-base"
            >
              {isFetching ? (
                <CircularProgress color="white" size="25px" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* <div className="forgot xl:flex-auto flex flex-col p-1  xl:w-full xl:ml-12  ">
          <button  className="xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 text-blue-600 font-semibold mt-3 bg-white text-xl">
            Forgot Account?
          </button>
        </div> */}

        <div className="button xl:flex-auto flex flex-col items-center p-1  xl:w-full  xl:mt-2 xl:mb-5 border-t-[1px] border-[#23252C] ">
          <Link to="/register">
            <button className="xl:w-full  px-10 rounded-md xl:py-2 flex items-center text-white font-semibold mt-4 bg-red-600 hover:bg-red-500 text-base">
              Create New Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
