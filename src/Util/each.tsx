import React, { ReactNode } from "react";

interface EachProps {
    render: (item: any, index: number) => ReactNode;
    of: any[];
}

const Each: React.FC<EachProps> = ({ render, of }) => {
    return <>{of.map((item, index) => render(item, index))}</>;
};

export default Each;
