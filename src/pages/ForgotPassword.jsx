import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { FormControl, InputLabel, Input } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for a password reset link.");
    } catch (error) {
      toast.error("Could not send password reset link.");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form className="signInForm" onSubmit={onSubmit}>
          <FormControl sx={{ m: 1, width: "320px" }} variant="standard">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              value={email}
              type="email"
              className="emailInput"
              label="Email"
              onChange={onChange}
            />
            <Link className="forgotPasswordLink" to="/sign-in">
              Sign In
            </Link>

            <div className="signInBar">
              <div className="signInText">Send Reset Link</div>
              <button className="signInBtn">
                <KeyboardArrowRightIcon
                  color="#ffffff"
                  sx={{ width: "32px", height: "32px" }}
                />
              </button>
            </div>
          </FormControl>
        </form>
      </main>
    </div>
  );
}
