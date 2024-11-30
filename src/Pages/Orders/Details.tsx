import React, { useEffect, useState } from "react";
import Layout from "Component/Layout/Layout";
import DetailsClasses from "./orders.module.scss";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import {
  ChangeOrderService,
  DocumentView,
  OrderByIDService,
} from "Services/SignupServices";
import moment from "moment";
import Loader from "Component/Loader/loader";
import { SuccessSwal } from "Util/Toast";
import Table from "Component/Table/Table";
import { MdPreview } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

interface RequestDetails {
  patientName: string;
  quantity: number;
  orderPlacedOn: string;
  referredBy: string;
  hospitalName: string;
  orderStatus: number;
  documentId: string;
}

interface bagItems {
  units: number;
  bloodGroup: string;
  bloodComponent: string;
  bagNumber: string;
  bagSerialNumber: string;
}

function Details() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [data, setData] = useState<RequestDetails>();
  const [downloadDoc, setDownloadDoc] = useState<string>();
  const [orderStatus, setOrderStatus] = useState<number | null>(null);
  const [items, setItems] = useState<bagItems[]>([]);
  const id = params.get("orderId");
  console.log("status", orderStatus);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await OrderByIDService(id);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Order);
        setOrderStatus(response?.data?.Order?.orderStatus);
        setItems(response?.data?.Order?.items || []);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRequest();
  }, []);

  const UpdateOrderStatus = async (
    orderId: string | null,
    orderStatus: any
  ) => {
    setLoading(true);
    console.log(orderId, orderStatus);
    try {
      const response = await ChangeOrderService(orderId, orderStatus);
      setLoading(false);
      if (response?.data?.Status === 1) {
        SuccessSwal("Order updated successfully", response?.data?.Message);
        navigate(-1);
      }
    } catch (err: any) {
      setLoading(false);

      setErrorMsg(
        err?.response?.data?.Message || "Something went wrong try again later"
      );
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = parseInt(event.target.value, 10);
    setOrderStatus(newStatus);

    // UpdateOrderStatus(id, newStatus);
  };

  const viewDoc = async (Id: string) => {
    try {
      fetch(`${process.env.REACT_APP_BASE_URL}pos/documents?key=${Id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          setDownloadDoc(URL.createObjectURL(blob));
          window.open(URL.createObjectURL(blob));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const viewDoc1 = async (Id: string) => {
    try {
      fetch(`${process.env.REACT_APP_BASE_URL}pos/documents?key=${Id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          setDownloadDoc(URL.createObjectURL(blob));
          let a = document.createElement("a");

          a.href = URL.createObjectURL(blob);
          a.download = data?.documentId || "file";
          a.click();
        });
    } catch (err) {
      console.log(err);
    }
  };

  const Tablerow = [
    {
      name: "bagNumber",
      label: "Bag Number",
    },
    {
      name: "bagSerialNumber",
      label: "Bag SerialNumber",
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
    // {
    //   name: "units",
    //   label: "Quantity",
    //   rowElement: (rowData: any) => <p>{rowData.units} Units</p>,
    // },
  ];

  //   const DownloadDoc = ()=>{
  //     try{
  // var tempLink = document.createElement('a');
  // tempLink.href = downloadDoc;
  // tempLink.setAttribute('download', 'filename.csv');
  // tempLink.click();
  //     }
  //   }

  // const DownloadDoc = (): void => {
  //   try {
  //     const dc: string = downloadDoc || "";
  //     const tempLink: HTMLAnchorElement = document.createElement("a");
  //     tempLink.href = dc;
  //     tempLink.setAttribute("download", data?.documentId || "doc");
  //     tempLink.click();
  //   } catch (error) {
  //     console.error("Error downloading the document:", error);
  //   }
  // };
  return (
    <Layout>
      <div className={DetailsClasses["detail_container"]}>
        <header>
          <button onClick={() => navigate(-1)}>
            <IoMdArrowBack size={35} />
          </button>
          <h3>Order Details</h3>
        </header>
        {loading ? (
          <Loader />
        ) : errorMsg ? (
          <div>Error: {errorMsg}</div>
        ) : data ? (
          <div className={DetailsClasses["Patient-details"]}>
            <div className={DetailsClasses["detail"]}>
              <h3>Patient Name</h3>
              <p>{data?.patientName}</p>
            </div>
            <div className={DetailsClasses["details"]}>
              <h3>Ordered Items</h3>
              <Table Tablerow={Tablerow} Data={items} />
            </div>
            <div className={DetailsClasses["detail"]}>
              <h3>Order Date</h3>
              <p>{moment(data?.orderPlacedOn).format("MMMM Do YYYY")}</p>
            </div>
            <div className={DetailsClasses["detail"]}>
              <h3>Referred By</h3>
              <p>{data?.referredBy}</p>
            </div>
            <div className={DetailsClasses["detail"]}>
              <h3>Hospital Name</h3>
              <p>{data?.hospitalName}</p>
            </div>
            <div className={DetailsClasses["detail"]}>
              <h3>Documents</h3>
              <div className={DetailsClasses["doc-btn"]}>
                {data?.documentId !== null && (
                  <>
                    <button
                      type="button"
                      onClick={() => viewDoc(data?.documentId)}
                      className={DetailsClasses["d-btn"]}
                    >
                      <MdPreview size={20} />
                      view
                    </button>

                    <button
                      type="button"
                      className={DetailsClasses["d-btn"]}
                      onClick={() => viewDoc1(data?.documentId)}
                    >
                      <FaDownload size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={DetailsClasses["detail"]}>
              <h3>Order Status</h3>
              <select
                value={orderStatus ?? data?.orderStatus}
                onChange={handleStatusChange}
                disabled={data?.orderStatus == 3}
              >
                <option disabled={data?.orderStatus >= 1} value={0}>
                  Booked
                </option>
                <option disabled={data?.orderStatus >= 1} value={1}>
                  Issued
                </option>
                <option value={2} disabled={data?.orderStatus >= 2}>
                  Shipped
                </option>
                <option value={3}>Delivered</option>
              </select>
            </div>
            <button onClick={() => UpdateOrderStatus(id, orderStatus)}>
              Update Changes
            </button>
          </div>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    </Layout>
  );
}

export default Details;
