import { Field, Formik, Form, ErrorMessage } from "formik";
import signUpValidation from "../../Validations/signUpValidation";
import axios from "axios";
import urlcat from "urlcat";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SERVER = process.env.REACT_APP_SERVER;
const SignUp = ({ user }) => {
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isPhoneUnique, setIsPhoneUnique] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.id !== undefined) {
      navigate("/items");
    }
  });

  const handleSignUp = (values) => {
    const url = urlcat(SERVER, "/users/");
    axios
      .post(url, values)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response.data.error.includes("username")) {
          setIsUsernameUnique(false);
        } else if (error.response.data.error.includes("email")) {
          setIsEmailUnique(false);
        } else if (error.response.data.error.includes("phone")) {
          setIsPhoneUnique(false);
        } else {
          console.log("Unable to set up user account.");
        }
      });
  };

  return (
    <div className="container items-center text-left w-44 sm:w-60 md:w-96 p-5 bg-base-200 rounded-box card">
      <Formik
        initialValues={{
          username: "",
          password: "",
          email: "",
          full_name: "",
          phone: "",
        }}
        validationSchema={signUpValidation}
        onSubmit={(values) => {
          handleSignUp(values);
          setIsUsernameUnique(true);
          setIsEmailUnique(true);
          setIsPhoneUnique(true);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <label className="label text-xs sm:text-sm font-medium">
              Username
            </label>
            <Field
              className="input input-bordered input-xs md:input-sm w-full text-xs"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            <label className="label py-1">
              <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                <ErrorMessage name="username" />
              </span>
            </label>
            <label className="label text-xs sm:text-sm font-medium">
              Password
            </label>
            <Field
              type="password"
              className="input input-bordered input-xs md:input-sm w-full text-xs"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <label className="label py-1">
              <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                <ErrorMessage name="password" />
              </span>
            </label>
            <label className="label text-xs sm:text-sm font-medium">
              Email
            </label>
            <Field
              className="input input-bordered input-xs md:input-sm w-full text-xs"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <label className="label py-1">
              <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                <ErrorMessage name="email" />
              </span>
            </label>
            <label className="label text-xs sm:text-sm font-medium">
              Full Name
            </label>
            <Field
              className="input input-bordered input-xs md:input-sm w-full text-xs"
              name="full_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.full_name}
            />
            <label className="label py-1">
              <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                <ErrorMessage name="full_name" />
              </span>
            </label>
            <label className="label text-xs sm:text-sm font-medium">
              Phone Number
            </label>
            <Field
              className="input input-bordered input-xs md:input-sm w-full text-xs"
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
            />
            <label className="label py-1">
              <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                <ErrorMessage name="phone" />
              </span>
            </label>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={
                !(
                  Object.keys(errors).length === 0 &&
                  Object.keys(touched).length !== 0
                )
              }
            >
              Sign up
            </button>
            {!isUsernameUnique && <p className="label-text-alt text-[10px] sm:text-[12px] pt-2 pl-2">Username has been taken.</p>}
            {!isEmailUnique && <p className="label-text-alt text-[10px] sm:text-[12px] pt-2 pl-2">Email already in use.</p>}
            {!isPhoneUnique && <p className="label-text-alt text-[10px] sm:text-[12px] pt-2 pl-2">Phone already in use.</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
