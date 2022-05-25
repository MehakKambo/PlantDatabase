import { useState } from 'react';
import IllnessesTab from '../components/IllnessesTab/IllnessesTab';
import PlantTab from '../components/PlantTab/PlantTab';
import SymptomsTab from '../components/SymptomsTab/SymptomsTab'

const mainInfoTab = 'Main info';
const illnessesTab = 'Illnesses';
const symptomsTab = 'Symptoms';

const tabs = new Map([
    [mainInfoTab, <PlantTab />],
    [illnessesTab, <IllnessesTab />],
    [symptomsTab, <SymptomsTab />],
]);

function PlantTabSelector({ tab }) {
    return tabs.get(tab);
}

export default function PlantPage() {
    const [tab, setTab] = useState(mainInfoTab);

    const onTabClicked = ((e) => {
        setTab(e.target.value);
    });

    return (
        <div>
            <div className='plant-page__navbar'>
                <input type='button' value={mainInfoTab} onClick={onTabClicked} />
                <input type='button' value={illnessesTab} onClick={onTabClicked} />
                <input type='button' value={symptomsTab} onClick={onTabClicked} />
            </div>
            <br />
            <PlantTabSelector tab={tab} />
        </div>
    );
}
