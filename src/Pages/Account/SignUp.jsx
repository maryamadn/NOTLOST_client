import { Field, Formik, Form, ErrorMessage } from "formik";
import signUpValidation from "../../Validations/signUpValidation";
import axios from "axios";
import urlcat from "urlcat";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SERVER = process.env.REACT_APP_SERVER;
const SignUp = () => {
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isPhoneUnique, setIsPhoneUnique] = useState(true);

  const navigate = useNavigate();

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
    <div className="container items-center text-center max-w-xs p-10 bg-base-300 rounded-box card">
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
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <br />
            <Field
              className="input input-bordered w-full max-w-xs input-sm"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            {/* {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null} */}
            <label className="label max-w-xs">
              <span className="label-text-alt">
                <ErrorMessage name="username" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <br />
            <Field
            type='password'
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
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <br />
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {/* {errors.email && touched.email ? <div>{errors.email}</div> : null} */}
            <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="email" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <br />
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
              name="full_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.full_name}
            />
            {/* {errors.full_name && touched.full_name ? (
              <div>{errors.full_name}</div>
            ) : null} */}
                        <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="full_name" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <br />
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
            />
            {/* {errors.phone && touched.phone ? <div>{errors.phone}</div> : null} */}
            <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="phone" />
              </span>
            </label>
            <br />
            <button
              type="submit"
              disabled={
                !(
                  Object.keys(errors).length === 0 &&
                  Object.keys(touched).length !== 0
                )
              }
              className="btn btn-accent"
            >
              Sign up
            </button>
            {!isUsernameUnique && <p>Username has been taken.</p>}
            {!isEmailUnique && <p>Email already in use.</p>}
            {!isPhoneUnique && <p>Phone already in use.</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
