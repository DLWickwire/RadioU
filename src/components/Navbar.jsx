export default function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <button onClick={() => setPage("stations")}>Stations</button>
      <button onClick={() => setPage("apply")}>Apply</button>
      <button onClick={() => setPage("list")}>My Applications</button>
    </nav>
  );
}
//all just lets me have the ability to navigate through my components(pages)