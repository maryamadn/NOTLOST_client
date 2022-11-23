import { Field, Formik, Form, ErrorMessage } from "formik";

import axios from "axios";
import urlcat from "urlcat";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import editUserValidation from "../../Validations/editUserValidation";

const SERVER = process.env.REACT_APP_SERVER;

const Settings = ({user, setUser}) => {
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isPhoneUnique, setIsPhoneUnique] = useState(true);
  
  const navigate = useNavigate()

  useEffect(() => {
    if (user.id === undefined) {
      navigate('/error')
    }
  })


  const handleEditUser = (values) => {
    const url = urlcat(SERVER, `/users/${user.id}`);
    axios
      .put(url, values)
      .then(({data}) => {
        setUser(data)
      })
      .catch((error) => {
        if (error.response.data.error.includes("username")) {
          setIsUsernameUnique(false);
        } else if (error.response.data.error.includes("email")) {
          setIsEmailUnique(false);
        } else if (error.response.data.error.includes("phone")) {
          setIsPhoneUnique(false);
        } else {
          console.log("Unable to edit user details.");
        }
      });
  };

  return (
    <>
    <p className="text-sm sm:text-lg md:text-xl text-center font-bold mb-20">SETTINGS</p>
    <div className="container items-center text-center max-w-xs p-10 bg-base-300 rounded-box card">
    <Formik
    className="container items-center text-center"
    initialValues={{
      username: user.username,
      password: "",
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
    }}
    validationSchema={editUserValidation}
    onSubmit={(values) => {
      handleEditUser(values);
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
            <Field
              className="input input-bordered w-full max-w-xs input-sm"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              />
            <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="username" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
            type='password'
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            />
                        <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="password" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            />
            <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="email" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
            name="full_name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.full_name}
            />
                        <label className="label">
              <span className="label-text-alt">
                <ErrorMessage name="full_name" />
              </span>
            </label>
            <br />
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
            name="phone"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
            />
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
                className="btn btn-ghost"
                >
              Submit Edit
            </button>
            {!isUsernameUnique && <p>Username has been taken.</p>}
            {!isEmailUnique && <p>Email already in use.</p>}
            {!isPhoneUnique && <p>Phone already in use.</p>}
          </Form>
        )}
      </Formik>
    </div>
        </>
  )
};

export default Settings;
