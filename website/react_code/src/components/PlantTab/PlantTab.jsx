import { useEffect, useState } from "react";

export default function PlantTab() {
    const [plantInfo, setPlantInfo] = useState(null);

    useEffect(() => {
        // https://plants.ces.ncsu.edu/plants/camellia-sinensis/
        // This will eventually do an actual request to the API
        new Promise((resolve) => setTimeout(resolve, 600))
            .then(() => {
                setPlantInfo({
                    scientificName: 'Camellia sinensis sinensis',
                    commonName: 'Tea plant',
                    regionName: 'Southeast China',
                    regionAbbr: 'SECN',
                    climates: ['Some climate', 'Some other climate'],
                    research: ['Citation 1', 'Citation 2'],
                });
            });
    }, []);

    if (plantInfo == null) {
        return <div>Loading...</div>
    }

    return (
        <div className="plant-tab__main-info">
            <table>
                <tbody>
                    <tr>
                        <th>Scientific name</th>
                        <td>{plantInfo.scientificName}</td>
                    </tr>
                    <tr>
                        <th>Common name</th>
                        <td>{plantInfo.commonName}</td>
                    </tr>
                    <tr>
                        <th>Region</th>
                        <td>{plantInfo.regionName}</td>
                    </tr>
                    <tr>
                        <th>Climates</th>
                        <td>
                            <ul>
                                {plantInfo.climates.map(climate => <li key={plantInfo.scientificName + climate}>{climate}</li>)}
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
