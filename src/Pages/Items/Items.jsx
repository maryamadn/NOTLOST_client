import axios from "axios";
import urlcat from "urlcat";
import { useEffect, useState, useRef } from "react";
import { Field, Form, Formik, useFormikContext } from "formik";
import { format } from "date-fns";
import { IoIosCreate } from "react-icons/io";
import { RiFilter2Fill } from "react-icons/ri";

import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import CreateItemModal from "../Modals/CreateItemModal";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../Components/FormatDate";

const SERVER = process.env.REACT_APP_SERVER;

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
  const [items, setItems] = useState([]);
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
        setItems(data);
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
      <div className="grid grid-rows-2 gap-6 justify-center justify-items-center">
        <div className="justify-self-end flex gap-5 w-fit">
          <input
            ref={searchRef}
            className="input input-bordered input-xs md:input-sm w-36 sm:w-52 md:w-80 text-xs"
          />
          <button
            onClick={handleSearch}
            className="btn btn-secondary btn-xs text-xs md:btn-sm"
          >
            search
          </button>
        </div>
        <label
          htmlFor="create-item-modal"
          className="btn gap-1 modal-button btn-secondary btn-xs text-xs md:btn-sm w-max"
        >
          <IoIosCreate />
          Create Item
        </label>
      </div>
      <input type="checkbox" id="create-item-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-fit">
          <label
            htmlFor="create-item-modal"
            className="btn btn-secondary btn-xs btn-circle absolute right-2 top-2"
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
          {!user.id && (
            <div className="modal-action">
              <label
                htmlFor="my-modal"
                className="btn btn-secondary btn-xs md:btn-sm"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div> 
      <div className="grid justify-center gap-5">
        <p className="text-sm sm:text-lg md:text-xl text-center font-bold">
          ITEMS
        </p>
        <div tabIndex="0" className="collapse collapse-arrow w-40 sm:w-52 justify-self-center">
          <input type="checkbox" className="w-full" />
          <div className="collapse-title btn btn-ghost btn-active btn-xs h-[60px] font-medium content-center justify-start">
            Filters
          </div>
          <div className="collapse-content">
            <Formik initialValues={initialValues}>
              {({ values, handleChange, handleReset }) => (
                <Form className="font-medium">
                  <label className="label text-xs sm:text-sm mt-3">Type</label>
                  <Field
                    className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
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
                  <label className="label text-xs sm:text-sm mt-3">
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
                  <label className="label text-xs sm:text-sm mt-3">
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
                    <option>All Colours</option>
                    {colours.map((colour) => (
                      <option key={colour} value={colour}>
                        {colour}
                      </option>
                    ))}
                  </Field>
                  <label className="label text-xs sm:text-sm mt-3">
                    Date Range
                  </label>
                  <div className="grid gap-2 max-w-fit">
                    <label className="label text-xs sm:text-sm font-normal">
                      from
                    </label>
                    <input
                      className="input input-bordered bg-base-100 select-sm text-xs md:select-md md:text-sm"
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
                    <label className="label text-xs sm:text-sm font-normal">
                      to
                    </label>
                    <input
                      className="input input-bordered bg-base-100 select-sm text-xs md:select-md md:text-sm"
                      type="date"
                      name="date_range_to"
                      value={values.date_range_to}
                      max={format(new Date(), "yyyy-MM-dd")}
                      onChange={handleChange}
                    />
                  </div>
                  <label className="label text-xs sm:text-sm">Status</label>
                  <Field
                    className="select select-bordered select-sm text-xs md:select-md md:text-sm w-full"
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
                  <button onClick={handleReset} className='mt-3 btn btn-ghost btn-active btn-xs text-xs md:btn-sm'>reset</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.msg ? (
            <div className="w-full font-bold text-center text-center text-xs sm:text-sm md:text-lg">
              No items found
            </div>
          ) : (
            items.map((item, i) => (
              <div
                className="w-fit h-fit place-self-center"
                key={i}
                onClick={() => {
                  handleEachItem(item.id);
                }}
              >
                <div className="card w-40 sm:w-44 md:w-48 bg-base-100 shadow-xl">
                  <figure>
                    <img className="object-contain" src={item.array_agg[0]} />
                  </figure>
                  <div className="card-body bg-secondary-focus p-5 sm:p-6 md:p-7">
                    <h2 className="grid card-title capitalize font-medium text-xs sm:text-sm md:text-lg">
                      <div className="truncate">
                      {item.title}
                      </div>
                      <div className="row-start-1 sm:col-start-2 md:ml-4 badge badge-accent uppercase font-medium text-[10px] sm:text-xs md:text-sm">
                        {item.type}
                      </div>
                    </h2>
                    <p className="my-1 font-medium text-[10px] sm:text-xs md:text-sm">
                      <FormatDate date={item.date_time} />
                    </p>
                    <div className="card-actions justify-items-start mt-4 grid grid-rows-2 font-medium">
                      <div className="badge badge-outline sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm truncate">
                        {item.category}
                      </div>
                      <div className="badge badge-outline sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm truncate">
                        {item.subcategory}
                      </div>
                      {item.status === "Resolved" ? (
                        <div className="badge badge-outline bg-green-700 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                          {item.status}
                        </div>
                      ) : (
                        <div className="badge badge-outline bg-red-700 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
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
