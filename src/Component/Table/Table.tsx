import React from "react";
import TableClasses from "./Table.module.scss";

interface Table {
    Tablerow: Tablerow[];
    Data: any;
    onRowClick?(row: any, event: React.MouseEvent<HTMLTableRowElement>): void;
}

interface Tablerow {
    name: string;
    label: string;
    rowElement?: (rowData: any) => any;
}

const CustomTable: React.FC<Table> = ({ Tablerow, Data, onRowClick }) => {
    return (
        <table className={TableClasses["Table_Container"]}>
            <thead>
                <tr>
                    {Tablerow.map((rowData, index) => (
                        <th key={index}>{rowData.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Data.map((row: any, index: number) => (
                    <tr
                        key={index}
                        onClick={
                            onRowClick
                                ? (event) => onRowClick(row, event)
                                : undefined
                        }>
                        {Tablerow.map((rowData, cellIndex) => (
                            <td key={cellIndex}>
                                {rowData?.rowElement
                                    ? rowData.rowElement(row)
                                    : row[rowData.name]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CustomTable;
