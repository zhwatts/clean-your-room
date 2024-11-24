/** @format */

import "./MobileWarningModal.css";

function MobileWarningModal() {
  return (
    <div className="mobile-warning-overlay">
      <div className="mobile-warning-content">
        <h2>Desktop Experience Required</h2>
        <div className="warning-icon">💻</div>
        <p className="primary-message">
          Oops! We noticed you're on a mobile device.
        </p>
        <p className="secondary-message">
          "Clean Your Room!" is designed to be played with a keyboard for the
          best possible experience.
        </p>
        <p className="action-message">
          Please visit us again from a desktop or laptop computer to enjoy the
          game properly!
        </p>
        <div className="device-suggestion">
          <span>Recommended: </span>
          <span className="device-icons">🖥️ 💻</span>
        </div>
      </div>
    </div>
  );
}

export default MobileWarningModal;
