import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';



export default function SymptomModal(props){
    const [symptomInfo, setSymptomInfo] = useState(null);

    useEffect(() => {
        if ((props.scientificName || props.name) != null) {
            fetch(`https://plantdb.azurewebsites.net/plants/${props.scientificName}/illness/${props.name}/symptoms`)
            .then(res => res.json())
            .then(data => {
							setSymptomInfo(data.symptoms)
						})
        }
    }, [props.scientificName, props.name])

		if (!props.open) return null;
		if ((symptomInfo) == null) {
			return <div>Loading...</div>
		}

    return (
        <div>
					<p>{symptomInfo.map(sym => (
							<li key={sym.symptomNumber}>
								Symptom Name: {sym.name}
								<br></br>
								Description: {sym.description}
								{"\n"}
							</li>
						))} </p>
						{/* <div>
							<button></button>
						</div> */}
				</div>
    );
	}