import Layout from "Component/Layout/Layout";
import ProfileClasses from "./profile.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoMdArrowBack } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { PasswordSchema } from "./schema";
import { changePassword } from "Services/SignupServices";
import { useState } from "react";
import Loader from "Component/Loader/loader";
import { SuccessSwal, warningSwal } from "Util/Toast";
import { IoEye, IoEyeOff } from "react-icons/io5";

type ProfileTypes = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [visable, setVisable] = useState<boolean>(true);
  const [visabled, setVisabled] = useState<boolean>(true);
  const [visual, setVisual] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileTypes>({
    resolver: yupResolver(PasswordSchema),
  });

  const onSubmit: SubmitHandler<ProfileTypes> = async (data) => {
    // console.log(data);
    setLoading(true);
    try {
      const response = await changePassword(data.oldPassword, data.newPassword);
      setLoading(false);
      if (response?.data?.Status === 1) {
        SuccessSwal("Password updated successfully", response?.data?.Message);
        navigate(-1);
      }
    } catch (err: any) {
      setLoading(false);
      warningSwal("warning", err?.response?.data?.Message);
      // setErrorMsg(
      //   err?.response?.data?.Message || "Something went wrong try again later"
      // );
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
            <button onClick={() => navigate(-1)} type="button">
              <IoMdArrowBack size={35} />
            </button>
            <h3>Change Password</h3>
          </div>

          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">Current password</label>
            <div>
              <input
                className={
                  errors?.oldPassword ? ProfileClasses["input-error"] : ""
                }
                type={visual ? "password" : "text"}
                {...register("oldPassword")}
                placeholder="Enter Current Password"
              />
              <p className={ProfileClasses["icons"]}>
                {visual ? (
                  <IoEye onClick={() => setVisual(false)} />
                ) : (
                  <IoEyeOff onClick={() => setVisual(true)} />
                )}
              </p>

              {errors.oldPassword && <span>{errors.oldPassword.message}</span>}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">new Password</label>
            <div>
              <input
                className={
                  errors?.newPassword ? ProfileClasses["input-error"] : ""
                }
                type={visabled ? "password" : "text"}
                {...register("newPassword")}
                placeholder="Enter new password"
              />
              <p className={ProfileClasses["icons"]}>
                {visabled ? (
                  <IoEye onClick={() => setVisabled(false)} />
                ) : (
                  <IoEyeOff onClick={() => setVisabled(true)} />
                )}
              </p>
              {errors.newPassword && <span>{errors.newPassword.message}</span>}
            </div>
          </div>
          <div className={ProfileClasses["form-control"]}>
            <label htmlFor="User Name">confirm Password</label>
            <div>
              <input
                className={
                  errors?.confirmPassword ? ProfileClasses["input-error"] : ""
                }
                type={visable ? "password" : "etxt"}
                {...register("confirmPassword")}
                placeholder="confirm password"
              />
              <p className={ProfileClasses["icons"]}>
                {visable ? (
                  <IoEye onClick={() => setVisable(false)} />
                ) : (
                  <IoEyeOff onClick={() => setVisable(true)} />
                )}
              </p>
              {errors.confirmPassword && (
                <span>{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className={ProfileClasses["Action-btns"]}>
          <p></p>
          <div>
            <button type="submit" className={ProfileClasses["Change-password"]}>
              Change Password
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default Profile;
