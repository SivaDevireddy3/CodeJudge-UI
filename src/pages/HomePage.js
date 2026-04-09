import React from 'react';

export default function HomePage({ onNavigate }) {
  return (
    <div className="cj-hero">
      <div className="cj-hero-grid" />
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center">
          <div className="col-lg-9 col-xl-8">

            <h1 className="hero-h1 mb-4">
              Code. Submit.<br />
              <span>Get Judged.</span>
            </h1>

            <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
              <button className="btn btn-brand btn-lg px-5" onClick={() => onNavigate('problems')}>
                <i className="bi bi-play-fill me-2" />Start Solving
              </button>
              <button className="btn btn-outline-cj btn-lg px-4" onClick={() => onNavigate('leaderboard')}>
                <i className="bi bi-trophy me-2" />Leaderboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}