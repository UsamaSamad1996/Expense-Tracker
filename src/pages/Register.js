import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { CircularProgress } from "@material-ui/core";

const Register = () => {
  //// Declarations

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setIsFetching(true);
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", response.user.uid), {
          username: username,
          email: email,
          password: password,
          timestamp: serverTimestamp(),
        });
        setIsFetching(false);
      } catch (error) {
        // error.message;
      }
      navigate("/login");
    } else {
      setPasswordError("Password Don't Match");
    }
  };

  return (
    <div className="body  h-screen flex flex-col  md:items-center  xl:grid xl:grid-cols-2 xl:h-screen xl:items-center  bg-gradient-to-b from-blue-500 to-white">
      <div className="AppNameDescription flex-auto flex flex-col justify-center  xl:py-10 xl:pl-10 xl:ml-20 md:w-[70%] ">
        <h1
          style={{ textShadow: "2px 5px 4px red" }}
          className="  px-5 text-center text-6xl  font-bold xl:text-start text-white xl:py-5 "
        >
          aaSaaN CashBook
        </h1>
        <p className=" px-5 mt-6 text-center text-2xl xl:text-start text-white xl:mt-3 hidden xl:block xl:b-2">
          Create your account & maintain your cash book to control your Daily
          Expenses & to keep track of your Income With{" "}
          <span>aaSaaN CashBook</span>
        </p>
        <p className=" hidden xl:flex  text-white xl:text-2xl xl:text-start xl:my-2 xl:pl-5 ">
          We Provide you with easy Accounts Cash Book, Income & Expense Ledgers.
        </p>
      </div>

      <div className="loginForm flex-auto  px-5  xl:px-1  xl:py-5 flex flex-col  justify-start pt-2 xl:bg-white xl:rounded-2xl xl:w-3/5 xl:ml-14 md:w-[70%] ">
        <form onSubmit={handleSubmit}>
          <div className="inputs mb-5 mt-0 flex-auto flex flex-col p-1  xl:w-full xl:ml-12  xl:mb-2">
            <input
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className=" xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-xl"
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className=" xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-xl"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className=" xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-xl"
              type="password"
              placeholder="Create New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="false"
            />
            <br />
            <input
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className=" xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-b-2 xl:border-2 focus:outline-none border-slate-500 text-xl"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-red-600 text-sm">{passwordError}</p>
            <br />
          </div>

          <div className="button flex-auto flex flex-col p-1  xl:w-full xl:ml-12 mb-8">
            <button
              type="submit"
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className="xl:w-4/5 rounded-2xl p-3 placeholder-slate-500 text-white font-semibold mt-5 bg-blue-600 hover:bg-blue-500 text-xl"
            >
              {isFetching ? (
                <CircularProgress color="white" size="25px" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <hr />

        <div className="button xl:flex-auto flex flex-col items-center p-1  xl:w-full  xl:mt-2 xl:mb-5">
          <Link to="/login">
            <button
              style={{
                boxShadow: "8px 7px 6px 0px rgba(166,153,153,0.68)",
              }}
              className="xl:w-full h-12 px-20 rounded-2xl xl:py-6 flex items-center text-white font-semibold mt-4 bg-red-600 hover:bg-red-500 text-xl"
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
