import { useEffect, useState } from 'react';
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
					<h4 className='modal-title'>{plantInfo.scientificName}</h4>
				</div>
				<div className='modal-body'>{plantInfo.commonName}
				</div>
				<div className='modal-footer'>
					<button className='button' onClick={() => props.setTrigger(false)}>Close</button>
				</div>
			</div>
		</div>
	): "";
}

export default Modal;