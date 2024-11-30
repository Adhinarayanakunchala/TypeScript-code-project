import { useEffect, useState } from "react";
import Cartclasses from "./Cart.module.scss";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import {
  AddCart,
  CartService,
  DocumentUploader,
  PlaceOrder,
} from "Services/SignupServices";
import blood from "Assets/pos_blood.svg";

import { IoMdMedkit } from "react-icons/io";
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronUp,
  FaTicketAlt,
} from "react-icons/fa";
import { TextField } from "@mui/material";
import { Success, SuccessSwal, warningSwal } from "Util/Toast";
import { MdDelete } from "react-icons/md";

type ProfileTypes = {
  patientName: string;
  hospitalName: string;
  referredBy?: string;
  documentId?: string;
};

interface OrderItem {
  price: number;
  units: number;
  inventoryId: number;
  bloodGroup: string;
  bloodBankId: number;
  pricePerUnit: number;
  bloodBankName: string;
  bloodComponent: string;
  bloodGroupComponentId: number;
}
type props = {
  reload: boolean;
  setReloadAgain: React.Dispatch<React.SetStateAction<boolean>>;
};
const Cart: React.FC<props> = ({ reload, setReloadAgain }) => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [data, setOrderItems] = useState<OrderItem[]>([]);
  const [emptycart, setEmptycart] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");
  const [cartId, setCartID] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<number>();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ProfileTypes>({});

  const fetchData = async () => {
    try {
      const res = await CartService();
      setReloadAgain((prev) => !prev);
      if (res?.data?.Status === 1) {
        setCartID(res?.data?.Cart.cartId);
        setOrderItems(res?.data?.Cart?.items);
        setTotalAmount(res?.data?.TotalAmount);
        // setReloadAgain((prev) => !prev);
        setEmptycart("");
      } else if (res?.data?.Status === 0) {
        setEmptycart(res?.data?.Message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);
  console.log(emptycart);
  useEffect(() => {
    if (emptycart) {
      reset();
    }
  }, [emptycart]);
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const filename = file.name;
      const fileType = file.type;

      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(fileType)) {
        warningSwal("Invalid file type", " Only JPG and PDF files are allowed");
        return;
      }
      const response = await DocumentUploader(filename);

      if (response?.data?.Status === 1) {
        const documentresponse = await fetch(response?.data?.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        })
          .then((data) => {
            console.log("data :>> ", data);
            const uploadedFileUrl = new URL(data.url);

            const uploadedFileName =
              uploadedFileUrl.pathname.split("/Documents/")[1];
            setValue("documentId", uploadedFileName);
          })
          .catch((error) => {
            console.log("Error: ", error);
          });
      }
    }
  };

  const onSubmit = async (bodydata: any) => {
    if (bodydata.patientName && bodydata.hospitalName) {
      let body = {
        cartId: cartId,
        patientName: bodydata.patientName,
        hospitalName: bodydata.hospitalName,
        referredBy: bodydata.referredBy,
        documentId: bodydata.documentId,
        paymentType: paymentMode === "cash" ? 0 : 1,
      };
      setLoading(true);
      try {
        const response = await PlaceOrder(body);
        setLoading(false);
        if (response?.data?.Status === 1) {
          SuccessSwal("Order Placed", response?.data?.Message);
          reset({
            patientName: "",
            hospitalName: "",
            referredBy: "",
            documentId: "",
          });
          Navigate("/pos/orders");
        } else {
          Error(response?.data?.Message);
        }
      } catch (err: any) {
        setLoading(false);
        warningSwal("warning", err?.response?.data?.Message);
        setErrorMsg(
          err?.response?.data?.Message || "Something went wrong try again later"
        );
      }
    } else {
      console.log(bodydata);
      setShowPatientDetails(true);
      setError("hospitalName", { message: "hospitalName is required" });
      setError("patientName", { message: "patientName is required" });
    }
  };

  const updateQuantity = async (
    inventoryId: number,
    bloodGroupComponentId: number,
    units: number
  ) => {
    let body = {
      inventoryId,
      bloodGroupComponentId,
      units,
    };
    setLoading(true);
    try {
      const res = await AddCart(body);
      setLoading(false);
      if (res?.data?.Status === 1) {
        await fetchData();

        // SuccessSwal("success", res?.data?.Message);
      } else {
        Error(res?.data?.Message);
      }
    } catch (err: any) {
      setLoading(false);
      warningSwal("Alert", err?.response?.data?.Message);
      console.log(err);
    }
  };

  const increaseQuantity = (
    inventoryId: number,
    bloodGroupComponentId: number,
    currentUnits: number
  ) => {
    updateQuantity(inventoryId, bloodGroupComponentId, currentUnits + 1);
    SuccessSwal("success", "Item Added");
  };

  const decreaseQuantity = (
    inventoryId: number,
    bloodGroupComponentId: number,
    currentUnits: number
  ) => {
    const newUnits = currentUnits - 1;
    updateQuantity(inventoryId, bloodGroupComponentId, newUnits);
    SuccessSwal("success", "Item Deleted");
  };

  return (
    <div className={Cartclasses["Container"]}>
      {emptycart ? (
        <div className={Cartclasses["empty_cart"]}>
          <p>
            <FaCartPlus size={40} />
          </p>
          <span>{emptycart}</span>
        </div>
      ) : (
        <>
          <div className={Cartclasses["orders_container"]}>
            <h1>
              <IoMdMedkit />
              Order Number
            </h1>
            <div className={Cartclasses["items"]}>
              {data.map((item) => (
                <div className={Cartclasses["item_container"]}>
                  <div className={Cartclasses["item_sub_container"]}>
                    <div className={Cartclasses["item_imag_container"]}>
                      <img src={blood} alt="Blood Image" />
                    </div>
                    <div className={Cartclasses["item_img"]}>
                      <p>Blood Type : {item.bloodGroup}</p>
                      <p>{item.bloodComponent}</p>
                    </div>
                  </div>
                  <h3 className={Cartclasses["price_text"]}>₹ {item.price}</h3>
                  <div className={Cartclasses["item_btns"]}>
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.inventoryId,
                          item.bloodGroupComponentId,
                          item.units
                        )
                      }
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={Cartclasses["amount"]}>
              <h4>TotalAmount</h4>
              <h4>₹{totalAmount}</h4>
              <h4></h4>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={Cartclasses.header_title}
              onClick={() => setShowPatientDetails(!showPatientDetails)}
            >
              <h1>
                <IoMdMedkit />
                Patient Details
              </h1>
              {showPatientDetails ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showPatientDetails && (
              <div className={Cartclasses.details_content}>
                <div className={Cartclasses["form-control"]}>
                  <div>
                    <TextField
                      fullWidth
                      id="fullWidth"
                      label="Patient Name"
                      size="small"
                      className={
                        errors?.patientName ? Cartclasses["input-error"] : ""
                      }
                      type="text"
                      {...register("patientName", {
                        required: "Patient Name is required",
                      })}
                      placeholder="Enter patient name"
                    />
                    {errors.patientName && (
                      <span className={Cartclasses["input-error"]}>
                        {errors.patientName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className={Cartclasses["form-control"]}>
                  {/* <label htmlFor="User Name">Hospital Name</label> */}
                  <div>
                    <TextField
                      fullWidth
                      id="fullWidth"
                      label="Hospital Name"
                      size="small"
                      className={
                        errors?.hospitalName ? Cartclasses["input-error"] : ""
                      }
                      type="text"
                      {...register("hospitalName", {
                        required: "Hospital Name is required",
                      })}
                    />
                    {errors.hospitalName && (
                      <span className={Cartclasses["input-error"]}>
                        {errors.hospitalName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className={Cartclasses["form-control"]}>
                  {/* <label htmlFor="User Name">Referred By</label> */}
                  <div>
                    <TextField
                      fullWidth
                      id="fullWidth"
                      label="Referred By"
                      size="small"
                      className={
                        errors?.referredBy ? Cartclasses["input-error"] : ""
                      }
                      type="text"
                      {...register("referredBy", { required: false })}
                    />
                    {errors.referredBy && (
                      <span className={Cartclasses["input-error"]}>
                        {errors.referredBy.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className={Cartclasses["form-control"]}>
                  <label htmlFor="document">Document</label>
                  <div>
                    <TextField
                      placeholder="Document  (optional)"
                      fullWidth
                      id="fullWidth"
                      type="file"
                      onChange={handleFileChange}
                    />
                    {errors.documentId && (
                      <span>{errors.documentId.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div
              className={Cartclasses["header_title"]}
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            >
              <h1>
                <FaTicketAlt />
                Payment Details
              </h1>
              {showPaymentDetails ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className={Cartclasses["Patient_details"]}>
              {showPaymentDetails && (
                <div
                  className={`${Cartclasses["form-data"]} ${Cartclasses["payment-details"]} `}
                >
                  <label
                    style={{
                      color: paymentMode === "cash" ? "red" : "initial",
                    }}
                  >
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMode === "cash"}
                      onChange={() => setPaymentMode("cash")}
                    />
                    Cash Payment
                  </label>
                  <label
                    style={{
                      color: paymentMode === "online" ? "red" : "initial",
                    }}
                  >
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMode === "online"}
                      onChange={() => setPaymentMode("online")}
                    />
                    Online Payment
                  </label>
                </div>
              )}
              {/* {paymentMode === "online" && (
              <div
                className={Cartclasses["form-data"]}
                style={{ gap: "0.3rem" }}
              >
                <label htmlFor="Buyer Name">Buyer Number</label>
                <div className={Cartclasses["payment-link"]}>
                  <input type="number" placeholder="Mobile Number" />
                  <button>Send Payment Link</button>
                </div>
              </div>
            )} */}
            </div>
            <button type="submit" className={Cartclasses["submit"]}>
              Confirm
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Cart;
