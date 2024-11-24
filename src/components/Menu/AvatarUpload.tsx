/** @format */

import React, { useRef } from "react";
import "./AvatarUpload.css";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (avatarBase64: string) => void;
  onAvatarDelete: () => void;
  onTakePhoto: () => void;
}

function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  onAvatarDelete,
  onTakePhoto,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const resizedImage = await resizeImage(file);
      onAvatarChange(resizedImage);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try another image.");
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        const size = 128; // Fixed size for the output
        canvas.width = size;
        canvas.height = size;

        // Calculate dimensions to cover the entire circle
        let scale = 1;
        let x = 0;
        let y = 0;

        // Calculate the minimum scale needed to cover the circle
        const scaleX = size / img.width;
        const scaleY = size / img.height;
        scale = Math.max(scaleX, scaleY); // Use the larger scale to ensure coverage

        // Calculate dimensions after scaling
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        x = (size - scaledWidth) / 2;
        y = (size - scaledHeight) / 2;

        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Fill with white background (optional, for images with transparency)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);

        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Convert to base64
        const base64Image = canvas.toDataURL("image/png");
        URL.revokeObjectURL(img.src);
        resolve(base64Image);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Error loading image"));
      };
    });
  };

  return (
    <div className="avatar-upload">
      {currentAvatar && (
        <button className="avatar-delete-button" onClick={onAvatarDelete}>
          ✕
        </button>
      )}

      <div className="avatar-preview">
        {currentAvatar ? (
          <img src={currentAvatar} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">No Avatar</div>
        )}
      </div>

      <div className="avatar-actions">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: "none" }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          📁 Upload Avatar
        </button>
        <button onClick={onTakePhoto}>📸 Take Photo</button>
      </div>
    </div>
  );
}

export default AvatarUpload;
