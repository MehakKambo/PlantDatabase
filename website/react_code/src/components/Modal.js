import React from 'react'

const Modal = props => {
	return (
		<div className='modal'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h4 className='modal-title'>Modal Title</h4>
				</div>
				<div className='modal-body'>Modal content
				</div>
				<div className='modal-footer'>
					<button className='button'>Close</button>
				</div>
			</div>
		</div>
	);
}

export default Modal;