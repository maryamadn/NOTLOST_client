import * as yup from "yup";

const createItemValidation = yup.object({
  title: yup
    .string()
    .min(5, "Min length of 5 characters.")
    .max(20, "Max length of 20 characters.")
    .required("Required"),
  type: yup
    .string()
    .required("Required")
    .matches(/(Lost|Found)/, {
      message: "Required",
      excludeEmptyString: true,
    }),
  status: yup
    .string()
    .required("Required")
    .matches(/^(Resolved|Unresolved)$/, {
      message: "Required",
      excludeEmptyString: true,
    }),
  catSubcat: yup
    .string()
    .required("Required")
    .matches(
      /(Academic Materials|Cards|Clothing|Electronics|Household|Jewellery\/Accessories|Stationery|Valuables|Books|Notes|Bank Cards|Ez-Link Cards|Matriculation Cards|NRIC|Bottoms|Footwears|Headwears|Tops|Cables|Cameras|Chargers|Handphones|Hard Drives|Headphones|Laptops|Mouse|Tablets|Bottles|Toiletries|Umbrella|Earrings|Glasses|Necklaces|Rings|Watches|Calculator|Pencil Case|Cash|Keys|Wallets|Cosmetics|Parcels|Perishables \(Food\/Drinks\)|Others)/,
      {
        message: "Required",
        excludeEmptyString: true,
      }
    ),
  //   category: yup
  //     .string()
  //     .required("Required")
  //     .matches(
  //       /(Academic Materials|Cards|Clothing|Electronics|Household|Jewellery\/Accessories|Stationery|Valuables|Others)/,
  //       {
  //         message: "Required",
  //         excludeEmptyString: true,
  //       }
  //     ),
  //   subcategory: yup
  //     .string()
  //     .required("Required")
  //     .matches(
  //       /(Books|Notes|Bank Cards|Ez-Link Cards|Matriculation Cards|NRIC|Bottoms|Footwears|Headwears|Tops|Cables|Cameras|Chargers|Handphones|Hard Drives|Headphones|Laptops|Mouse|Tablets|Bottles|Toiletries|Umbrella|Earrings|Glasses|Necklaces|Rings|Watches|Calculator|Pencil Case|Cash|Keys|Wallets|Cosmetics|Parcels|Perishables \(Food\/Drinks\)|Others)/,
  //       {
  //         message: "Required",
  //         excludeEmptyString: true,
  //       }
  //     ),
  colour: yup
    .string()
    .required("Required")
    .matches(
      /(Black|Blue|Brown|Green|Grey|Orange|Purple|Red|White|Yellow|Pink|Others)/,
      {
        message: "Required",
        excludeEmptyString: true,
      }
    ),
  description: yup
    .string()
    .min(15, "Min length of 15 characters.")
    .max(300, "Max length of 300 characters.")
    .required("Required"),
  last_location: yup.string(),
  // date_time: yup.date().required("Required"),
  found_lost_by: yup.number().required("Required"),
});

export default createItemValidation;
