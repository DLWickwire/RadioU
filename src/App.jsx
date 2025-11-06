import { useState } from "react";
import Navbar from "./components/Navbar";
import Stations from "./components/Stations";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import "./App.css"; // my styles to make the page not ugly

export default function App() {
    // Keeps track of which "page" is being shown
    const [page, setPage] = useState("stations");

    // Stores whichever station the user clicked "Apply" on
    const [selectedStation, setSelectedStation] = useState(null);

    // for page switching
    return (
        <div>
            <h1 className="logo">FreqFinder</h1>
            <Navbar setPage={setPage} />
            {page === "stations" && (
                <Stations
                    setSelectedStation={setSelectedStation}
                    setPage={setPage}
                />
            )}
            {page === "apply" && (
                <ApplicationForm
                    selectedStation={selectedStation}
                    setPage={setPage}
                />
            )}
            {page === "list" && <ApplicationList />}
        </div>
    );
}
