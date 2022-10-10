import axios from "axios";
import { useRef } from "react";
import urlcat from "urlcat";
import { format } from "date-fns";
import catsubcatFilters from "../../Data/catsubcatFilters";
import colours from "../../Data/colours";
import { useEffect } from "react";
import { useState } from "react";
import { useFormikContext } from "formik";

const SERVER = process.env.REACT_APP_SERVER;
const FoundItems = () => {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const searchRef = useRef();

  useEffect(() => {
    let query;
    for (const [key, value] of Object.entries(filters)) {
      query += `&${key}=${value}`;
    }
    const url = urlcat(SERVER, `/items/search?search=${search}${query}`);
  }, [filters, search]);

  const handleSearch = () => {
    const value = searchRef.current.value;
    setSearch(value);
  };

  const HandleOnChange = () => {
    const { values } = useFormikContext();
    setFilters(values);
  };

  return (
    <>
      <input ref={searchRef} />
      <button onClick={handleSearch}>search</button>
      Filters
      <Formik
        initialValues={{
          catSubcat: "Select",
          colour: "Select",
          date_range_from: "",
          date_range_to: format(new Date(), "yyyy-dd-MM"),
          status: "Select",
        }}
      >
        {({ values }) => (
          <div>
            <Form>
              <p>Category/Subcategories</p>
              <Field
                as="select"
                name="catSubcat"
                value={values.catSubcat}
                // onBlur={handleBlur}
              >
                <option disabled>Select</option>
                <option style={{ fontWeight: "bold" }}>All Categories</option>
                {catsubcatFilters.map((filter) => {
                  const key = Object.keys(filter)[0];
                  return (
                    <>
                      <option value={key} style={{ fontWeight: "bold" }}>
                        {key}
                      </option>
                      {filter[key].map((value) => (
                        <option value={value}>{value}</option>
                      ))}
                    </>
                  );
                })}
              </Field>

              <p>Colour</p>
              <Field
                as="select"
                name="colour"
                value={values.colour}
                // onBlur={handleBlur}
              >
                <option disabled>Select</option>
                <option>All Colours</option>
                {colours.map((colour) => (
                  <option value={colour}>{colour}</option>
                ))}
              </Field>

              <p>Date Range</p>
              <p>from</p>
              <input
                type="date"
                name="date_range_from"
                value={values.date_range_from}
                max={format(new Date(), "yyyy-dd-MM")}
              />
              <p>to</p>
              <input
                type="date"
                name="date_range_to"
                value={values.date_range_to}
                // defaultValue={format(new Date(), "yyyy-dd-MM")}
                max={format(new Date(), "yyyy-dd-MM")}
              />
              <HandleOnChange />
            </Form>
          </div>
        )}
      </Formik>
      {/* <p>Category/Subcategories</p>
      <select defaultValue="Select">
        <option disabled>Select</option>
        <option value="" style={{ fontWeight: "bold" }}>
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
                <option value={value}>{value}</option>
              ))}
            </>
          );
        })}
      </select> */}
      {/* <p>Colour</p>
      <select defaultValue="Select">
        <option disabled>Select</option>
        <option value="">All Colours</option>
        {colours.map((colour) => (
          <option value={colour}>{colour}</option>
        ))}
      </select> */}
      {/* <p>Date Range</p>
      <p>from</p>
      <input type="date" max={format(new Date(), "yyyy-dd-MM")} />
      <p>to</p>
      <input
        type="date"
        defaultValue={format(new Date(), "yyyy-dd-MM")}
        max={format(new Date(), "yyyy-dd-MM")}
      /> */}
      <p>Status</p>
      <select defaultValue="Select">
        <option disabled>Select</option>
        <option value="">All Statuses</option>
        <option value="Resolved">Resolved</option>
        <option value="Unesolved">Unresolved</option>
      </select>
    </>
  );
};

export default FoundItems;
