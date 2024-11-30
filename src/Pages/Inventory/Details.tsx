import React, { useState } from "react";
import Layout from "Component/Layout/Layout";
import DetailsClasses from "./orders.module.scss";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";

function Details() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  return (
    <Layout>
      <div className={DetailsClasses["detail_container"]}>
        <header>
          <button onClick={() => navigate(-1)}>
            <IoMdArrowBack size={35} />
          </button>
          <h3>Patient Details</h3>
        </header>
        <div className={DetailsClasses["Patient-details"]}>
          <div className={DetailsClasses["detail"]}>
            <h3>Patient Name</h3>
            <p>Gustavo Baptista</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Blood Group</h3>
            <p>Blood Type:AB-</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Blood Component</h3>
            <p>Whole Blood</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Quantity</h3>
            <p>2 Units</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Order Date</h3>
            <p>12 Dec 2024</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Referred By</h3>
            <p>Alfonso Schleifer</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Hospital Name</h3>
            <p>Levin Hospital</p>
          </div>
          <div className={DetailsClasses["detail"]}>
            <h3>Status</h3>
            <select>
              <option value="booked">Booked</option>
              <option value="Issued">Issued</option>
              <option value="Shipped">Shipped</option>
              <option value="Shipped">Delivered</option>
            </select>
          </div>
          <button> Update Changes</button>
        </div>
      </div>
    </Layout>
  );
}

export default Details;
