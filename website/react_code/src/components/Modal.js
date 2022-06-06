import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../styles/Modal.css";

function Modal(props) {
	const [plantInfo, setPlantInfo] = useState([]);

	

	useEffect(() => {
		if (props.scientificName != null) {
			fetch(`https://plantdb.azurewebsites.net/plants/${props.scientificName}`)
			.then(res => res.json())
			.then(setPlantInfo)
		}
	}, [props.scientificName])

	return (props.trigger) ? (
		<div className='modal'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 className='modal-title'>{plantInfo.commonName}</h4>
				</div>
				<div className='modal-body'>Scientific Name: {plantInfo.scientificName}
					<p>
						Region(s): {plantInfo.regionName} ({plantInfo.regionAbbr})
					</p>
					<p>
						Climate(s): {plantInfo.climates != null ? plantInfo.climates.reduce((agg, next) => `${agg} ${next}`, "") : "" }
					</p>
					<p>
						Past Research: {plantInfo.research != null ? plantInfo.research.reduce((agg, next) => `${agg} ${next}`, "") : "" }
					</p>
					<p>
						<Link to={`/PlantDatabase/${plantInfo.scientificName}/illness/`} className='btn btn-primary'>Illnesses</Link>
					</p>
					<div style={{ textAlign: "right" }}>
						<button onClick={() => props.openModifyForm(plantInfo)}>Edit</button>
					</div>
				</div>
				<div className='modal-footer'>
					<button className='button' onClick={() => props.setTrigger(false)}>Close</button>
				</div>
			</div>
		</div>
	): "";
}

export default Modal;

