import Layout from "Component/Layout/Layout";
import ProfileClasses from "./profile.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import schema from "./schema";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  ProfileService,
  ProfileUpdate,
  BloodBankTypes,
} from "Services/SignupServices";
import Loader from "Component/Loader/loader";
import { SuccessSwal, warningSwal } from "Util/Toast";

type ProfileTypes = {
  email: string;
  userName: string;
  bloodBankEmail: string;
  bloodBankName: string;
  bloodBankMobileNumber: string;
  bloodBankAddress: string;
  bloodBankTypeId: number;
};
interface BankTypes {
  bloodBankTypeId: number;
  bloodBankType: string;
}
function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bankTypes, setBankTypes] = useState<BankTypes[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileTypes>({
    resolver: yupResolver(schema),
  });

  const ProfileDetails = async () => {
    setLoading(true);
    try {
      const response = await ProfileService();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        const userData = response?.data?.User;
        reset({
          userName: userData.userName,
          email: userData.email,
          bloodBankName: userData.bloodBankName,
          bloodBankTypeId: userData.bloodBankTypeId,
          bloodBankAddress: userData.bloodBankAddress,
          bloodBankEmail: userData.bloodBankEmail,
          bloodBankMobileNumber: userData.bloodBankMobileNumber,
        });
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  const bloodbankTypes = async () => {
    setLoading(true);
    try {
      const response = await BloodBankTypes();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setBankTypes(response?.data?.BloodBankTypes);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    ProfileDetails();
    bloodbankTypes();
  }, []);

  const onSubmit: SubmitHandler<ProfileTypes> = async (data) => {
    setLoading(true);
    try {
      const response = await ProfileUpdate(data);
      setLoading(false);
      if (response?.data?.Status === 1) {
        SuccessSwal("Profile updated successfully", response?.data?.Message);
      }
    } catch (err: any) {
      setLoading(false);
      warningSwal("warning", err?.response?.data?.Message);
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
          <h3>Profile Details</h3>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">User Name</label>
            <div>
              <input
                className={
                  errors?.userName ? ProfileClasses["input-error"] : ""
                }
                type="text"
                {...register("userName")}
                placeholder="Enter your name"
              />
              {errors.userName && <span>{errors.userName.message}</span>}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Email</label>
            <div>
              <input
                className={errors?.email ? ProfileClasses["input-error"] : ""}
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
          </div>
        </div>
        <div className={ProfileClasses["details"]}>
          <h3>Blood Bank Details</h3>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Blood Bank Name</label>
            <div>
              <input
                className={
                  errors?.bloodBankName ? ProfileClasses["input-error"] : ""
                }
                type="text"
                {...register("bloodBankName")}
                placeholder="Enter  Blood bank name"
                disabled
              />
              {errors.bloodBankName && (
                <span>{errors.bloodBankName.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Type</label>
            <div>
              <select
                defaultValue={""}
                className={
                  errors?.bloodBankTypeId ? ProfileClasses["input-error"] : ""
                }
                {...register("bloodBankTypeId")}
                disabled
              >
                <option value="" disabled>
                  Select Blood Bank Type
                </option>
                {bankTypes.map((type) => (
                  <option
                    key={type.bloodBankTypeId}
                    value={type.bloodBankTypeId}
                  >
                    {type.bloodBankType}
                  </option>
                ))}
              </select>
              {errors.bloodBankTypeId && (
                <span>{errors.bloodBankTypeId.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="Email">Email</label>
            <div>
              <input
                className={
                  errors?.bloodBankEmail ? ProfileClasses["input-error"] : ""
                }
                type="email"
                {...register("bloodBankEmail")}
                placeholder="Enter  Blood bank Email"
                disabled
              />
              {errors.bloodBankEmail && (
                <span>{errors.bloodBankEmail.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Mobile number</label>
            <div>
              <input
                className={
                  errors?.bloodBankMobileNumber
                    ? ProfileClasses["input-error"]
                    : ""
                }
                type="number"
                {...register("bloodBankMobileNumber")}
                placeholder="Enter mobile number"
                disabled
              />
              {errors.bloodBankMobileNumber && (
                <span>{errors.bloodBankMobileNumber.message}</span>
              )}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="Address">Address</label>
            <div>
              <textarea
                className={
                  errors?.bloodBankAddress ? ProfileClasses["input-error"] : ""
                }
                rows={4}
                {...register("bloodBankAddress")}
                placeholder="Enter BloodBank Address"
                disabled
              />
              {errors.bloodBankAddress && (
                <span>{errors.bloodBankAddress.message}</span>
              )}
            </div>
          </div>
        </div>
        <div className={ProfileClasses["Action-btns"]}>
          <p></p>
          <div>
            <button
              className={ProfileClasses["Change-password-btn"]}
              type="button"
              onClick={() => {
                navigate("/pos/profile/update-password");
              }}
            >
              Change Password
            </button>
            <button type="submit">Update Profile</button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default Profile;
