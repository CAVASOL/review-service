import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreOutlinedIcon
              color={pathMatchRoute("/") ? "#2c2c2c" : "disabled"}
              sx={{ width: "32px", height: "32px" }}
            />
            <p
              className={
                pathMatchRoute("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/about-us")}>
            <BusinessIcon
              color={pathMatchRoute("/about-us") ? "#2c2c2c" : "disabled"}
              sx={{ width: "32px", height: "32px" }}
            />
            <p
              className={
                pathMatchRoute("/about-us")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              About Us
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutlineOutlinedIcon
              color={
                pathMatchRoute("/sign-in" && "/profile")
                  ? "#2c2c2c"
                  : "disabled"
              }
              sx={{ width: "32px", height: "32px" }}
            />
            <p
              className={
                pathMatchRoute("/sign-in" && "/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
