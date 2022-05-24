import { useEffect, useState } from "react";

function SymptomConditions({ symptomNumber }) {
    const [conditions, setConditions] = useState(null);
    
    useEffect(() => {
        // https://plants.ces.ncsu.edu/plants/camellia-sinensis/
        // This will eventually do an actual request to the API
        new Promise((resolve) => setTimeout(resolve, 600))
            .then(() => {
                setConditions([
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

    if (conditions == null) {
        return <div>Loading...</div>
    }

    return (
        <ul>
            {conditions.map(cond => <li key={symptomNumber + cond.illnessNumber}><a href={`/conditions/${cond.illnessNumber}`}>{cond.name}</a></li>)}
        </ul>
    );
}

export default function SymptomsTab() {
    const [symptoms, setSymptoms] = useState(null);
    const [selectedSymptom, setSelectedSymptom] = useState('');

    useEffect(() => {
        // This will eventually do an actual request to the API
        new Promise((resolve) => setTimeout(resolve, 600))
            .then(() => {
                setSymptoms([
                    {
                        symptomNumber: 'cc8d39c6-c00b-4bca-b179-2f25e13e36d1',
                        name: 'Some symptom 1',
                        description: 'Some description',
                    },
                    {
                        symptomNumber: '2a75000c-ef48-4471-a760-5c26fce716cd',
                        name: 'Some symptom 2',
                        description: 'Some description',
                    },
                    {
                        symptomNumber: 'ae459662-5a19-41a5-8b5a-10e32182841e',
                        name: 'Some symptom 3',
                        description: 'Some description',
                    },
                ]);
            });
    }, []);

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
                        <th>Possible conditions (click symptom)</th>
                    </tr>
                </thead>
                <tbody>
                    {symptoms.map(sym => (
                        <tr key={`symptom-${sym.symptomNumber}`}>
                            <td><button value={sym.symptomNumber} onClick={onSymptomClicked}>{sym.name}</button></td>
                            <td>{sym.description}</td>
                            <td>{selectedSymptom === sym.symptomNumber ? <SymptomConditions symptomNumber={sym.symptomNumber} /> : <div />}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}