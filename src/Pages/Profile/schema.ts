import * as yup from "yup";

const schema = yup.object().shape({
    userName: yup
        .string()
        .trim().required("Name is required")
        .matches(
            /^(?=.*[a-zA-Z])[a-zA-Z\s]+$/,
            "Name must contain only letters and spaces"
        ),
        
    email: yup.string().email("Invalid email").required("Email is required").matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must follow the standard email format"
      ),
    bloodBankEmail: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),
        bloodBankName: yup
        .string()
        .trim()
        .matches(
            /^(?=.*[a-zA-Z])[a-zA-Z\s]+$/,
            "Name must contain only letters and spaces"
        )
        .required("Name is required"),
        bloodBankMobileNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Invalid  Mobile Number")
        .required("Mobile number is required"),

        bloodBankAddress: yup.string().required("Address is required"),
        bloodBankTypeId: yup.number().required("Blood Bank Type is required"),
});

export const PasswordSchema = yup.object().shape({

    
    oldPassword: yup.string().required("Current Password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export default schema;
