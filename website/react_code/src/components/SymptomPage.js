import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SymptomIllnesses({ symptomNumber }) {
    const [illnesses, setIllnesses] = useState(null);
    
    useEffect(() => {
        // https://plants.ces.ncsu.edu/plants/camellia-sinensis/
        // This will eventually do an actual request to the API
        new Promise((resolve) => setTimeout(resolve, 600))
            .then(() => {
                setIllnesses([
                    {
                        illnessNumber: 'e3e9e238-d026-4e2a-8d1c-8b2330929f69',
                        name: 'Dieback',
                        description: 'Some description',
                    },
                    {
                        illnessNumber: '5db7858e-dded-4ff9-9c3b-debfd4ff4659',
                        name: 'Cankers',
                        description: 'Some description',
                    },
                    {
                        illnessNumber: '60a96f43-ccf5-4f7a-8e54-05357ecb5388',
                        name: 'Flower blight',
                        description: 'Some description',
                    },
                ]);
            });
    }, []);

    if (illnesses == null) {
        return <div>Loading...</div>
    }

    return (
        <ul>
            {illnesses.map(ill => <li key={symptomNumber + ill.illnessNumber}><a href={`/conditions/${ill.illnessNumber}`}>{ill.name}</a></li>)}
        </ul>
    );
}

export default function SymptomPage() {
    const [symptoms, setSymptoms] = useState(null);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const { scientificName, illnessName} = useParams();

    useEffect(() => {
        fetch(`https://plantdb.azurewebsites.net/plants/${scientificName}/ilness/${illnessName}/symptoms`)
        .then(res => res.json())
        .then(data => {
            setSymptoms(data.symptoms)
        })
    }, [])

    if (symptoms == null) {
        return <div>Loading...</div>
    }

    const onSymptomClicked = (e) => {
        setSelectedSymptom(e.target.value);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Symptom</th>
                        <th>Description</th>
                        <th>Possible illnesses (click symptom)</th>
                    </tr>
                </thead>
                <tbody>
                    {symptoms.map(sym => (
                        <tr key={`symptom-${sym.symptomNumber}`}>
                            <td><button value={sym.symptomNumber} onClick={onSymptomClicked}>{sym.name}</button></td>
                            <td>{sym.description}</td>
                            <td>{selectedSymptom === sym.symptomNumber ? <SymptomIllnesses symptomNumber={sym.symptomNumber} /> : <div />}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}