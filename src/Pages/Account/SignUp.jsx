import { Field, Formik, Form } from "formik";
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
    <>
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
            Username
            <br />
            <Field
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
            <br />
            Password
            <br />
            <Field
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <br />
            Email
            <br />
            <Field
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <br />
            Full Name
            <br />
            <Field
              name="full_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.full_name}
            />
            {errors.full_name && touched.full_name ? (
              <div>{errors.full_name}</div>
            ) : null}
            <br />
            Phone Number
            <br />
            <Field
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
            />
            {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}
            <br />
            <button
              type="submit"
              disabled={
                !(
                  Object.keys(errors).length === 0 &&
                  Object.keys(touched).length !== 0
                )
              }
              style={{ backgroundColor: "lime" }}
            >
              Sign up
            </button>
            {!isUsernameUnique && <p>Username has been taken.</p>}
            {!isEmailUnique && <p>Email already in use.</p>}
            {!isPhoneUnique && <p>Phone already in use.</p>}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
