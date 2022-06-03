import React from 'react';
import "../styles/Modal.css";

function Modal(props) {
	return (props.trigger) ? (
		<div className='modal'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 className='modal-title'>{props.commonName}</h4>
				</div>
				<div className='modal-body'>{props.description}
				</div>
				<div className='modal-footer'>
					<button className='button' onClick={() => props.setTrigger(false)}>Close</button>
				</div>
			</div>
		</div>
	): "";
}

export default Modal;