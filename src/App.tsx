import { Routes, Route } from "react-router-dom";

import Router from "Routes/routes";
import ErrorBoundary from "Component/ErrorBoundary/Error";
import { useNavigate } from "react-router-dom";
import { addResponseInterceptor } from "Services/config";
//Styles
import "Styles/App.css";

function App() {
    const navigate = useNavigate();
    // Set up response interceptor with navigation function
    addResponseInterceptor(navigate);
    return (
        <div>
            <ErrorBoundary>
                <Routes>
                    <Route path="*" element={<Router />} />
                </Routes>
            </ErrorBoundary>
        </div>
    );
}

export default App;
