import * as yup from "yup";

const signInValidation = yup.object({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
});

export default signInValidation;
