import { useState } from "react";
import supabase from "../utils/supabase";

export default function ApplicationForm({ selectedStation, setPage }) {
    //main component for my forms and sets up variables for the page to run smooth
    // Local form state
    const [bandName, setBandName] = useState("");
    const [genre, setGenre] = useState("");
    const [location, setLocation] = useState("");
    const [epk, setEpk] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // Handles form submission and saves data to Supabase
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            // makes sure i select a station before submitting
            if (!selectedStation) {
                setMessage(
                    "Please select a station before submitting an application."
                );
                setSubmitting(false);
                return;
            }

            // Build a new record from the form data
            const newApp = {
                band_name: bandName.trim(),
                genre: genre.trim(),
                location: location.trim(),
                epk: epk.trim(),
                station_id: selectedStation.stationuuid,
            };

            console.log("Submitting new application:", newApp);

            // Insert into Supabase
            const { data, error } = await supabase
                .from("band_applications")
                .insert([newApp])
                .select();

            // Handles my results
            if (error) {
                console.error(" Supabase insert error:", error);
                setMessage(
                    "Error submitting application. Check console for details."
                );
            } else {
                console.log("Submitted successfully:", data);
                setMessage(`Application submitted to ${selectedStation.name}!`);

                // Clear form with nothing on it
                setBandName("");
                setGenre("");
                setLocation("");
                setEpk("");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setMessage("Something went wrong. See console for details.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="form-container">
            <h1>Apply to {selectedStation.name}</h1>

            {/* form layouts */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Band Name"
                    value={bandName}
                    onChange={(e) => setBandName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="EPK or Website"
                    value={epk}
                    onChange={(e) => setEpk(e.target.value)}
                />

                <div className="button-row">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage("stations")}
                        disabled={submitting}
                    >
                        Back to Stations
                    </button>
                </div>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
