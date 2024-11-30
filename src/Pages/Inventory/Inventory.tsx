import { useEffect, useState } from "react";
import inventoryClasses from "./inventory.module.scss";
import Layout from "Component/Layout/Layout";
import Table from "Component/Table/Table";
import CommonClasses from "Styles/Common.module.scss";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { inventoryService } from "Services/SignupServices";
import moment from "moment";
import { useParams } from "react-router-dom";
import Loader from "Component/Loader/loader";

interface Paginates {
  page: number;
  size: number;
  totalCount: number;
}
function Orders() {
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [ActiveTab, setActiveTab] = useState<string>("all");
  const [status, setStatus] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const itemsPerPage = 30;
  const [paginate, setPaginate] = useState<Paginates>({
    page: 1,
    size: itemsPerPage,
    totalCount: 0,
  });

  const fetchRequests = async (PageNo: any, status: number) => {
    setLoading(true);
    try {
      const response = await inventoryService(PageNo, 15, status);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Inventory);
        setPaginate({
          page: PageNo,
          size: itemsPerPage,
          totalCount: response?.data?.Pagination.totalCount,
        });
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests(1, status);
  }, [status]);
  const Tablerow = [
    {
      name: "bagNumber",
      label: "Blood Bag Number",
    },
    {
      name: "bagSerialNumber",
      label: "Bag Serial Number",
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      rowElement: (rowData: any) => <p>Blood Type:{rowData.bloodGroup}</p>,
    },

    {
      name: "bloodComponent",
      label: "BloodComponent",
    },

    {
      name: "pricePerUnit",
      label: "Bag Price",
      rowElement: (rowData: any) => (
        <p style={{ color: "gray" }}>₹{rowData.pricePerUnit}</p>
      ),
    },
    {
      name: "collectionDate",
      label: "Collected Date",
      rowElement: (rowData: any) => (
        <p style={{ color: "gray" }}>
          {moment(rowData.collectionDate).format("MMM Do YY")}
        </p>
      ),
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      rowElement: (rowData: any) => (
        <p style={{ color: "gray" }}>
          {moment(rowData.expiryDate).format("MMM Do YY")}
        </p>
      ),
    },
  ];

  const pageCount = Math.ceil(paginate.totalCount / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    setItemOffset((newPage - 1) * itemsPerPage);
    setPaginate((prevState) => ({ ...prevState, page: newPage }));
    fetchRequests(newPage, status);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleTabClick = (tab: string, status: number) => {
    setActiveTab(tab);
    setStatus(status);
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <div>Error: {errorMsg}</div>
      ) : data ? (
        <>
          <div className={inventoryClasses["Container"]}>
            <header>
              <h3>Inventory</h3>
              <NavLink to={"/pos/inventory/add"}>+ Add</NavLink>
            </header>
          </div>
          <div className={inventoryClasses["inventory_Navbar"]}>
            <button
              className={
                ActiveTab === "all" ? inventoryClasses["active-tab"] : ""
              }
              onClick={() => handleTabClick("all", 1)}
            >
              All
            </button>

            <button
              className={
                ActiveTab === "sold" ? inventoryClasses["active-tab"] : ""
              }
              onClick={() => handleTabClick("sold", 2)}
            >
              Sold
            </button>
            <button
              className={
                ActiveTab === "discarded" ? inventoryClasses["active-tab"] : ""
              }
              onClick={() => handleTabClick("discarded", 3)}
            >
              Discarded
            </button>
          </div>
          <div className={inventoryClasses["table"]}>
            <Table Tablerow={Tablerow} Data={data} />
            <div className={CommonClasses["Paginate_wrapper"]}>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                forcePage={paginate.page - 1}
                previousLabel="<"
                renderOnZeroPageCount={null}
                pageClassName={CommonClasses["pageClassName"]}
                disabledLinkClassName={CommonClasses["disabledLinkClassName"]}
                disabledClassName={CommonClasses["disabledClassName"]}
                containerClassName={CommonClasses["Paginate_Container"]}
                nextClassName={CommonClasses["nextClassName"]}
                previousClassName={CommonClasses["previousClassName"]}
                activeClassName={CommonClasses["activeClassName"]}
                activeLinkClassName={CommonClasses["activeLinkClassName"]}
                pageLinkClassName={CommonClasses["pageLinkClassName"]}
              />
            </div>
          </div>
        </>
      ) : (
        <div>No data available.</div>
      )}
    </Layout>
  );
}

export default Orders;
