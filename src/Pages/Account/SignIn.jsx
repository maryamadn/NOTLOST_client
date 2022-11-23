import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import urlcat from "urlcat";
import signInValidation from "../../Validations/signInValidation";
import axios from "axios";
import { useEffect } from "react";

const SERVER = process.env.REACT_APP_SERVER;
const SignIn = ({ user, setUser }) => {
  const [signInSuccessful, setSignInSuccessful] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id !== undefined) {
    navigate("/items")
    }
  });

  //to decode token
  const parseJwt = (token) => {
    if (token === "") {
      return {};
    }
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  const handleSignIn = (values) => {
    const url = urlcat(SERVER, "/users/signin");
    axios
      .post(url, values)
      .then(({ data }) => {
        const user = parseJwt(data.token);
        setUser(user);
        navigate("/items");
      })
      .catch((error) => {
        if (error.response.data.error === "Validation failed.") {
          setSignInSuccessful(false);
        }
      });
  };

  return (
    <div className="container items-center text-left w-44 sm:w-60 md:w-96 p-5 bg-base-200 rounded-box card">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={signInValidation}
        onSubmit={(values) => {
          handleSignIn(values);
          setSignInSuccessful(true);
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
              Sign in
            </button>
            {!signInSuccessful && <p className="label-text-alt text-[10px] sm:text-[12px] pt-2 pl-2">Sign in failed.</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
