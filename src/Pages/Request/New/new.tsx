import Layout from "Component/Layout/Layout";
import ProfileClasses from "Pages/Profile/profile.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";

import schema from "./schema";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  AddrequestService,
  BloodGroups,
  BloodgroupComponent,
} from "Services/SignupServices";
import Loader from "Component/Loader/loader";
import { SuccessSwal } from "Util/Toast";
type ProfileTypes = {
  patientName: string;
  bloodGroupId: number;
  bloodComponentId: number;
  quantity: number;
  ailment: string;
  orderDate: string;
  hospitalName: string;
  referredBy?: string;
};

interface BloodGroups {
  bloodGroupId: number;
  bloodGroup: string;
}

interface BloodGroupComponent {
  bloodComponentId: number;
  bloodComponent: string;
}

function New() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bloodGroups, setBloodGroups] = useState<BloodGroups[]>([]);
  const [bloodComponent, setBloodComponent] = useState<BloodGroupComponent[]>(
    []
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileTypes>({
    resolver: yupResolver(schema),
  });

  const Bloodgroups = async () => {
    setLoading(true);
    try {
      const response = await BloodGroups();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setBloodGroups(response?.data?.BloodGroups);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  const Bloodgroupcomponents = async () => {
    setLoading(true);
    try {
      const response = await BloodgroupComponent();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setBloodComponent(response?.data?.BloodComponents);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    Bloodgroups();
    Bloodgroupcomponents();
  }, []);
  const onSubmit: SubmitHandler<ProfileTypes> = async (data) => {
    setLoading(true);
    try {
      const response = await AddrequestService(data);
      setLoading(false);
      if (response?.data?.Status === 1) {
        navigate(-1);
        SuccessSwal("Request created Succesfully", response?.data?.Message);
      }
    } catch (err: any) {
      setLoading(false);

      setErrorMsg(
        err?.response?.data?.Message || "Something went wrong try again later"
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <form
      className={ProfileClasses["Container"]}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={ProfileClasses["details"]}>
        <div className={ProfileClasses["form-control"]}>
          <label htmlFor="User Name">Patient Name</label>
          <div>
            <input
              className={
                errors?.patientName ? ProfileClasses["input-error"] : ""
              }
              type="text"
              {...register("patientName")}
              placeholder="Enter your name"
            />
            {errors.patientName && <span>{errors.patientName.message}</span>}
          </div>
        </div>
        <div className={ProfileClasses["form-control"]}>
          <label htmlFor="User Name">Blood Group</label>
          <div>
            <select
              className={
                errors?.bloodGroupId ? ProfileClasses["input-error"] : ""
              }
              // type="email"
              {...register("bloodGroupId")}
            >
              <option>Group</option>
              {bloodGroups.map((type) => (
                <option key={type.bloodGroupId} value={type.bloodGroupId}>
                  {type.bloodGroup}
                </option>
              ))}
            </select>
            {errors.bloodGroupId && <span>{errors.bloodGroupId.message}</span>}
          </div>
        </div>
        <div className={ProfileClasses["form-control"]}>
          <label htmlFor="User Name">Blood Component</label>
          <div>
            <select
              className={
                errors?.bloodComponentId ? ProfileClasses["input-error"] : ""
              }
              // type="email"
              {...register("bloodComponentId")}
            >
              <option>Blood Component</option>
              {bloodComponent.map((type) => (
                <option
                  key={type.bloodComponentId}
                  value={type.bloodComponentId}
                >
                  {type.bloodComponent}
                </option>
              ))}
            </select>
            {errors.bloodComponentId && (
              <span>{errors.bloodComponentId.message}</span>
            )}
          </div>
        </div>
      </div>
      {/* <div className={ProfileClasses["form-control"]}>
        <label htmlFor="User Name">Ailment</label>
        <div>
          <input
            className={errors?.ailment ? ProfileClasses["input-error"] : ""}
            type="text"
            {...register("ailment")}
          />
          {errors.ailment && <span>{errors.ailment.message}</span>}
        </div>
      </div> */}
      <div className={ProfileClasses["form-control"]}>
        <label htmlFor="User Name">Quantity</label>
        <div>
          <input
            className={errors?.quantity ? ProfileClasses["input-error"] : ""}
            type="number"
            {...register("quantity")}
          />
          {errors.quantity && <span>{errors.quantity.message}</span>}
        </div>
      </div>
      <div className={ProfileClasses["form-control"]}>
        <label htmlFor="User Name">Order Date</label>
        <div>
          <input
            className={errors?.orderDate ? ProfileClasses["input-error"] : ""}
            type="date"
            {...register("orderDate")}
          />
          {errors.orderDate && <span>{errors.orderDate.message}</span>}
        </div>
      </div>
      <div className={ProfileClasses["form-control"]}>
        <label htmlFor="User Name">Hospital Name</label>
        <div>
          <input
            className={
              errors?.hospitalName ? ProfileClasses["input-error"] : ""
            }
            type="text"
            {...register("hospitalName")}
          />
          {errors.hospitalName && <span>{errors.hospitalName.message}</span>}
        </div>
      </div>
      <div className={ProfileClasses["form-control"]}>
        <label htmlFor="User Name">Referred By</label>
        <div>
          <input
            className={errors?.referredBy ? ProfileClasses["input-error"] : ""}
            type="text"
            {...register("referredBy")}
          />
          {errors.referredBy && <span>{errors.referredBy.message}</span>}
        </div>
      </div>
      <div className={ProfileClasses["Action-btns"]}>
        <p></p>
        <div>
          <button style={{ display: "none" }}></button>
          <button type="submit">Add Request</button>
        </div>
      </div>
    </form>
  );
}

export default New;
