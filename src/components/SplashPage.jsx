export default function SplashPage({ setPage }) {
    return (
        <div className="hero-image">
            <div className="hero-overlay">
                <h1 className="hero-title">FreqFinder</h1>
                <p className="hero-p">The easiest way to get your music heard</p>
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
