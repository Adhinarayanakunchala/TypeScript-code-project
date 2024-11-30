import { useLayoutEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginStyles from "Pages/Login/Login.module.scss";
import ReactLoading from "react-loading";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "./Schema";
import { useNavigate } from "react-router";
import { LoginService } from "Services/SignupServices";
import ApiService from "Services/config";

import { IoEye, IoEyeOff } from "react-icons/io5";
import { warningSwal } from "Util/Toast";
type LoginForm = {
  email: string;
  password: string;
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [Errormsg, setErrorMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  useLayoutEffect(() => {
    const token = localStorage.getItem("Token");

    if (token) {
      navigate("/pos/sale");
    }
  }, []);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    try {
      const response = await LoginService(data.email, data.password);
      setLoading(false);
      if (response?.data?.Status === 1) {
        ApiService.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.Token}`;
        localStorage.setItem("Token", response?.data?.Token);
        navigate("/pos/sale");
        localStorage.setItem("BankName", response?.data?.BloodBankName);
        /*     localStorage.setItem(
                    "AdminData",
                    JSON.stringify(response?.data?.AdminDetails)
                ); */
      }
    } catch (err: any) {
      setLoading(false);
      warningSwal("Warning", err?.response?.data?.Message);
    }
  };
  return (
    <div className={LoginStyles["Container"]}>
      <h2>You have the power to save a life</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Login</h3>
        <div className={LoginStyles["form_control"]}>
          <label
            htmlFor="Email"
            style={{ color: errors?.email ? "red" : "initial" }}
          >
            Email
          </label>
          <input
            className={errors?.email ? LoginStyles["input-error"] : ""}
            type="email"
            {...register("email")}
            placeholder="Enter Your Email"
          />

          {errors.email && <span>{errors?.email?.message}</span>}
        </div>
        <div className={LoginStyles["form_control"]}>
          <label
            htmlFor="Password"
            style={{ color: errors?.password ? "red" : "initial" }}
          >
            Password
          </label>
          <input
            className={errors?.password ? LoginStyles["input-error"] : ""}
            {...register("password")}
            type={hidePassword ? "password" : "text"}
            placeholder="Enter Password"
          />
          <p className={LoginStyles["icons"]}>
            {hidePassword ? (
              <IoEye onClick={() => setHidePassword(false)} />
            ) : (
              <IoEyeOff onClick={() => setHidePassword(true)} />
            )}
          </p>
          {errors.password && <span>{errors?.password?.message}</span>}
          {/* {Errormsg?.length > 0 && (
            <p
              style={{
                color: "red",
                fontSize: "0.9rem",
              }}
            >
              {Errormsg}
            </p>
          )} */}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <ReactLoading color="white" type="spokes" height={20} width={20} />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
