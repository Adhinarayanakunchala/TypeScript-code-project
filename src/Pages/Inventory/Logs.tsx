import { useState } from "react";
import inventoryClasses from "./inventory.module.scss";
import Layout from "Component/Layout/Layout";
import Table from "Component/Table/Table";
import { IoMdArrowBack } from "react-icons/io";
import CommonClasses from "Styles/Common.module.scss";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
function Orders() {
    const [itemOffset, setItemOffset] = useState<number>(0);
    const [ActiveTab, setActiveTab] = useState<string>("added");
    const navigate = useNavigate();
    const itemsPerPage = 16;
    const Data = [
        {
            Date: "10 Jan 2024",
            Quantity: 2,
            ExpiryDate: "12 Jan 2025",
            AddedBy: "Gustavo Herwitz",
        },

        {
            Date: "10 Jan 2024",
            Quantity: 2,
            ExpiryDate: "12 Jan 2025",
            AddedBy: "Gustavo Herwitz",
        },
        {
            Date: "10 Jan 2024",
            Quantity: 2,
            ExpiryDate: "12 Jan 2025",
            AddedBy: "Gustavo Herwitz",
        },
    ];
    const Tablerow = [
        {
            name: "Date",
            label: "Date",
        },

        {
            name: "Quantity",
            label: "Quantity",
            rowElement: (rowData: any) => <span>{rowData.Quantity} Units</span>,
        },
        {
            name: "ExpiryDate",
            label: "Expiry Date",
        },

        {
            name: "AddedBy",
            label: "Added By",
        },
    ];

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = Data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(Data.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * itemsPerPage) % Data.length;
        window.scrollTo({ top: 120, behavior: "smooth" });

        setItemOffset(newOffset);
    };

    return (
        <Layout>
            <div className={inventoryClasses["Container"]}>
                <div className={inventoryClasses["header_logs"]}>
                    <button onClick={() => navigate(-1)}>
                        <IoMdArrowBack size={30} />
                    </button>
                    <h3>Blood Group:AB-</h3>
                </div>
            </div>
            <div className={inventoryClasses["inventory_Navbar"]}>
                <button
                    className={
                        ActiveTab === "added"
                            ? inventoryClasses["active-tab"]
                            : ""
                    }
                    onClick={() => setActiveTab("added")}>
                    Added
                </button>
                <button
                    className={
                        ActiveTab === "discarded"
                            ? inventoryClasses["active-tab"]
                            : ""
                    }
                    onClick={() => setActiveTab("discarded")}>
                    Discarded
                </button>
                <button
                    className={
                        ActiveTab === "sold"
                            ? inventoryClasses["active-tab"]
                            : ""
                    }
                    onClick={() => setActiveTab("sold")}>
                    Sold
                </button>
            </div>
            <div className={inventoryClasses["table"]}>
                <Table Tablerow={Tablerow} Data={currentItems} />
                <div className={CommonClasses["Paginate_wrapper"]}>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        pageClassName={CommonClasses["pageClassName"]}
                        disabledLinkClassName={
                            CommonClasses["disabledLinkClassName"]
                        }
                        disabledClassName={CommonClasses["disabledClassName"]}
                        containerClassName={CommonClasses["Paginate_Container"]}
                        nextClassName={CommonClasses["nextClassName"]}
                        previousClassName={CommonClasses["previousClassName"]}
                        activeClassName={CommonClasses["activeClassName"]}
                        activeLinkClassName={
                            CommonClasses["activeLinkClassName"]
                        }
                        pageLinkClassName={CommonClasses["pageLinkClassName"]}
                    />
                </div>
            </div>
        </Layout>
    );
}

export default Orders;
