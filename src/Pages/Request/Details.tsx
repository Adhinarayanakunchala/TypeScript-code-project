import React, { useEffect, useState } from "react";
import Layout from "Component/Layout/Layout";
import DetailsClasses from "./orders.module.scss";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  GetRequestByIDService,
  ReadyToUseService,
} from "Services/SignupServices";
import moment from "moment";
import Loader from "Component/Loader/loader";
interface RequestDetails {
  requestId: number;
  patientName: string;
  bloodGroup: string;
  bloodComponent: string;
  quantity: number;
  ailment: string;
  orderDate: string;
  hospitalName: string;
  referredBy?: string;
}

function Details() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<RequestDetails | null>(null);
  const id = params.get("requestId");
  const [issueType, setIssueType] = useState<number>(0);
  const [addedProducts, setAddedProducts] = useState<RequestDetails[]>([]);

  // console.log(params.get("requestId"));

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await GetRequestByIDService(id);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Request);
        setIssueType(response?.data?.IssueStatus);
        setAddedProducts(response?.data?.AssignedProducts);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const addHandler = () => {
    if (issueType === 0) {
      navigate(`Inventory?requestId=${id}`);
      // navigate(`cross-match`);
    } else {
      Readytouse();
    }
  };

  const Readytouse = async () => {
    setLoading(false);
    try {
      const response = await ReadyToUseService(id);
      setLoading(false);
      if (response?.data?.Status === 1) {
        navigate("/pos/sale");
      }
    } catch (err: any) {
      setLoading(false);

      setErrorMsg(
        err?.response?.data?.Message || "Something went wrong try again later"
      );
    }
  };
  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <div>Error: {errorMsg}</div>
      ) : data ? (
        <div className={DetailsClasses["detail_container"]}>
          <header>
            <button onClick={() => navigate(-1)}>
              <IoMdArrowBack size={35} />
            </button>
            <h3>Request Details</h3>
          </header>
          {loading ? (
            <div>Loading...</div>
          ) : errorMsg ? (
            <div>Error: {errorMsg}</div>
          ) : data ? (
            <div className={DetailsClasses["Patient-details"]}>
              <div className={DetailsClasses["detail"]}>
                <h3>Patient Name</h3>
                <p>{data.patientName}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Blood Group</h3>
                <p>{data.bloodGroup}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Blood Component</h3>
                <p>{data.bloodComponent}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Quantity</h3>
                <p>{data.quantity} Units</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Ailment</h3>
                <p>{data.ailment}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Order Date</h3>
                <p>{moment(data.orderDate).format("MMMM Do YYYY")}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Referred By</h3>
                <p>{data.referredBy || "N/A"}</p>
              </div>
              <div className={DetailsClasses["detail"]}>
                <h3>Hospital Name</h3>
                <p>{data.hospitalName}</p>
              </div>
              {issueType === 1 && (
                <>
                  <div className={DetailsClasses["detail"]}>
                    <h3>Assigned Products</h3>
                    <p>{addedProducts.length} Units</p>
                  </div>
                  <div className={DetailsClasses["detail"]}>
                    <h3>Cross Match</h3>
                    <NavLink state={data.requestId} to={`cross-match`}>
                      Click here
                    </NavLink>
                  </div>
                </>
              )}
              <button onClick={addHandler}>
                {issueType === 1 ? "Ready to Issue" : "Check inventory"}
              </button>
            </div>
          ) : (
            <div>No data available.</div>
          )}
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </Layout>
  );
}

export default Details;
