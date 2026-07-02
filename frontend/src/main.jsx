import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { AuthProvider } from "./context/authContext"
import { NotificationProvider } from "./components/common/Notification"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>,
)
