import { Route, Routes } from "react-router";

// components
import Login from "Pages/Login/Login";

//utils
import Auth from "Util/Auth";
import { Config } from "Routes/route_config";

function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/pos" element={<Auth />}>
                    {Config.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={<route.Element />}></Route>
                    ))}
                </Route>
            </Routes>
        </>
    );
}

export default Router;
