import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SymptomModal from './SymptomModal';

export function Component(props) {
	return <div> {props.data} {props.whatever} </div>
}

export default function IllnessesPage() {
  const { paramName } = useParams();  
	const [illnesses, setIllnesses] = useState(null);
	const [ symptomModalButton, setSymptomButton] = useState(false);
	const [symptomModal, setSymptom] = useState(null);
	

    useEffect(() => {
      fetch(`https://plantdb.azurewebsites.net/plants/${paramName}/illness`)
        .then(res => res.json())
        .then(data => {
          setIllnesses(data.illnesses)
        })
    }, [])

    if ((illnesses) == null) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Illness</th>
                        <th>Description</th>
												<th>Symptoms</th>
                    </tr>
                </thead>
                <tbody>
                    {illnesses.map(ill => (
											<tr key={ill.illnessNumber}>
												<td>
													{ill.name}
												</td>
												<td>
													{ill.description}
												</td>
												<td>
													<button onClick={() => {
														setSymptomButton(true);
														setSymptom(symptomModal != null ? null : ill.name);
														}}>Symptoms</button>
														<SymptomModal open={symptomModal === ill.name} scientificName={paramName} name={symptomModal} />
												</td>
												
												
											</tr>
                    ))}
										
                </tbody>
            </table>
        </div>
    );
}

