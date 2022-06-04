import { useEffect, useState } from "react";
import "../styles/Modal.css";

export default function PlantAddForm({ setTrigger }) {
    // Regions fetched from the server
    const [regions, setRegions] = useState([{
        abbr: "",
        name: "Loading...", // This is a hack, it just gives the dropdown a default value while the data is being fetched
    }]);
    const [regionsFetched, setRegionsFetched] = useState(false);

    // Form fields
    const [scientificName, setScientificName] = useState("");
    const [commonName, setCommonName] = useState("");
    const [region, setRegion] = useState("");

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
                        method: "POST",
                    });

                if (res.ok) {
                    setResultMessage("Plant added! Refreshing...");
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
					<h4 className="modal-title">Add new plant</h4>
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
					<button className="button" onClick={() => setTrigger(false)}>Close</button>
				</div>
			</div>
		</div>
    );
}