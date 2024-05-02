import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const sessionData = sessionStorage.getItem("persist:root");
  const data = JSON.parse(sessionData);
  const usersString = data.users;
  const usersData = JSON.parse(usersString);
  const UserName = usersData.userName;

  return UserName ? <Outlet /> : <Navigate to="/" />;
}
