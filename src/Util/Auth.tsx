import { Navigate, Outlet } from "react-router-dom";

const Useauth = () => {
    const token = localStorage.getItem("Token");

    return token !== null;
};

const ProtectedRoutes = () => {
    const isAuth = Useauth();

    return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
