import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux-state/AuthReducer/AuthActions";

const LoginPage = () => {
  /////

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  /////

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const userData = userCredential.user;
        dispatch(loginSuccess(userData));

        navigate("/");
      })
      .catch((error) => {
        setErrorMsg(`${error.message} User Not Found`);
      });
  };

  return (
    // <div>
    //   <form
    //     className="flex flex-col h-screen items-center justify-evenly"
    //     onSubmit={handleSubmit}
    //   >
    //     <div>
    //       {" "}
    //       <h1>LoginPage</h1>
    //     </div>
    //     <div>
    //       <input
    //         className="border-2 border-gray-500"
    //         type="email"
    //         placeholder="enter email"
    //         name="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>

    //     <div>
    //       <input
    //         className="border-2 border-gray-500"
    //         type="password"
    //         placeholder="enter password"
    //         name="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>

    //     <div>
    //       <button className="border-2 border-gray-500" type="submit">
    //         Submit
    //       </button>
    //     </div>
    //     <div className="error">{errorMsg}</div>
    //   </form>
    // </div>

    <div className="body  h-screen flex flex-col    md:grid md:grid-cols-2 md:h-screen md:items-center md:bg-gray-100">
      <div className="AppNameDescription flex-auto flex flex-col justify-center  md:py-10 md:pl-10 md:ml-20 ">
        <h1 className="  px-5 text-center text-6xl md:text-5xl font-bold md:text-start text-blue-600 md:py-5 ">
          CashBook
        </h1>
        <p className=" px-5 mt-6 text-center text-2xl md:text-start  md:mt-3  md:b-2">
          Create Your Account & Maintain Your Cash Book to Control Your Expenses
          With Our Expense & Income Ledgers.
        </p>
        <p className=" hidden md:flex   md:text-2xl md:text-start md:my-2 md:pl-5 ">
          FurtherMore, Watch Movies, Videos, Photos & Clips of Friends & Public.
        </p>
      </div>

      <div className="loginForm flex-auto  px-5  md:px-1  md:py-5 flex flex-col justify-start pt-2 md:bg-white md:rounded-2xl md:w-3/5 md:ml-14  ">
        <form onSubmit={handleSubmit}>
          <div className="inputs mb-5 mt-0 flex-auto flex flex-col p-1  md:w-full md:ml-12  md:mb-2">
            <input
              className=" md:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="email"
              placeholder="Email or Phone Number"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              className=" md:w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="false"
            />
          </div>
          <div className="button flex-auto flex flex-col p-1  md:w-full md:ml-12 ">
            <button
              type="submit"
              className="md:w-4/5 rounded-2xl p-3 placeholder-slate-500 text-white font-semibold mt-5 bg-blue-500 text-xl"
            >
              {/* {isFetching ? (
                <CircularProgress color="primary" size="25px" />
              ) : (
                "Login"
              )} */}{" "}
              Login
            </button>
          </div>
        </form>

        <div className="forgot md:flex-auto flex  px-5 text-red-600  md:ml-12  ">
          {errorMsg}
        </div>

        {/* <div className="button md:flex-auto flex flex-col items-center p-1  md:w-full  md:mt-2 md:mb-5">
          <Link to="/Register">
            <button className="md:w-full h-12 px-10 rounded-2xl md:p-6 flex items-center placeholder-slate-500 text-white font-semibold mt-4 bg-green-500 text-lg">
              Create New Account
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
