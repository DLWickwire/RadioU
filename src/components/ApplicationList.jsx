import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function ApplicationList() { //this keeps all my application data and loading stuff
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

//this useeffect is just fetching the applications when the page loads but automatically
  useEffect(() => {
    fetchApplications();
  }, []);
//gets all myt band apps from supabase and the details on stations it was sent to then combines it all and shows me it 
  async function fetchApplications() {
    try {
      const { data, error } = await supabase //this gets my stuff from supabase
        .from("band_applications")
        .select("*");

      const appsWithStation = await Promise.all( // makes sure all the fetches from the radio api are done before finishing
        data.map(async (app) => {
          const res = await fetch( //loops all my apps and then sends a fetch to the radio api and returns an aray with an object
            `https://de1.api.radio-browser.info/json/stations/byuuid/${app.station_id}`
          );
          const [station] = await res.json();
          return { //this lets me add or replace stuff 
            ...app,
            station_name: station?.name || "Unknown Station",
            station_country: station?.country || "Unknown Country",
            station_url: station?.homepage || "",
          };
        })
      );

      setApplications(appsWithStation); //updates my applications then updates the new one to the page
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false); //for the loading spinner to make sure it stops 
    }
  }

  //  this is too delete an application by ID
  async function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("band_applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting:", error);
      alert("Could not delete application.");
    } else {
      alert("Application deleted.");
      fetchApplications(); // Refresh list
    }
  }

  if (loading) return <p>Loading your applications...</p>;
//simple reduction that basically just counts how many applications there are currently
  const totalApplications = applications.reduce((count) => count + 1, 0);

// this retrun renders out all of my app data and also lets me delete entries
  return (
    <div className="list-container">
      <h1>My Submitted Applications</h1>
      <p>Total Applications Submitted: {totalApplications}</p>

      {applications.length === 0 ? (  // checks the list of apps and if its empty it says "no applications found"
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map((app) => ( //map of all the applications currently submitted and the key makes it so i can track all the items from the tables
            <li key={app.id}>
              <strong>{app.band_name}</strong> ({app.genre})<br />
              Location: {app.location}<br />
              Applied to:{" "}
              {app.station_url ? (
                <a href={app.station_url} target="_blank" rel="noreferrer">
                  {app.station_name}
                </a>
              ) : (
                app.station_name
              )}{" "}
              ({app.station_country})
              <br />
              <a href={app.epk} target="_blank" rel="noreferrer">
                View EPK
              </a>
              <br />
              {/* Delete button */}
              <button
                className="delete-btn"
                onClick={() => handleDelete(app.id)} //only works with the (app.id) so its able to target which app im deleting, also its linked to a button
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
