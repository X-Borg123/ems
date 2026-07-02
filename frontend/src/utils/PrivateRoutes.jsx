import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { observer } from "mobx-react-lite"
import Loading from "../components/common/Loading"
import React from "react"

const PrivateRoutes = observer(({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen text="Authenticating..." />

  if (!user) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" /> // Or a 403 page
  }

  return children
})

export default PrivateRoutes