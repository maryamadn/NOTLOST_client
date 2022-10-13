import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import urlcat from "urlcat";
import signInValidation from "../../Validations/signInValidation";
import axios from "axios";

const SERVER = process.env.REACT_APP_SERVER;
const SignIn = ({ setUser }) => {
  const [signInSuccessful, setSignInSuccessful] = useState(true);

  const navigate = useNavigate();

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
        console.log(user);
        navigate("/items");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.error === "Validation failed.") {
          setSignInSuccessful(false);
        } else {
          console.log("Unable to sign in.");
        }
      });
  };

  return (
    <div className="container items-center text-center max-w-fit p-10 bg-base-300 rounded-box card">
      <Formik
      className="container items-center text-center"
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
            <br />
            <div className="text-center">
            <Field
            placeholder='username'
            className="input input-bordered w-full max-w-xs input-sm"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            
            {errors.username && touched.username ? (
              <div className="label-text-alt mt-3 text-left">{errors.username}</div>
            ) : null}
            </div>
                                    {/* <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="username" />
              </span>
            </label> */}
            <br />
            <Field
            type='password'
            placeholder='password'
            className="input input-bordered w-full max-w-xs input-sm"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {/* {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null} */}
                        <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="password" />
              </span>
            </label>
            <br />
            <button
              type="submit"
              className="btn btn-outline btn-ghost"
              disabled={
                !(
                  Object.keys(errors).length === 0 &&
                  Object.keys(touched).length !== 0
                )
              }
            >
              Sign in
            </button>
            {!signInSuccessful && <p>Sign in failed.</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
