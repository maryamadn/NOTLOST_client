import axios from "axios";
import urlcat from "urlcat";
import { useEffect, useState, useRef } from "react";
import { Field, Form, Formik, useFormikContext } from "formik";
import { format, parse, parseISO } from "date-fns";
import { IoIosCreate, IoMdClose } from "react-icons/io";

import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import CreateItemModal from "../Modals/CreateItemModal";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../Components/FormatDate";

const SERVER = process.env.REACT_APP_SERVER;

// import {setDefaultOptions} from 'date-fns'
// import {ms} from 'date-fns/locale'
// setDefaultOptions({ locale: ms })

const Items = ({ user }) => {
  const initialValues = {
    type: "select",
    catSubcat: "select",
    colour: "select",
    date_range_from: "",
    date_range_to: format(new Date(), "yyyy-MM-dd"),
    status: "select",
  };

  const [filters, setFilters] = useState(initialValues);
  const [search, setSearch] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [renderItems, setRenderItems] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const changedFilters = Object.entries(filters).filter(
      (filter) =>
        filter[1] !== "" &&
        filter[1] !== "select" &&
        filter[1] !== "All Categories" &&
        filter[1] !== "All Colours" &&
        filter[1] !== "All Statuses" &&
        filter[1] !== "All Types"
    );

    let query = "";

    changedFilters.map(([k, v]) => {
      if (k === "catSubcat") {
        const cat = v.split("|")[0];
        const subcat = v.split("|")[1] ? v.split("|")[1] : "";
        return (query += `&category=${cat}&subcategory=${subcat}`);
      } else {
        return (query += `&${k}=${v}`);
      }
    });

    const url = urlcat(SERVER, `/items/search?${search}${query}`);
    axios
      .get(url)
      .then(({ data }) => {
        console.log(data);
        setFoundItems(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [filters, search, renderItems]);

  const handleSearch = () => {
    const value = searchRef.current.value;
    setSearch(`search=${value}`);
  };

  const HandleOnChange = () => {
    const { values } = useFormikContext();
    useEffect(() => {
      setFilters(values);
    }, [values]);
  };

  const handleEachItem = (id) => {
    navigate(`/eachitem/${id}`);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        <div className="col-start-1 col-span-2 justify-self-end flex gap-5 w-fit">
          <input
            ref={searchRef}
            className="input input-bordered w-max max-w-xs"
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            search
          </button>
        </div>
        <label
          htmlFor="create-item-modal"
          className="btn modal-button btn-secondary col-start-3 col-span-1 justify-self-center w-fit"
        >
          <IoIosCreate />
          Create Item
        </label>
      </div>
      <input type="checkbox" id="create-item-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-secondary-focus">
          <label
            htmlFor="create-item-modal"
            className="btn btn-accent btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div>
            <CreateItemModal
              setRenderItems={setRenderItems}
              renderItems={renderItems}
              user={user}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
          <div className="modal-action"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 w-full mt-10">
        <div className="justify-self-center">
          <p className="font-medium text-2xl text-center">Filters</p>
          <br />
          <div className="font-medium">
            <Formik initialValues={initialValues}>
              {({ values, handleChange }) => (
                <div>
                  <Form>
                    <p>Type</p>
                    <Field
                      className="select select-bordered w-full max-w-xs"
                      as="select"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                    >
                      <option disabled>select</option>
                      <option>All Types</option>
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </Field>
                    <br />
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
                      <option style={{ fontWeight: "bold" }}>
                        All Categories
                      </option>
                      {catsubcatFilters.map((filter) => {
                        const key = Object.keys(filter)[0];
                        return (
                          <>
                            <option value={key} style={{ fontWeight: "bold" }}>
                              {key}
                            </option>
                            {filter[key].map((value) => (
                              <option value={key + "|" + value}>{value}</option>
                            ))}
                          </>
                        );
                      })}
                    </Field>
                    <br />
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
                      <option>All Colours</option>
                      {colours.map((colour) => (
                        <option value={colour}>{colour}</option>
                      ))}
                    </Field>
                    <br />
                    <br />
                    <p>Date Range</p>
                    <div className="grid gap-2 max-w-fit">
                      <p>from</p>
                      <input
                        style={{
                          backgroundColor: "#0c0c0c",
                          borderRadius: "10px",
                          color: "#d0993f",
                        }}
                        type="date"
                        name="date_range_from"
                        value={
                          values.date_range_from > values.date_range_to
                            ? values.date_range_to
                            : values.date_range_from
                        }
                        max={values.date_range_to}
                        onChange={handleChange}
                      />
                      <p>to</p>
                      <input
                        style={{
                          backgroundColor: "#0c0c0c",
                          borderRadius: "10px",
                          color: "#d0993f",
                        }}
                        type="date"
                        name="date_range_to"
                        value={values.date_range_to}
                        max={format(new Date(), "yyyy-MM-dd")}
                        onChange={handleChange}
                      />
                    </div>
                    <br />
                    <br />
                    <p>Status</p>
                    <Field
                      className="select select-bordered w-full max-w-xs"
                      as="select"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option disabled>select</option>
                      <option>All Statuses</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Unresolved">Unresolved</option>
                    </Field>

                    <HandleOnChange />
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>
        <div className="col-start-2 col-span-2 grid grid-cols-3 gap-10 mr-20">
          {foundItems.msg ? (
            <div className="w-full cols-span-3 text-lg font-bold col-start-2 text-center">
              NO ITEMS FOUND
            </div>
          ) : (
            foundItems.map((item, i) => (
              <div
                className="w-fit h-fit place-self-center w-96 max-w-xs"
                key={i}
                onClick={() => {
                  handleEachItem(item.id);
                }}
              >
                <div className="card w-full bg-base-100 shadow-xl">
                  <figure>
                    <img className="object-contain" src={item.array_agg[0]} />
                  </figure>
                  <div className="card-body bg-secondary-focus">
                    <h2 className="card-title capitalize font-medium">
                      {item.title}
                      <div className="ml-4 badge badge-accent uppercase font-medium">
                        {item.type}
                      </div>
                    </h2>
                    <p className="my-1 font-medium">
                      <FormatDate date={item.date_time} />
                    </p>
                    <div className="card-actions justify-items-start mt-4 grid grid-rows-2 font-medium">
                      <div className="badge badge-outline p-3">
                        {item.category}
                      </div>
                      <div className="badge badge-outline p-3">
                        {item.subcategory}
                      </div>
                      {item.status === "Resolved" ? (
                        <div className="badge badge-outline bg-green-700 p-3">
                          {item.status}
                        </div>
                      ) : (
                        <div className="badge badge-outline bg-red-700 p-3">
                          {item.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Items;
