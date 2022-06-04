import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from './Modal';
import Home from './Home';

export default function IllnessesPage() {
    const [illnesses, setIllnesses] = useState(null);

		const { paramName } = useParams();

    useEffect(() => {
      fetch('https://plantdb.azurewebsites.net/plants/')
        .then(res => res.json())
        .then(data => {
          setIllnesses(data)
        })
    }, [])

    if (illnesses == null) {
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
                        <tr key={`illness-${ill.illnessNumber}`}>
                            <td><Link to={`/condition/${ill.illnessNumber}`}>{ill.name}</Link></td>
                            <td>{ill.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

