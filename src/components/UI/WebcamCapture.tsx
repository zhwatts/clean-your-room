import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import './WebcamCapture.css';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      onClose();
    }
  }, [webcamRef, onCapture, onClose]);

  return (
    <div className="webcam-modal">
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 720,
            height: 720,
            facingMode: "user"
          }}
          onUserMedia={() => setIsCameraReady(true)}
          mirrored={true}
        />
        <div className="webcam-controls">
          {isCameraReady ? (
            <button className="capture-button" onClick={capture}>
              📸 Take Photo
            </button>
          ) : (
            <div className="loading-message">Loading camera...</div>
          )}
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture; 