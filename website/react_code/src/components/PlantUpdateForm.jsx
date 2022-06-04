import { useEffect, useState } from "react";
import "../styles/Modal.css";

export const FormMode = {
    None: 0,
    Add: 1,
    Modify: 2,
};

const formTitle = new Map([
    [FormMode.Add, "Add new plant"],
    [FormMode.Modify, "Modify plant"],
]);

const formSuccess = new Map([
    [FormMode.Add, "Plant added!"],
    [FormMode.Modify, "Plant updated!"],
]);

const submitMethod = new Map([
    [FormMode.Add, "POST"],
    [FormMode.Modify, "PUT"],
]);

export function PlantUpdateForm({ closeModal, operation, initialPlant }) {
    // Regions fetched from the server
    const [regions, setRegions] = useState([{
        abbr: "",
        name: "Loading...", // This is a hack, it just gives the dropdown a default value while the data is being fetched
    }]);
    const [regionsFetched, setRegionsFetched] = useState(false);

    // Modal title
    const title = formTitle.get(operation);

    // Form fields
    const [scientificName, setScientificName] = useState(initialPlant?.scientificName || "");
    const [commonName, setCommonName] = useState(initialPlant?.commonName || "");
    const [region, setRegion] = useState(initialPlant?.region || "");

    // Form state
    const [submitting, setSubmitting] = useState(false);
    const [didSubmitError, setDidSubmitError] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    // Refresh the page after three seconds if the submission suceeded
    useEffect(() => {
        if (!shouldRefresh) return;
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    });

    // Fetch the regions from the API
    useEffect(() => {
        fetch("https://plantdb.azurewebsites.net/regions")
            .then((res) => res.json())
            .then((res) => {
                setRegions(res.regions)
                setRegionsFetched(true);
                setRegion(res.regions.length === 0 ? "" : res.regions[0].name)
            });
    }, []);

    const submit = async (e) => {
        // Prevent the submit button from refreshing the page
        e.preventDefault();

        // Clear the result text
        setResultMessage("");
        setDidSubmitError(false);

        // Disable all of the form inputs
        setSubmitting(true);

        if (scientificName && commonName && region) {
            // Submit the form data to the server
            try {
                const res = await fetch(
                    `https://plantdb.azurewebsites.net/plants/${scientificName},${commonName},${region}/main`,
                    {
                        method: submitMethod.get(operation),
                    });

                if (res.ok) {
                    setResultMessage(`${formSuccess.get(operation)} Refreshing...`);
                    setShouldRefresh(true);
                } else {
                    setDidSubmitError(true);

                    let errorMessage = "";
                    try {
                        // Try to get the error message from the API response
                        const o = await res.json();
                        errorMessage = `API error: ${o.message}`;
                    } catch (err) {
                        // If something strange happened and the API didn't return a structured
                        // error, just print out the status message directly
                        errorMessage = `API error: ${res.statusText}`;
                    }

                    setResultMessage(errorMessage);
                }
            } catch (err) {
                // Print out whatever the error was
                setDidSubmitError(true);

                if (!(err instanceof Error)) {
                    setResultMessage(`${err}`);
                } else {
                    setResultMessage(err.message);
                }
            }
        } else {
            // Handle validation failures
            setDidSubmitError(true);

            if (!scientificName) {
                setResultMessage("Scientific name is required.");
            } else if (!commonName) {
                setResultMessage("Common name is required.");
            } else {
                setResultMessage("Region is required.");
            }
        }

        // Enable all of the form inputs
        setSubmitting(false);
    };
    
    return (
        <div className="modal">
			<div className="modal-content">
				<div className="modal-header">
					<h4 className="modal-title">{title}</h4>
				</div>
				<div className="modal-body">
                    <form onSubmit={submit}>
                        <label>
                            Scientific name:
                            <input disabled={submitting} type="text" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Common name:
                            <input disabled={submitting} type="text" value={commonName} onChange={(e) => setCommonName(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Region:
                            <select disabled={!regionsFetched || submitting} value={region} onChange={(e) => setRegion(e.target.value)}>
                                {regions.map(r => (
                                    <option key={r.name} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <input disabled={!regionsFetched || submitting} type="submit" value="Submit" />
                    </form>
                    <span style={{ color: didSubmitError ? "red" : undefined }}>{resultMessage}</span>
				</div>
				<div className="modal-footer">
					<button className="button" onClick={closeModal}>Close</button>
				</div>
			</div>
		</div>
    );
}