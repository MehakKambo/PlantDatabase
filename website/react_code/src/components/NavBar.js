import React, { useState } from "react";
import Logo from "../assets/plant_logo.png";
import { Link } from "react-router-dom";
import "../styles/NavBar.css"

function Navbar() {
  return (
    <div className="navbar">
      <div className="leftSide"> 
        <img src={Logo} />
      </div>
      <div className="rightSide">
        <Link to="/PlantDatabase"> Home </Link>
      </div>
    </div>
  );
}

export default Navbar;