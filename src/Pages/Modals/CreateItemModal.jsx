import urlcat from "urlcat";
import axios from "axios";
import { useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";

import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import createItemValidation from "../../Validations/createItemValidation";
import PhotoUpload from "../../Components/PhotoUpload";

const SERVER = process.env.REACT_APP_SERVER;

const CreateItemModal = ({ setRenderItems, renderItems, user }) => {
  const [createItemSuccessful, setCreateItemSuccessful] = useState(true);
  const [photosUploaded, setPhotosUploaded] = useState(true);
  const [imagesSelected, setImagesSelected] = useState({});
  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "select",
    status: "Unresolved",
    catSubcat: "select",
    colour: "select",
    description: "",
    last_location: "",
    date_time: "", //problem: database save as diff timzone
    found_lost_by: user.id,
  });

  const handleCreateItem = async (values) => {
    const url = urlcat(SERVER, "/items/");

    values.date_time = new Date();
    await axios
      .post(url, values)
      .then(({ data }) => {
        const item_id = data[0][0];
        const formData = new FormData();
        const files = Object.values(imagesSelected);

        files.map((file) => {
          formData.append("file", file);
          formData.append("upload_preset", "bb4akto2");
          axios
            .post(
              "https://api.cloudinary.com/v1_1/a6cbnsd/image/upload",
              formData
            )
            .then(({ data }) => {
              const valuesPhotos = {
                item_id,
                photo: "",
              };
              valuesPhotos.photo = data.secure_url;

              const urlPhotos = urlcat(SERVER, "/photos/");
              axios
                .post(urlPhotos, valuesPhotos)
                .then(({ data }) => {
                  setRenderItems(!renderItems);
                  setCreateItemSuccessful(true);
                  setInitialValues();
                  document.getElementById("create-item-modal").checked = false;
                  document.getElementById("fileInput").value = "";
                })
                .catch((error) => {
                  console.log(error);
                  setCreateItemSuccessful(false);
                });
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => {
        console.log(error);
        setCreateItemSuccessful(false);
      });
  };

  return (
    <div>
      <h1 className="font-bold text-sm md:text-lg">Report Lost/Found Item</h1>
      {user.id ? (
        <Formik
          initialValues={initialValues}
          validationSchema={createItemValidation}
          onSubmit={(values, { resetForm }) => {
            const showPosition = (position) => {
              const location = `${position.coords.latitude}, ${position.coords.longitude}`;
              values.last_location = location;
            };
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
            } else {
              console.log("not supported");
            }
            handleCreateItem(values);
            resetForm();
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form className="container w-44 sm:w-60 md:w-96">
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Title
              </label>
              <Field
                className="input input-bordered input-xs md:input-sm w-full"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                placeholder="Title"
              />
              <label className="label py-1">
                <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  <ErrorMessage name="title" />
                </span>
              </label>
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Description
              </label>
              <textarea
                className="textarea textarea-bordered text-xs md:text-sm px-2 md:px-3 w-full"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                placeholder="Description"
              />
              <label className="label py-1">
                <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  <ErrorMessage name="description" />
                </span>
              </label>
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Item Type
              </label>
              <Field
                className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
                as="select"
                name="type"
                value={values.type}
                onChange={handleChange}
              >
                <option disabled>select</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </Field>
              <label className="label py-1">
                <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  <ErrorMessage name="type" />
                </span>
              </label>
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Category/Subcategory
              </label>
              <Field
                className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
                as="select"
                name="catSubcat"
                value={values.catSubcat}
                onChange={handleChange}
              >
                <option disabled>select</option>
                {catsubcatFilters.map((filter) => {
                  const key = Object.keys(filter)[0];
                  return (
                    <optgroup label={key} style={{ fontWeight: "bold" }}>
                      {filter[key].map((value) => (
                        <option value={key + "|" + value}>{value}</option>
                      ))}
                    </optgroup>
                  );
                })}
              </Field>
              <label className="label py-1">
                <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  <ErrorMessage name="catSubcat" />
                </span>
              </label>
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Colour
              </label>
              <Field
                className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
                as="select"
                name="colour"
                value={values.colour}
                onChange={handleChange}
              >
                <option disabled>select</option>
                {colours.map((colour) => (
                  <option value={colour}>{colour}</option>
                ))}
              </Field>
              <label className="label py-1">
                <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  <ErrorMessage name="colour" />
                </span>
              </label>
              <label className="label text-xs sm:text-sm font-medium mt-3">
                Photos
              </label>
              <PhotoUpload
                setImagesSelected={setImagesSelected}
                setPhotosUploaded={setPhotosUploaded}
              />
              {!photosUploaded && (
                <p className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  Required
                </p>
              )}

              {/* last location here */}
              
              <br />
              <button
                className="btn btn-secondary btn-xs md:btn-sm w-fit font-bold mt-8"
                type="submit"
                disabled={
                  !(
                    Object.keys(errors).length === 0 &&
                    Object.keys(touched).length !== 0 &&
                    photosUploaded &&
                    Object.values(imagesSelected).length !== 0
                  )
                }
              >
                Create Item
              </button>
              {!createItemSuccessful && (
                <p className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                  Item unable to be created.
                </p>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <p className="text-xs md:text-sm">
          To report lost or found items, you need to create an account.
        </p>
      )}
    </div>
  );
};

export default CreateItemModal;
