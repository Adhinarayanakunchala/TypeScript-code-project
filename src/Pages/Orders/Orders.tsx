import { useEffect, useState } from "react";
import OrderClasses from "./orders.module.scss";
import Layout from "Component/Layout/Layout";
import Table from "Component/Table/Table";
import CommonClasses from "Styles/Common.module.scss";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { OrderService } from "Services/SignupServices";
import moment from "moment";
import Loader from "Component/Loader/loader";

interface Paginates {
  page: number;
  size: number;
  totalCount: number;
}
function Orders() {
  const Navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
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
      const response = await OrderService(PageNo, itemsPerPage);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Orders);
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
    fetchRequests(1);
  }, []);

  const Tablerow = [
    {
      name: "patientName",
      label: "Patient Name",
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      rowElement: (rowData: any) => <p>Blood Type:{rowData.bloodGroup}</p>,
    },
    {
      name: "bloodComponent",
      label: "Blood Component",
    },
    {
      name: "orderChannel",
      label: "Order Channel",
      rowElement: (rowData: any) => (
        <span
          className={
            rowData.orderChannel === 1
              ? CommonClasses["Delivered"]
              : CommonClasses["pending"]
          }
        >
          {rowData.orderChannel === 1 ? "Online" : "POS"}
        </span>
      ),
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      rowElement: (rowData: any) => (
        <span>{rowData.paymentStatus === 1 ? "Completed" : "Pending"}</span>
      ),
    },
    {
      name: "quantity",
      label: "Ordered Items",
      rowElement: (rowData: any) => <span>{rowData.quantity} Items</span>,
    },

    {
      name: "paymentType",
      label: "Payment Type",
      rowElement: (rowData: any) => (
        <span>
          {rowData.paymentType == 0 ? (
            <div className={CommonClasses["booked"]}>
              <span>Cash</span>
            </div>
          ) : (
            <div className={CommonClasses["delivered"]}>
              <span>Online</span>
            </div>
          )}
        </span>
      ),
    },

    {
      name: "orderStatus",
      label: "Order Status",
      rowElement: (rowData: any) => (
        <span>
          {rowData.orderStatus === 0 ? (
            <div className={CommonClasses["status-booked"]}>
              <span>Booked</span>
            </div>
          ) : rowData.orderStatus === 1 ? (
            <div className={CommonClasses["status-issued"]}>
              <span>Issued</span>
            </div>
          ) : rowData.orderStatus === 2 ? (
            <div className={CommonClasses["status-shipped"]}>
              <span>Shipped</span>
            </div>
          ) : rowData.orderStatus === 3 ? (
            <div className={CommonClasses["status-delivered"]}>
              <span>Delivered</span>
            </div>
          ) : (
            "null"
          )}
        </span>
      ),
    },
    {
      name: "orderPlacedOn",
      label: "Order Date",
      rowElement: (rowData: any) => (
        <span style={{ color: "gray" }}>
          {moment(rowData.orderPlacedOn).format("MMM Do YY")}
        </span>
      ),
    },
  ];

  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(paginate.totalCount / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    setItemOffset((newPage - 1) * itemsPerPage);
    fetchRequests(newPage);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const RowClickHandler = (OrderDetails: any) => {
    Navigate(`/pos/orders/details?orderId=${OrderDetails.orderId}`);
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
              <h3>Orders</h3>
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
                forcePage={paginate.page - 1}
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
