import * as yup from "yup";

const signUpValidation = yup.object({
  username: yup
    .string()
    .required("Required")
    .matches(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/, {
      message:
        "Username can consist of alphanumeric characters, dot, underscore and hyphen (special characters must not be the first or last char and cannot appear consecutively), must be 5-20 characters long.",
      excludeEmptyString: true,
    }),
  password: yup
    .string()
    .required("Required")
    .matches(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
      {
        message:
          "Password must not contain any whitespaces, must have at least one uppercase letter, one lowercase character, one digit, one special character, and must be 10-16 characters long.",
        excludeEmptyString: true,
      }
    ),
  email: yup
    .string()
    .email("Must be a valid email.")
    .required("Required"),
  full_name: yup
    .string()
    .matches(/^[a-zA-Z\s]{4,30}$/, {
      message: "Name should have 4-30 characters, and contain only alphabets.",
      excludeEmptyString: true,
    })
    .required("Required"),
  phone: yup
    .string()
    .matches(/^[89]\d{7}$/, {
      message: "Please enter a valid Singapore phone number.",
      excludeEmptyString: true,
    })
    .required("Required"),
});

export default signUpValidation;
