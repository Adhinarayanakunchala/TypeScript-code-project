import { toast } from "react-toastify";
import swal from "sweetalert";

export const Success = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export const ConfirmationDiaolog = (
  Message,
  buttonText,
  isConfirmed,
  props
) => {
  swal(Message, {
    icon: "warning",
    dangerMode: true,
    buttons: {
      // cancel: "Cancel",
      catch: {
        text: buttonText,
        value: "Complete",
      },
      defeat: false,
    },
  }).then((value) => {
    switch (value) {
      case "Complete":
        isConfirmed(props);
        break;
      default:
    }
    // default: break
  });
};

export const Error = (message) => {
  toast.error(`${message}`, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export const Error_Dark = (message) => {
  toast.error(`${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const Success_Dark = (message) => {
  toast.success(`${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const SuccessSwal = (message, SubMessage) => {
  swal(message, SubMessage, "success");
};

export const warningSwal = (message, SubMessage) => {
  swal(message, SubMessage, "warning");
};
