export default function SplashPage({ setPage }) {
    return (
        <div className="hero-image">
            <div className="hero-overlay">
                <h1 className="hero-title">FreqFinder</h1>
                <p className="hero-p">The solution to getting your music heard</p>
                <button
                    className="hero-button"
                    onClick={() => setPage("stations")}
                >
                    Match Your Freq
                </button>
            </div>
        </div>
    );
}
