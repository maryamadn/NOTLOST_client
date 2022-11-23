import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import urlcat from "urlcat";
import FormatDate from "../../Components/FormatDate";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import createItemValidation from "../../Validations/createItemValidation";
import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import EnquireModal from "../Modals/EnquireModal";
// import Map from "../../Components/Map";
import PhotoUpload from "../../Components/PhotoUpload";
import notifyItemDetailsEdited from "../../Toastify/itemDetailsEdited";
import { ToastContainer } from "react-toastify";


const SERVER = process.env.REACT_APP_SERVER;

const EachItem = ({ user }) => {
  const [item, setItem] = useState({});
  const [editableItem, setEditableItem] = useState(false);
  const [renderItem, setRenderItem] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [photosUploaded, setPhotosUploaded] = useState(true);
  const [imagesSelected, setImagesSelected] = useState({});
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [draftPhotos, setDraftPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = urlcat(SERVER, `/items/${id}`);

    axios
      .get(url)
      .then(({ data }) => {
        data.catSubcat = data.category + "|" + data.subcategory;
        setItem(data);
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
        const urlItems = urlcat(SERVER, `/items/${item.id}`);

        axios
          .delete(urlItems)
          .then(({ data }) => {
            navigate("/myitems");
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  // edit items, add/delete photos
  const handleSubmitEditItem = async (values, callback) => {
    const url = urlcat(SERVER, `/items/${item.id}`);
    const urlPhotos = urlcat(SERVER, "/photos/");
    const files = Object.values(imagesSelected);

    let allDone = 0;

    const editDone = await axios
      .put(url, values)
      .then(() => {
        setRenderItem(1);
        console.log("done edit");
        return true;
      })
      .catch((error) => {
        console.log("unable to edit item");
        //toast
      });

    if (editDone) {
      files
        .reduce(async (prev, file, index) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "bb4akto2");

          const valuesPhoto = {
            item_id: item.id,
            photo: "",
          };

          const linkDone = () =>
            axios
              .post(
                "https://api.cloudinary.com/v1_1/dtomk0u1h/image/upload",
                formData
              )
              .then(async ({ data }) => {
                valuesPhoto.photo = data.secure_url;

                const addDone = await axios
                  .post(urlPhotos, valuesPhoto)
                  .then(() => {
                    console.log("done add", index);
                    // }
                    return true;
                  })
                  .catch((error) => {
                    console.log("unable to add photo", index);
                    return false;
                    //toast
                  });

                return addDone;
              })
              .catch((error) => {
                console.log("unable to link photo");
                return false;
                //toast
              });

          const result = await prev;

          return [
            ...result,
            await new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
              linkDone()
            ),
          ];
        }, Promise.resolve([]))
        .then((res) => {
          console.log(res);
          allDone++;
          if (allDone === 2) {
            setRenderItem(2);
            setImagesSelected({});
            setDeletedPhotos([]);
            setDraftPhotos([]);
            callback();
            notifyItemDetailsEdited()
          }
        });

      deletedPhotos
        .reduce(async (prev, photoId, index) => {
          const urlDeletePhotos = urlcat(SERVER, `/photos/${photoId}`);

          const deleteDone = () =>
            axios
              .delete(urlDeletePhotos)
              .then(() => {
                console.log("done delete", index);
                return true;
              })
              .catch((error) => {
                console.log("unable to delete photo", index);
                return false;
                //toast
              });

          const result = await prev;

          return [
            ...result,
            await new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
              deleteDone()
            ),
          ];
        }, Promise.resolve([]))
        .then((res) => {
          console.log(res);
          allDone++;
          if (allDone === 2) {
            setRenderItem(3);
            setImagesSelected({});
            setDeletedPhotos([]);
            setDraftPhotos([]);
            callback();
            notifyItemDetailsEdited()
          }
        });
    }
  };

  // soft delete photos
  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = draftPhotos.filter(
      (photo) => photo.photo_id !== photoId
    );

    setDraftPhotos([...updatedPhotos]);

    setDeletedPhotos([...deletedPhotos, photoId]);
  };

  const CheckErrors = () => {
    const { errors } = useFormikContext();
    useEffect(() => {
      setFormErrors(errors);
    });
  };

  return (
    <>
      {!editableItem && loading && (
        <div className="grid justify-center w-full">
          <button
            id="loading"
            className="btn btn-secondary btn-sm sm:btn-md md:btn-lg loading"
          >
            loading
          </button>
          <label className="label py-1">
            <span className="label-text-alt text-center text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
              ..uploading photos can take some time..
            </span>
          </label>
        </div>
      )}
      {!editableItem && !loading && (
        <div className="flex flex-col gap-5">
          <ToastContainer />
          <div className="flex flex-col place-items-center">
            <h1 className="text-md sm:text-lg md:text-xl font-bold uppercase">
              {item.type} Item
            </h1>
            <p className="text-sm sm:text-md md:text-lg font-medium uppercase mt-3">
              {item.date_time && <FormatDate date={item.date_time} />}
            </p>
            {item.status === "Resolved" ? (
              <p className="text-sm sm:text-md md:text-lg font-medium uppercase mt-3 sm:mt-5 md:mt-7 badge bg-green-800 p-3 sm:p-4 md:p-5">
                {item.status}
              </p>
            ) : (
              <p className="text-sm sm:text-md md:text-lg font-medium uppercase mt-3 sm:mt-5 md:mt-7 badge bg-red-800 p-3 sm:p-4 md:p-5">
                {item.status}
              </p>
            )}
            <div className="flex flex-col gap-2 mt-7 items-center">
              <p className="badge badge-outline sm:p-2 md:p-3 text-xs md:text-sm truncate">
                {item.category}
              </p>
              <p className="badge badge-outline sm:p-2 md:p-3 text-xs md:text-sm truncate">
                {item.subcategory}
              </p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="grid md:grid-cols-2 m-7 sm:m-9 md:m-11 md:w-3/4 gap-10 self-center place-content-center">
            <div className="md:col-start-2 md:row-start-1 flex flex-col gap-10 text-center">
              <p className="text-sm sm:text-md md:text-lg font-medium capitalize">
                {item.title}
              </p>
              <p className="text-xs sm:text-sm md:text-md">
                {item.description}
              </p>
              {(item.found_lost_by === user.id || user.is_admin) && (
                <div className="flex place-content-center gap-10">
                  <button
                    className="btn btn-secondary btn btn-secondary btn-xs text-xs md:btn-sm"
                    onClick={() => handleDeleteItem()}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary btn btn-secondary btn-xs text-xs md:btn-sm"
                    onClick={() => {
                      setEditableItem(true);
                      setDraftPhotos([...item.photos]);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}

              <label
                htmlFor="enquire-modal"
                className="btn modal-button btn-secondary btn-xs text-xs md:btn-sm place-self-center"
              >
                Enquire
              </label>
            </div>
            <div className="carousel w-full">
              {item.photos &&
                item.photos.map((photo, i) => (
                  <div key={i} id={i} className="carousel-item relative w-full">
                    <img
                      src={photo.photo}
                      className="w-full h-fit self-center"
                    />
                    {item.photos.length > 1 && (
                      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a
                          href={`#${i === 0 ? item.photos.length - 1 : i - 1}`}
                          className="btn btn-xs text-xs btn-circle btn-secondary"
                        >
                          ❮
                        </a>
                        <a
                          href={`#${i === item.photos.length - 1 ? 0 : i + 1}`}
                          className="btn btn-xs text-xs btn-circle btn-secondary"
                        >
                          ❯
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <input type="checkbox" id="enquire-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <label
                htmlFor="enquire-modal"
                className="btn btn-secondary btn-xs btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <div>
                <EnquireModal
                  status={item.status}
                  found_lost_by={item.found_lost_by}
                  type={item.type}
                />
              </div>
              <div className="modal-action"></div>
            </div>
          </div>

          {/* <Map /> */}
        </div>
      )}
      {editableItem && (
        <div className="grid w-48 sm:w-60 md:w-96 m-auto">
          <div className="grid gap-5">
            <p className="text-sm sm:text-lg md:text-xl text-center font-bold">
              EDIT ITEM
            </p>
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
                setEditableItem(false);
                setLoading(true);
                handleSubmitEditItem(values, () => {
                  setLoading(false);
                });
              }}
            >
              {({ handleChange, handleBlur, values, errors, touched }) => (
                <Form id="form" className="container w-44 sm:w-60 md:w-96">
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

                  {user.is_admin && (
                    <>
                      <label className="label text-xs sm:text-sm font-medium mt-3">
                        Status
                      </label>
                      <Field
                        className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
                        as="select"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                      >
                        <option disabled>select</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Unresolved">Unresolved</option>
                      </Field>
                      <label className="label py-1">
                        <span className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                          <ErrorMessage name="status" />
                        </span>
                      </label>
                    </>
                  )}
                  <CheckErrors />
                </Form>
              )}
            </Formik>
          </div>
          <div className="grid self-center place-items-center gap-5 mt-5">
            <PhotoUpload
              setImagesSelected={setImagesSelected}
              setPhotosUploaded={setPhotosUploaded}
            />
            {!(
              draftPhotos.length !== 0 ||
              (photosUploaded && Object.values(imagesSelected).length !== 0)
            ) && (
              <p className="label-text-alt text-[10px] sm:text-[12px] w-[135px] sm:w-[165px] md:w-[190px]">
                Required
              </p>
            )}

            <div className="carousel w-full">
              {draftPhotos &&
                draftPhotos.map((photo, i) => (
                  <div key={i} id={i} className="carousel-item relative w-full">
                    <img
                      src={photo.photo}
                      className="w-full h-fit self-center"
                    />
                    {draftPhotos.length > 1 && (
                      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a
                          href={`#${i === 0 ? draftPhotos.length - 1 : i - 1}`}
                          className="btn btn-xs text-xs btn-circle btn-accent"
                        >
                          ❮
                        </a>
                        <a
                          href={`#${i === draftPhotos.length - 1 ? 0 : i + 1}`}
                          className="btn btn-xs text-xs btn-circle btn-accent"
                        >
                          ❯
                        </a>
                      </div>
                    )}
                    <button
                      className="btn btn-xs text-xs btn-accent absolute"
                      onClick={() => handleDeletePhoto(photo.photo_id)}
                    >
                      Remove Photo
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="text-center mt-5 flex justify-center gap-5">
            <button
              type="submit"
              form="form"
              className="btn btn-secondary btn-xs text-xs md:btn-sm"
              disabled={
                !(
                  Object.keys(formErrors).length === 0 &&
                  (draftPhotos.length !== 0 ||
                    (photosUploaded &&
                      Object.values(imagesSelected).length !== 0))
                )
              }
            >
              Submit Edit
            </button>
            <button
              className="btn btn-accent btn-xs text-xs md:btn-sm"
              onClick={() => {
                setDeletedPhotos([]);
                setDraftPhotos([]);
                setImagesSelected({});
                setFormErrors({});
                setEditableItem(false);
                setPhotosUploaded(true);
                setRenderItem("");
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
