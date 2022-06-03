import React, { useEffect, useState } from "react";
import "../styles/Home.css"
import Modal from "./Modal";
import ApiFetchData from "./ApiFetchData";


export function Component(props) {
  return <div> {props.data} {props.whatever} </div>
}

export function PlantData(){
  const [plantInfo, setPlantInfo] = useState(null);

  useEffect(() => {
    new fetch('https://plantdb.azurewebsites.net/plants')
      .then(res => res.json())
      .then(data => {
        setPlantInfo([{
          commonName: data.plants.commonName,
          region: data.plants.region,
          scientificname: data.plants.scientificname
        }])
      })
  })


}


export default function Home() {
  const [modalButton, setShowModal] = useState(false);

  return (
    <div className="home">
      <div className="headerContainer">
        <h1> Plant Database </h1>
        <ApiFetchData />
      </div>

    <div className="plantTable"> 
      <table>
        <tr>
          <th>Plant Name</th>
        </tr>
        <tr>
          <td>
            <Modal trigger={modalButton} setTrigger={setShowModal}></Modal>
            <button onClick={() => setShowModal(true)}>China Pink</button>
          </td>
        </tr>
      </table>
    </div>

    </div>
  );
}



