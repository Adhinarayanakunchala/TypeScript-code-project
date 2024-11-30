import Layout from "Component/Layout/Layout";
import ProfileClasses from "Pages/Profile/profile.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoMdArrowBack } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import schema from "./schema";
import { useEffect, useState } from "react";
import {
  AddInventorys,
  BloodGroups,
  BloodgroupComponent,
} from "Services/SignupServices";
import moment from "moment";
import Loader from "Component/Loader/loader";
import { Success, SuccessSwal, warningSwal } from "Util/Toast";
type ProfileTypes = {
  bagNumber: string;
  bagSerialNumber: string;
  bloodGroupId: number;
  bloodComponentId: number;
  // quantity: number;
  expiryDate: string;
  collectionDate: string;
  pricePerUnit: number;
};

interface BloodGroups {
  bloodGroupId: number;
  bloodGroup: string;
}

interface BloodGroupComponent {
  bloodComponentId: number;
  bloodComponent: string;
}

function AddInventory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
    try {
      const response = await BloodGroups();
      // console.log(response);
      if (response?.data?.Status === 1) {
        setBloodGroups(response?.data?.BloodGroups);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      // setLoading(false);
      console.log(err);
    }
  };

  const Bloodgroupcomponents = async () => {
    try {
      const response = await BloodgroupComponent();

      console.log(response);
      if (response?.data?.Status === 1) {
        setBloodComponent(response?.data?.BloodComponents);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      // setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    Bloodgroups();
    Bloodgroupcomponents();
  }, []);

  const onSubmit: SubmitHandler<ProfileTypes> = async (data) => {
    console.log("data", data);
    setLoading(true);
    try {
      const response = await AddInventorys(data);
      console.log("response", response);
      setLoading(false);
      if (response?.data?.Status === 1) {
        navigate("/pos/inventory");
        SuccessSwal("Successfully added", response?.data?.Message);
      } else if (response?.data?.Status === 0) {
        warningSwal("Error", response?.data?.Message);
        setErrorMsg("Error");
      }
    } catch (err: any) {
      setLoading(false);
      warningSwal("Error", err?.response?.data?.Message);
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
    <Layout>
      {loading && <Loader />}
      <form
        className={ProfileClasses["Container"]}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={ProfileClasses["details"]}>
          <div className={ProfileClasses["header"]}>
            <button onClick={() => navigate(-1)}>
              <IoMdArrowBack size={35} />
            </button>
            <h3>Add Items</h3>
          </div>

          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="bagNumber">Bag Number</label>
            <div>
              <input
                className={
                  errors?.bagNumber ? ProfileClasses["input-error"] : ""
                }
                {...register("bagNumber")}
              />
              {errors.bagNumber && <span>{errors.bagNumber.message}</span>}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="bagSerialNumber">Bag SerialNumber</label>
            <div>
              <input
                className={
                  errors?.bagSerialNumber ? ProfileClasses["input-error"] : ""
                }
                {...register("bagSerialNumber")}
              />
              {errors.bagSerialNumber && (
                <span>{errors.bagSerialNumber.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Blood Group</label>
            <div>
              <select
                className={
                  errors?.bloodGroupId ? ProfileClasses["input-error"] : ""
                }
                {...register("bloodGroupId")}
              >
                <option value="">Select Blood Group </option>
                {bloodGroups.map((type) => (
                  <option key={type.bloodGroupId} value={type.bloodGroupId}>
                    {type.bloodGroup}
                  </option>
                ))}
              </select>
              {errors.bloodGroupId && (
                <span>{errors.bloodGroupId.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Blood Component</label>
            <div>
              <select
                className={
                  errors?.bloodComponentId ? ProfileClasses["input-error"] : ""
                }
                {...register("bloodComponentId")}
              >
                <option value="">Select Blood Component</option>
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
          {/* <div className={ProfileClasses["form-control"]}>
            <label htmlFor="quantity">Quantity</label>
            <div>
              <input
                type="number"
                className={
                  errors?.quantity ? ProfileClasses["input-error"] : ""
                }
                {...register("quantity")}
              />
              {errors.quantity && <span>{errors.quantity.message}</span>}
            </div>
          </div> */}
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="quantity">Bag Price</label>
            <div>
              <input
                type="number"
                className={
                  errors?.pricePerUnit ? ProfileClasses["input-error"] : ""
                }
                {...register("pricePerUnit")}
              />
              {errors.pricePerUnit && (
                <span>{errors.pricePerUnit.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="quantity">Collection Date</label>
            <div>
              <input
                className={
                  errors?.collectionDate ? ProfileClasses["input-error"] : ""
                }
                {...register("collectionDate")}
                // {
                //     setValueAs: (v) =>
                //       moment(v, "DD-MM-YYYY").format("YYYY-MM-DD"),
                //   })}
                type="date"
              />
              {errors.collectionDate && (
                <span>{errors.collectionDate.message}</span>
              )}
            </div>
          </div>
          {/* <div className={ProfileClasses["form-control"]}>
            <label htmlFor="quantity">Testing Date</label>
            <div>
              <input
                className={
                  errors?.testingDate ? ProfileClasses["input-error"] : ""
                }
                {...register("testingDate")}
                type="date"
              />
              {errors.testingDate && <span>{errors.testingDate.message}</span>}
            </div>
          </div> */}
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="quantity">expiry Date</label>
            <div>
              <input
                className={
                  errors?.expiryDate ? ProfileClasses["input-error"] : ""
                }
                {...register("expiryDate")}
                type="date"
              />
              {errors.expiryDate && <span>{errors.expiryDate.message}</span>}
            </div>
          </div>
        </div>

        <div className={ProfileClasses["Action-btns"]}>
          <p></p>
          <div>
            <button type="submit" className={ProfileClasses["Change-password"]}>
              Add Item
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default AddInventory;
