import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import urlcat from "urlcat";
import FormatDate from "../../Components/FormatDate";
import { Field, Form, Formik, useFormikContext } from "formik";
import createItemValidation from "../../Validations/createItemValidation";
import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import EnquireModal from "../Modals/EnquireModal";
import Map from "../../Components/Map";
import PhotoUpload from "../../Components/PhotoUpload";
import ErrorPage from "../Misc/ErrorPage";

const SERVER = process.env.REACT_APP_SERVER;

const EachItem = ({ user }) => {
  
  const [item, setItem] = useState({});
  const [editableItem, setEditableItem] = useState(false);
  const [editItemSuccessful, setEditItemSuccessful] = useState(true);
  const [renderItem, setRenderItem] = useState("");
  const [enableSubmitForm, setEnableSubmitForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [photosUploaded, setPhotosUploaded] = useState(true);
  const [imagesSelected, setImagesSelected] = useState({});
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = urlcat(SERVER, `/items/${id}`);

    axios
      .get(url)
      .then(({ data }) => {
        data.catSubcat = data.category + "|" + data.subcategory;
        setItem(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [renderItem]);

  // delete from items and photos
  const handleDeleteItem = () => {
    const urlPhotos = urlcat(SERVER, `/photos/byitem/${item.id}`);

    axios
      .delete(urlPhotos)
      .then(({ data }) => {
        console.log(data);
        const urlItems = urlcat(SERVER, `/items/${item.id}`);

        axios
          .delete(urlItems)
          .then(({ data }) => {
            console.log(data);
            navigate("/myitems");
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  // edit items, create photos
  const handleSubmitEditItem = (values) => {
    const url = urlcat(SERVER, `/items/${item.id}`);

    console.log(values);
    console.log(imagesSelected);

    axios
      .put(url, values)
      .then(({ data }) => {
        console.log(data);

        const formData = new FormData();
        const files = Object.values(imagesSelected);

        files.map((file) => {
          console.log("running this");
          formData.append("file", file);
          formData.append("upload_preset", "bb4akto2");

          axios
            .post(
              "https://api.cloudinary.com/v1_1/dtomk0u1h/image/upload",
              formData
            )
            .then(({ data }) => {
              const valuesPhotos = {
                item_id: item.id,
                photo: "",
              };
              valuesPhotos.photo = data.secure_url;

              const urlPhotos = urlcat(SERVER, "/photos/");
              axios
                .post(urlPhotos, valuesPhotos)
                .then(({ data }) => {
                  console.log("updated p in db");
                  setRenderItem("1");
                })
                .catch((error) => {
                  console.log(error);
                  setEditItemSuccessful(false);
                });
            })
            .catch((error) => console.log(error));
        });

        setRenderItem("2");
        setEditableItem(!editableItem);
      })
      .catch((error) => {
        setEditItemSuccessful(false);
      });

    if (deletedPhotos.length !== 0) {
      deletedPhotos.map((photoId) => {
        const urlDeletePhotos = urlcat(SERVER, `/photos/${photoId}`);

        axios
          .delete(urlDeletePhotos)
          .then(({ data }) => {
            setRenderItem("3");
            setEditItemSuccessful(true);
            setEditableItem(false);
          })
          .catch((error) => console.log(error));
      });
      setDeletedPhotos([]);
    }

    // setRenderItem(!renderItem);
    // setEditItemSuccessful(true);
    // setEditableItem(false);
  };

  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = item.photos.filter(
      (photo) => photo.photo_id !== photoId
    );

    setItem({ ...item, photos: updatedPhotos });

    setDeletedPhotos([...deletedPhotos, photoId]);
  };

  const CheckErrors = () => {
    const { errors } = useFormikContext();
    setFormErrors(errors);
  };
  
  return (
    <>
      {!editableItem && (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col place-items-center">
            <h1 className="text-5xl font-bold uppercase">{item.type} Item</h1>
            <p className="text-2xl font-medium uppercase mt-3">
              {item.date_time && <FormatDate date={item.date_time} />}
            </p>
            {item.status === 'Resolved' ? <p className="text-2xl font-medium uppercase mt-3 badge bg-green-800 p-5">{item.status}</p>
            : <p className="text-2xl font-medium uppercase mt-3 badge bg-red-800 p-5">{item.status}</p>}
            <div className="flex flex-col gap-2 mt-7">
              <p className="badge badge-outline">{item.category}</p>
              <p className="badge badge-outline">{item.subcategory}</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex gap-10 place-content-center">
            <div className="carousel w-80 w-1/3">
              {item.photos &&
                item.photos.map((photo, i) => (
                  <div key={i} id={i} className="carousel-item relative w-full">
                    <img src={photo.photo} className="w-full object-contain" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a
                        href={`#${i == 0 ? item.photos.length - 1 : i - 1}`}
                        className="btn btn-circle btn-accent"
                      >
                        ❮
                      </a>
                      <a
                        href={`#${i == item.photos.length - 1 ? 0 : i + 1}`}
                        className="btn btn-circle btn-accent"
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-10">
              <p className="text-4xl font-medium capitalize">{item.title}</p>
              <p className="text-2xl">{item.description}</p>
              {(item.found_lost_by === user.id || user.is_admin) && (
                <div className="flex place-content-center gap-10">
                  <button
                    className="btn btn-secondary w-fit"
                    onClick={() => handleDeleteItem()}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary w-fit"
                    onClick={() => setEditableItem(true)}
                  >
                    Edit
                  </button>
                </div>
              )}

              <label
                htmlFor="enquire-modal"
                className="btn modal-button btn-secondary w-fit place-self-center"
              >
                Enquire
              </label>
            </div>
          </div>
          <input type="checkbox" id="enquire-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <label
                htmlFor="enquire-modal"
                className="btn btn-accent btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <div>
                <EnquireModal status={item.status} found_lost_by={item.found_lost_by} type={item.type} />
              </div>
              <div className="modal-action"></div>
            </div>
          </div>

          <Map />
        </div>
      )}
      {editableItem && (
        <div className="grid place-content-center">
          <div className="grid h-fit w-full card rounded-box place-items-center p-10">
            <label className="btn btn-ghost">
              <PhotoUpload
                setImagesSelected={setImagesSelected}
                setPhotosUploaded={setPhotosUploaded}
              />
              {!photosUploaded && <p>Required</p>}
            </label>

            <div className="carousel w-80 h-3/4">
              {item.photos &&
                item.photos.map((photo, i) => (
                  <>
                    <div
                      key={i}
                      id={i}
                      className="carousel-item relative w-full"
                    >
                      <img
                        src={photo.photo}
                        className="w-full object-contain"
                      />
                      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a
                          href={`#${i == 0 ? item.photos.length - 1 : i - 1}`}
                          className="btn btn-circle btn-accent"
                        >
                          ❮
                        </a>
                        <a
                          href={`#${i == item.photos.length - 1 ? 0 : i + 1}`}
                          className="btn btn-circle btn-accent"
                        >
                          ❯
                        </a>
                      </div>
                      <button
                        className="btn btn-accent absolute"
                        onClick={() => handleDeletePhoto(photo.photo_id)}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </>
                ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="grid h-max py-10 card bg-base-300 rounded-box place-items-center">
            <Formik
              initialValues={{
                title: item.title,
                type: item.type,
                status: item.status,
                catSubcat: item.catSubcat,
                colour: item.colour,
                description: item.description,
                last_location: item.last_location,
                date_time: item.date_time,
                found_lost_by: item.found_lost_by,
                retrieved_by: item.retrieved_by,
              }}
              validationSchema={createItemValidation}
              onSubmit={(values) => {
                setEditItemSuccessful(true);
                handleSubmitEditItem(values);
              }}
            >
              {({ handleChange, handleBlur, values, errors, touched }) => (
                <Form id="form">
                  <Field
                    className="input input-bordered w-full max-w-xs input-sm"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    placeholder="Title"
                  />
                  {errors.title && touched.title ? (
                    <div>{errors.title}</div>
                  ) : null}
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
                  {errors.type && touched.type ? (
                    <div>{errors.type}</div>
                  ) : null}

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
                  {user.is_admin && (
                    <>
                      <p>Status</p>
                      <Field
                        className="select select-bordered w-full max-w-xs"
                        as="select"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                      >
                        <option disabled>select</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Unresolved">Unresolved</option>
                      </Field>
                      {errors.status && touched.status ? (
                        <div>{errors.status}</div>
                      ) : null}
                    </>
                  )}
                  {!editItemSuccessful && <p>Item unable to be edited.</p>}
                  <CheckErrors />
                </Form>
              )}
            </Formik>
          </div>
          <div className="text-center pt-10 space-x-6">
            <button
              type="submit"
              form="form"
              className="btn btn-outline w-1/3"
              onClick={() => setEnableSubmitForm(true)}
              disabled={
                !(
                  (
                    Object.keys(formErrors).length === 0 &&
                    (item.photos.length !== 0 ||
                      (photosUploaded &&
                        Object.values(imagesSelected).length !== 0))
                  )
                  // &&
                  // item.photos.length !== 0 && file.files.length !== 0
                )
              }
            >
              Submit Edit
            </button>
            <button
              className="btn btn-outline w-1/3"
              onClick={() => {
                setEditableItem(false);
                setRenderItem("4");
              }}
            >
              Cancel Edit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EachItem;
