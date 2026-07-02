import React, { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create context
const NotificationContext = createContext();

// Custom toast components
const ToastContent = ({ message }) => (
  <div className="flex items-center">
    <div className="ml-3">{message}</div>
  </div>
);

export const NotificationProvider = ({ children }) => {
  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Notification methods
  const notify = {
    success: (message) => {
      toast.success(
        <ToastContent 
          message={message}
        />, 
        toastConfig
      );
    },
    error: (message) => {
      toast.error(
        <ToastContent 
          message={message}
        />, 
        toastConfig
      );
    },
    warning: (message) => {
      toast.warning(
        <ToastContent 
          message={message}
        />, 
        toastConfig
      );
    },
    info: (message) => {
      toast.info(
        <ToastContent 
          message={message}
        />, 
        toastConfig
      );
    },
    // For custom toast with options
    custom: (message, options = {}) => {
      toast(message, { ...toastConfig, ...options });
    }
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
