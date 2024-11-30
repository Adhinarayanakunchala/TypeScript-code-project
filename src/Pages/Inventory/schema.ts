import * as yup from "yup";

export const schema = yup.object().shape({
    bloodGroupId: yup.number().required("Blood group is required")
    .typeError("Select a BloodGroup ").integer("Blood group id must be an integer"),
     bagNumber: yup.string().required("Bag Number is required"),
    //  .matches(/^[a-zA-Z0-9]*$/, "Bag Number can only contain letters and numbers")
     bagSerialNumber: yup.string().required("Bag SerialNumber is required") ,
    bloodComponentId: yup.number().typeError("Select a Blood Component").required("Blood Component is required"),
    // quantity: yup
    //     .number()
    //     .typeError("Quantity must be a number")
    //     .required("Quantity is required")
    //     .positive("Quantity must be greater than zero")
    //     .integer("Quantity must be an integer"),

        pricePerUnit: yup
        .number()
        .typeError("Price must be a number")
        .required("Price is required")
        .positive("Price must be greater than zero")
        .integer("Price must be an integer"),
        expiryDate: yup
        .string()
        .required("Expiry date is required")
        .test("expiry", "Expiry date must be in the future", (value) => {
            if (!value) return false;

            const currentDate = new Date();
            const selectedDate = new Date(value);

            return selectedDate > currentDate;
        }),
        // testingDate: yup
        // .string()
        // .required("Testing date is required"),
        // // .test("expiry", "Expiry date must be in the future", (value) => {
        // //     if (!value) return false;

        // //     const currentDate = new Date();
        // //     const selectedDate = new Date(value);

        // //     return selectedDate > currentDate;
        // // }),
        collectionDate: yup
        .string()
        .required("Collection date is required"),
        // .test("expiry", "Expiry date must be in the future", (value) => {
        //     if (!value) return false;

        //     const currentDate = new Date();
        //     const selectedDate = new Date(value);

        //     return selectedDate > currentDate;
        // }),
});

export default schema;
