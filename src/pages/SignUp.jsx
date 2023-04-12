import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Hello!</p>
        </header>

        <form className="signInForm" onSubmit={onSubmit}>
          <FormControl sx={{ m: 1, width: "320px" }} variant="standard">
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              value={name}
              type="name"
              className="nameInput"
              label="Name"
              onChange={onChange}
            />
          </FormControl>

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
          </FormControl>

          <FormControl sx={{ m: 1, width: "320px" }} variant="standard">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              value={password}
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={onChange}
            />
          </FormControl>

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <KeyboardArrowRightOutlinedIcon
                sx={{ width: "32px", height: "32px" }}
              />
            </button>
          </div>
        </form>

        <Link to="/profile" className="registerLink">
          Sign In
        </Link>
      </div>
    </>
  );
}
