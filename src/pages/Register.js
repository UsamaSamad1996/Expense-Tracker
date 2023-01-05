import { React, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const Register = () => {
  //// Declarations

  const history = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
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
          // income: [{}],
        });
      } catch (error) {
        console.log(error);
      }
      history("/login");
    } else {
      setPasswordError("Password Don't Match");
    }
  };

  /// Return

  return (
    <div className="body grid grid-cols-2 h-screen items-center bg-gray-100">
      {/* Left Column of App Title & Description */}
      <div className="AppNameDescription py-10 pl-10 ml-20 ">
        <h1 className="text-5xl font-bold text-start text-blue-600 py-5 ">
          CashBook
        </h1>
        <p className="text-2xl text-start  mt-3  b-2">
          Create Your Account & Maintain Your Cash Book to Control Your Expenses
          With Our Expense & Income Ledgers.
        </p>
        <p className="text-2xl text-start my-2">
          FurtherMore, Watch Movies, Videos, Photos & Clips of Friends & Public.
        </p>
      </div>

      {/* Right Column Of Registration Form */}
      <div className="  py-5 flex flex-col bg-white rounded-2xl w-3/5 ml-14">
        {/* Div Of Register Form */}
        <form onSubmit={handleSubmit}>
          {/* this is 1st Div of 4 input fields */}
          <div className="inputs flex-auto flex flex-col p-1  w-full ml-12  mb-2">
            {/* 1st Input of UserName */}
            <input
              className=" w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="name"
              placeholder="UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            {/* 1st Input of Email */}
            <input
              className=" w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="email"
              placeholder="Email or Phone Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            {/* 1st Input of CreatePassword */}
            <input
              className=" w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <br />
            {/* 1st Input of ConfirmPassword */}
            <input
              className=" w-4/5 rounded-2xl p-3 placeholder-slate-500 border-2  border-slate-500 text-xl"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p className="text-red-600 text-sm">{passwordError}</p>
          </div>

          {/* this is 2nd Div of Sign Up Button */}
          <div className="button flex-auto flex flex-col p-1  w-full ml-12 ">
            <button
              type="submit"
              className="w-4/5 rounded-2xl p-3 placeholder-slate-500 text-white font-semibold mt-5 bg-blue-500 text-xl"
            >
              Sign Up
            </button>
          </div>
        </form>

        <hr />

        {/* Div of Login Button */}
        <div className="button flex-auto flex flex-col p-1  w-full ml-24 mt-2 mb-5">
          <Link to="/login">
            <button className="w-3/5 rounded-2xl p-3 placeholder-slate-500 text-white font-semibold mt-4 bg-green-500 text-lg">
              Log Into Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
