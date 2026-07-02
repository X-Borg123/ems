import React from "react";
import { AlertCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const ErrorMessage = ({
  message,
  type = "error",
  className = "",
  onClose = null,
  dismissible = false
}) => {
  if (!message) return null;

  // Configure based on type
  const config = {
    error: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    warning: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    info: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    validation: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-200",
      icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
    },
  }

  const { bgColor, textColor, borderColor } = config[type] || config.error;

  return (
    <div className={`rounded-md border ${borderColor} ${bgColor} p-3 ${className}`}>
      <div className="flex">
        <div className="flex-1">
          <div className={`text-sm ${textColor}`}>
            {typeof message === "string" ? message : JSON.stringify(message)}
          </div>
        </div>
        {dismissible && onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Form field error component
export const FieldError = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
};

export default ErrorMessage;
