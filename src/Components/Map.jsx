import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useState } from "react";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const center = { lat: 48.8584, lng: 2.2945 };

// let autocomplete

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  if (!isLoaded) {
    return <>haha</>;
  }

  return (
    <div className="">
      {/* <div className="flex justify-center h-screen w-screen place-self-center">
        <div className="">
          <p className="font-medium">Pick Location</p>
          <Autocomplete>
            <input
              id="searchInput"
              className="input input-bordered w-full max-w-xs"
              placeholder="Place"
            />
          </Autocomplete>
          <button
            className="btn btn-secondary"
            onClick={() => map.panTo(center)}
          >
            RECENTER
          </button>
        </div>

        <div className="h-screen w-screen ">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "40%", height: "40%" }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />
            <Marker position={center} />
          </GoogleMap>
        </div>
      </div> */}
    </div>
  );
};

export default Map;

// const input = document.getElementById("searchInput");
// autocomplete = new google.maps.places.Autocomplete(input, {
//   fields: ["name", "geometry"],
// });
// const place = autocomplete.getPlace();
// const lat = place?.geometry?.location.lat();
// const lng = place?.geometry?.location.lng();

// autocomplete.addListener("place_changed", onPlaceChanged);

// const onPlaceChanged = () => {
//   const place = autocomplete.getPlace();
//   if (!place.geometry) {
//     document.getElementById("searchInput").placeholder = "Enter a place";
//   } else {
//     console.log(place.name);
//   }
// };
