import React, { ReactNode } from "react";
import Navbar from "./Nav/Navbar";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Navbar>{children}</Navbar>
        </div>
    );
};

export default Layout;
