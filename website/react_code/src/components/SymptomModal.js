import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';



export default function SymptomModal(props){
    const [symptomInfo, setSymptomInfo] = useState(null);
		const [handlingInfo, setHandlingInfo] = useState(null);

    useEffect(() => {
        if ((props.scientificName || props.name) != null) {
            fetch(`https://plantdb.azurewebsites.net/plants/${props.scientificName}/illness/${props.name}/symptoms`)
            .then(res => res.json())
            .then(data => {
							setSymptomInfo(data.symptoms)
						})
        }
    }, [props.scientificName, props.name])


		useEffect(() => {
			if ((props.name) != null) {
					fetch(`https://plantdb.azurewebsites.net/plants/${props.scientificName}/illness/${props.name}/handlingprotocol`)
					.then(res => res.json())
					.then(data => {
						setHandlingInfo(data)
					})
					.catch(() => setHandlingInfo({
						handlingProtocol: {
							info: "(No handling protocols)",
							protocolNumber: "",
						},
					}))
			}
	}, [props.scientificName, props.name])


	if (!props.open) return null;
	if ((symptomInfo) == null) {
		return <div>Loading...</div>
	}

	if ((handlingInfo) == null) {
		return <div>Loading Handling Info...</div>
	}

	if (symptomInfo.length === 0) {
		return <div>(No symptoms)</div>
	}

    return (
        <div>
					<p>{symptomInfo.map(sym => (
							<li key={sym.symptomNumber}>
								Symptom Name: {sym.name}
								<br></br>
								Description: {sym.description}
								<p>Handling Protocol: {handlingInfo.handlingProtocol.info}</p>
								
							</li>
						))} </p>
						
				</div>
    );
	}