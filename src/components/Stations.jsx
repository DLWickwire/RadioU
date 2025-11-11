import { useState } from "react";

export default function Stations({ setSelectedStation, setPage }) {
    // State for search term, station results, and loading status
    const [genre, setGenre] = useState("");
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetches live stations by genre from the Radio Browser API
    async function handleSearch() {
        if (!genre.trim()) return;
        setLoading(true);
        setStations([]);

        try {
            const res = await fetch(
                `https://de1.api.radio-browser.info/json/stations/search?tag=${encodeURIComponent(
                    genre
                )}&limit=50&hidebroken=true`
            );
            const data = await res.json();

            // filter for loop for my stations
            const cleanStations = [];
            for (let i = 0; i < data.length; i++) {
                const s = data[i];
                if (s.name && s.country) {
                    cleanStations.push(s);
                }
            }

            setStations(cleanStations);
        } catch (err) {
            console.error("Error fetching stations:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
  <div className="stations-container">
    <h1>Search Stations by Genre</h1>

    {/* Search bar for genres */}
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter a genre (e.g. rock, jazz, pop)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>

    {loading && <p>Loading stations...</p>}

    {/* list of stations map for loop */}
    {!loading && stations.length > 0 && (() => {
      const stationList = [];

      for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        stationList.push(
          <li key={station.stationuuid}>
            <strong>{station.name}</strong> ({station.country})
            <br />
            <small>{station.tags}</small>
            <br />
            {/* Sets selected station and switches to form */}
            <button
              onClick={() => {
                setSelectedStation(station);
                setPage("apply");
              }}
            >
              Apply Here
            </button>
          </li>
        );
      }

      return <ul>{stationList}</ul>;
    })()}
  </div>
)}
