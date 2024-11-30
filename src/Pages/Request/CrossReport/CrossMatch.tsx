import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import Layout from "Component/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "./schema";
import styles from "./index.module.css";
import { useLocation, useNavigate } from "react-router";
import { IoMdArrowBack } from "react-icons/io";
import { useState } from "react";
import { CrossMatchService } from "Services/SignupServices";
import Loader from "Component/Loader/loader";
import { SuccessSwal } from "Util/Toast";

interface FormValues {
  patientName: string;
  hospitalName: string;
  patientBloodGroup: string;
  rhesus: string;
  details: {
    bagNo: number;
    aboGroup: string;
    rhesus: string;
    compatibility: string;
    issuedTime: string;
    collectionDate: string;
    expiryDate: string;
    testingDate: string;
    segmentNo: number;
  }[];
}

function CrossMatch() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const requestId = location.state || {};
  const [errorMsg, setErrorMsg] = useState<string>("");
  const Navigate = useNavigate();
  console.log(requestId);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await CrossMatchService({ requestId, ...data });
      setLoading(false);
      if (response?.data?.Status === 1) {
        SuccessSwal("Cross match successfully ", response?.data?.Message);
        Navigate(-1);
        // Swal.fire({
        //   title: "CrossMatch Completed",
        //   allowEscapeKey: false,
        //   allowOutsideClick: false,
        //   text: "Cross Match Functionality has been successfully",
        //   icon: "success",
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "ok",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     Navigate(`/request/details?requestId=${requestId}`, {
        //       replace: true,
        //     });
        //   }
        // });
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
      {loading && <Loader />}
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.header}>
            <div className={styles.sub_header}>
              <button
                type="button"
                onClick={() => Navigate(-1)}
                className={styles.btn}
              >
                <IoMdArrowBack size={30} />
              </button>
              <h3>Cross Match Report</h3>
            </div>
            <div className={styles.dateinputs}>
              <label>
                No: <input type="text" />
              </label>
              <label>
                Date: <input type="text" />
              </label>
            </div>
          </div>
          <div className={styles.formdevider}>
            <div className={styles["form-group"]}>
              <label>Patient Name </label>
              <input
                type="text"
                {...register("patientName", {
                  required: "Patient name is required",
                })}
              />
              {errors.patientName && (
                <span className={styles.error}>
                  {errors.patientName.message}
                </span>
              )}
            </div>
            <div className={styles["sub_fromdevider"]}>
              <div className={styles["form-group"]}>
                <label>Hospital Name </label>
                <input
                  type="text"
                  {...register("hospitalName", {
                    required: "Hospital name is required",
                  })}
                />
                {errors.hospitalName && (
                  <span className={styles.error}>
                    {errors.hospitalName.message}
                  </span>
                )}
              </div>

              <div className={styles["form-group"]}>
                <label>Patient's ABO Blood Group </label>
                <input
                  type="text"
                  {...register("patientBloodGroup", {
                    required: "Blood group is required",
                  })}
                />
                {errors.patientBloodGroup && (
                  <span className={styles.error}>
                    {errors.patientBloodGroup.message}
                  </span>
                )}
              </div>

              <div className={styles["form-group"]}>
                <label>Rhesus (Rh) </label>
                <input
                  type="text"
                  {...register("rhesus", { required: "Rhesus is required" })}
                />
                {errors.rhesus && (
                  <span className={styles.error}>{errors.rhesus.message}</span>
                )}
              </div>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Bag No.</th>
                <th>ABO Group</th>
                <th>Rhesus (Rh)</th>
                <th>Compatibility</th>
                <th>Issued Time</th>
                <th>Date of Collection</th>
                <th>Date of Expiry</th>
                <th>Date of Testing</th>
                <th>Segment No.</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.bagNo`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.aboGroup`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.rhesus`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.compatibility`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.issuedTime`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.collectionDate`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.expiryDate`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.testingDate`)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`details.${index}.segmentNo`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.footer}>
            <div className={styles.footer1}>
              <label>
                Date & Time: <input type="text" />
              </label>
              <table className={styles.footer_table}>
                <thead>
                  <tr>
                    <th>Group & Cross match</th>
                    <th>Whole Blood</th>
                    <th>P.C.V</th>
                    <th>F.F.P</th>
                    <th>R.D.P / S.D.P</th>
                    <th>B.T set</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.footer1_lists}>
                <p>1. Lorem ipsum dolor sit amet consectetur.</p>
                <p>1. Lorem ipsum dolor sit amet consectetur.</p>
                <p>1. Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            </div>
            <div className={styles.footer2}>
              <label>
                Blood Centre Technician Signature: <input type="text" />
              </label>
              <div className={styles.footer2_content}>
                <p>As Screened from Blood Centre</p>
                <p>MP HBsAg : NEGATIVE</p>
                <p>VDRL, HIV I&II, HCV : NON-REACTIVE</p>
                <p>No Atypical Antibodies Detected</p>
              </div>
            </div>
          </div>
          <div className={styles.form_btn}>
            <button type="submit" className={styles.submit}>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default CrossMatch;
