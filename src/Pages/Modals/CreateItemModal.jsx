import urlcat from "urlcat";
import axios from "axios";
import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import { format, parseISO } from "date-fns";
import { IoMdClose } from "react-icons/io";
import FileBase64 from "react-file-base64";

import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import createItemValidation from "../../Validations/createItemValidation";
import PhotoUpload from "../../Components/PhotoUpload";

const SERVER = process.env.REACT_APP_SERVER;

const CreateItemModal = ({
  setRenderItems,
  renderItems,
  user,
}) => {

  const [createItemSuccessful, setCreateItemSuccessful] = useState(true);
  const [photos, setPhotos] = useState([]);
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
    date_time: '', //problem: database save as diff timzone
    found_lost_by: user.id,
  });

  const handleCreateItem = async (values) => {
    const url = urlcat(SERVER, "/items/");
  

    values.date_time = new Date()
    console.log('1',values)
    await axios
      .post(url, values)
      .then(({ data }) => {
        const item_id = data[0][0]
        const formData = new FormData();
        const files = Object.values(imagesSelected);

        files.map((file) => {
          formData.append("file", file);
          formData.append("upload_preset", "bb4akto2");
          axios
            .post(
              "https://api.cloudinary.com/v1_1/dtomk0u1h/image/upload",
              formData
            )
            .then(({ data }) => {
              const valuesPhotos = {
                item_id,
                photo: '',
              };
              valuesPhotos.photo = data.secure_url;

              const urlPhotos = urlcat(SERVER, "/photos/");
              axios
                .post(urlPhotos, valuesPhotos)
                .then(({ data }) => {
                  setRenderItems(!renderItems);
                  setCreateItemSuccessful(true);
                  setInitialValues()
                  document.getElementById('create-item-modal').checked = false;
                  document.getElementById('fileInput').value = ''
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

      console.log('12',values)
  };

  return (
    <div>
      <h1 className="font-bold">Report Lost/Found Item</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={createItemValidation}
        onSubmit={(values, {resetForm}) => {
          const showPosition = (position) => {
            const location =`${position.coords.latitude}, ${position.coords.longitude}`
            values.last_location = location
          }
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition)
          } else {
            console.log('not supported')
          }
          handleCreateItem(values);
          resetForm()
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form className="grid h-max py-10 rounded-box">
            <Field
            className="input input-bordered w-full max-w-xs input-sm"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              placeholder="Title"
            />
            {errors.title && touched.title ? <div>{errors.title}</div> : null}
            <br />

            <textarea
            className="textarea textarea-bordered w-full"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              placeholder="Description"
            />
            {errors.description && touched.description ? (
              <div>{errors.description}</div>
            ) : null}
            <br />

            <p>Item Type</p>
            <Field
            className="select select-bordered w-full max-w-xs"
              as="select"
              name="type"
              value={values.type}
              onChange={handleChange}
            >
              <option disabled>select</option>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </Field>
            {errors.type && touched.type ? <div>{errors.type}</div> : null}

            <br />

            <p>Category/Subcategory</p>
            <Field
            className="select select-bordered w-full max-w-xs"
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
            {errors.catSubcat && touched.catSubcat ? (
              <div>{errors.catSubcat}</div>
            ) : null}

            <br />

            <p>Colour</p>
            <Field
            className="select select-bordered w-full max-w-xs"
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
            {errors.colour && touched.colour ? (
              <div>{errors.colour}</div>
            ) : null}

            <br />

            <PhotoUpload
              setImagesSelected={setImagesSelected}
              setPhotosUploaded={setPhotosUploaded}
            />
            {!photosUploaded && <p>Required</p>}

            {/* last location here */}

            <button
              className="btn btn-ghost"
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
            {!createItemSuccessful && <p>Item unable to be created.</p>}
          </Form>
        )}
      </Formik>
      {/* </div> */}
    </div>
  );
};

export default CreateItemModal;

