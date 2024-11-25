/** @format */

import "./SmallScreenWarning.css";

function SmallScreenWarning() {
  return (
    <div className="small-screen-overlay">
      <div className="small-screen-content">
        <h2>Screen Size Too Small</h2>
        <p>
          Sorry, this game requires a larger screen to play properly. Please
          access the game from a device with a screen width of at least 800px.
        </p>
        <p className="screen-width">
          Current screen width: {window.innerWidth}px
        </p>
      </div>
    </div>
  );
}

export default SmallScreenWarning;
