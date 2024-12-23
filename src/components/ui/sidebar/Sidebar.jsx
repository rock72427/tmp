import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { icons } from "../../../constants";
import { useAuthStore } from "../../../../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isDashboard ? "dashboard" : ""}`}>
      <NavLink to="/dashboard" activeclassname="active">
        <img src={icons.Home} alt="home" />
        <span className="label">Guest House</span>
      </NavLink>
      <NavLink to="/newDonation" activeclassname="active">
        <img src={icons.Donation} alt="donation" />
        <span className="label" style={{ paddingTop: "5px" }}>
          Donations
        </span>
      </NavLink>
      <NavLink to="/deeksha" activeclassname="active">
        <img src={icons.Deeksha} alt="welcome" />
        <span className="label">Deeksha</span>
      </NavLink>
      <NavLink to="/coupons" activeclassname="active">
        <img src={icons.Frame} alt="welcome" />
        <span className="label">Meals</span>
      </NavLink>
      <NavLink className="settings" onClick={handleLogout}>
        <img src={icons.settings} alt="settings" />
        <span className="label">Settings</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
