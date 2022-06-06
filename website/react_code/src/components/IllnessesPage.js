import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


export default function IllnessesPage() {
  const { paramName } = useParams();  
	const [illnesses, setIllnesses] = useState(null);

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
													<Link to={`/${paramName}/illness/${ill.name}/symptom`} className='btn btn-primary'>Symptom</Link>
												</td>
											</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

