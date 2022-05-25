import { useEffect, useState } from 'react';

export default function IllnessesTab() {
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
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Illness</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {illnesses.map(cond => (
                        <tr key={`illness-${cond.illnessNumber}`}>
                            <td><a href={`/condition/${cond.illnessNumber}`}>{cond.name}</a></td>
                            <td>{cond.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}