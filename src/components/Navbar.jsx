import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
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
          <li className="navbarListItem" onClick={() => navigate("/recents")}>
            <HistoryOutlinedIcon
              color={pathMatchRoute("/recents") ? "#2c2c2c" : "disabled"}
              sx={{ width: "32px", height: "32px" }}
            />
            <p
              className={
                pathMatchRoute("/recents")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Resent
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
