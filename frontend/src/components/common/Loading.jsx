import React from "react";
import { ClipLoader, PulseLoader, BeatLoader } from "react-spinners";

// Loading component with different spinner types
const Loading = ({ 
  type = "clip", 
  size = 35, 
  color = "#9CA3AF", 
  loading = true,
  text = "",
  fullScreen = false,
  className = ""
}) => {
  // Select spinner based on type
  const getSpinner = () => {
    switch (type) {
      case "pulse":
        return <PulseLoader color={color} size={size / 3} loading={loading} />;
      case "beat":
        return <BeatLoader color={color} size={size / 2} loading={loading} />;
      case "clip":
      default:
        return <ClipLoader color={color} size={size} loading={loading} />;
    }
  };

  // For full screen loading overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
        <div className="flex flex-col items-center">
          {getSpinner()}
          {text && <p className="mt-4 text-white font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  // For inline or container loading
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {getSpinner()}
      {text && <p className="mt-2 text-gray-200 text-sm">{text}</p>}
    </div>
  );
};

export default Loading;
