import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import { observer } from "mobx-react-lite";

const RoleBaseRoutes = observer(() => {
  const { user, loading } = useAuth();

  if(loading){
    return <Loading fullScreen text="Redirecting..." />
  }

  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />
    case "employee":
      return <Navigate to="/employee-dashboard" replace />
    default:
      return <Navigate to="/unauthorized" replace />
  };

});

export default RoleBaseRoutes;
