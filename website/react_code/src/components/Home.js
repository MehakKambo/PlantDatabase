import React from "react";
import "../styles/Home.css"

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1> Plant Database </h1>
      </div>

    <div className="plantTable"> 
      <table>
        <tr>
          <th>Common Plant Name</th>
        </tr>
        <tr>
          <td>Camellia sinensis</td>
        </tr>
      </table>
    </div>

    </div>
  );
}

export default Home;
