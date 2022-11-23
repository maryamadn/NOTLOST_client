import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

const notifyItemDetailsEdited = () => {
  toast("Item Details Edited!", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default notifyItemDetailsEdited;