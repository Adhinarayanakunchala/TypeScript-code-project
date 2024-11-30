import * as yup from "yup";

const schema = yup.object().shape({
    patientName: yup
        .string()
        .trim()
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/, "only letters are allowed")
        .required("Patient Name is required"),
        hospitalName: yup
        .string()
        .trim()
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/, "only letters are allowed")
        .required("Hospital Name is required"),
        bloodGroupId: yup.number().required("Blood Group is required"),
        bloodComponentId: yup.number().required("Blood Component is required"),
        ailment: yup.string().required("aliment is required"),
        quantity: yup.number().required("quantity is requires"),
        orderDate: yup.string().required("date is requires"),
});

export const PasswordSchema = yup.object().shape({
    currentPassword: yup.string().required("Current Password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export default schema;
