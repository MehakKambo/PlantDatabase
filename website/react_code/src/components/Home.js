import React from "react";
import "../styles/Home.css"

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        //Try to find a way to wrap to the top of the page 
        <h1> Plant Database </h1>
      </div>

    <div className="plantTable"> 
      <table>
        <tr>
          <th>Scientific Name</th>
          <th>Common Name</th>
          <th>Region</th>
          <th>Climates</th>
        </tr>
        <tr>
          <td>Camellia sinensis</td>
          <td>Tea plant</td>
          <td>Southeast China</td>
          <td>Climates</td>
        </tr>
      </table>
    </div>

    </div>
  );
}

export default Home;
