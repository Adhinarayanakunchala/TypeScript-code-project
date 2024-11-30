import { useEffect, useState } from "react";
import OrderClasses from "./orders.module.scss";
import Layout from "Component/Layout/Layout";
import Table from "Component/Table/Table";
import CommonClasses from "Styles/Common.module.scss";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { RequestService } from "Services/SignupServices";
import moment from "moment";
import Loader from "Component/Loader/loader";

interface Paginates {
  page: number;
  size: number;
  totalCount: number;
}
function Orders() {
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const itemsPerPage = 10;
  const [errorMsg, setErrorMsg] = useState("");

  const [paginate, setPaginate] = useState<Paginates>({
    page: 1,
    size: itemsPerPage,
    totalCount: 0,
  });

  const fetchRequests = async (PageNo: any) => {
    setLoading(true);
    try {
      const response = await RequestService(PageNo, itemsPerPage);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Requests);
        setPaginate(response?.data?.Pagination);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, []);
  const Tablerow = [
    {
      name: "patientName",
      label: "PatientName",
    },
    {
      name: "ailment",
      label: "Ailment",
      rowElement: (rowData: any) => (
        <span style={{ color: "gray" }}>
          {rowData.ailment !== "NA" ? rowData.ailment : "--"}
        </span>
      ),
    },
    {
      name: "quantity",
      label: "Unit Requirement",
      rowElement: (rowData: any) => (
        <span style={{ color: "gray" }}>{rowData.quantity} Units</span>
      ),
    },

    {
      name: "reqStatus",
      label: "Request Status",
      rowElement: (rowData: any) => (
        <span
          className={
            rowData.Status === 1
              ? CommonClasses["Delivered"]
              : CommonClasses["pending"]
          }
        >
          {rowData.reqStatus === 1 ? "Delivered" : "Pending"}
        </span>
      ),
    },
    {
      name: "orderDate",
      label: "Order Date",
      rowElement: (rowData: any) => (
        <span style={{ color: "gray" }}>
          {moment(rowData.orderDate).format("MMMM Do YYYY")}
        </span>
      ),
    },
  ];

  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(paginate.totalCount / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    setItemOffset((newPage - 1) * itemsPerPage);
    fetchRequests(newPage);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };
  const RowClickHandler = (OrderDetails: any) => {
    console.log(OrderDetails);

    Navigate(`/pos/request/details?requestId=${OrderDetails.requestId}`);
  };
  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <div>Error: {errorMsg}</div>
      ) : data ? (
        <>
          <div className={OrderClasses["Container"]}>
            <header>
              <h3>Requests</h3>
              <button onClick={() => Navigate("add")}>
                Create new Request
              </button>
            </header>
          </div>
          <div className={OrderClasses["table"]}>
            <Table
              Tablerow={Tablerow}
              Data={data}
              onRowClick={RowClickHandler}
            />
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
