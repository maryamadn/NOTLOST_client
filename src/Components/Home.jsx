import React from "react";
import GoogleMapReact from 'google-map-react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
console.log(API_KEY)


const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(){
  // const defaultProps = {
  //   center: {
  //     lat: 10.99835602,
  //     lng: 77.01502627
  //   },
  //   zoom: 11
  // };

  // return (
  //   // Important! Always set the container height explicitly
  //   <div style={{ height: '100vh', width: '100%' }}>
  //     <GoogleMapReact
  //       bootstrapURLKeys={{ key: API_KEY }}
  //       defaultCenter={defaultProps.center}
  //       defaultZoom={defaultProps.zoom}
  //     >
  //       <AnyReactComponent
  //         lat={59.955413}
  //         lng={30.337844}
  //         text="My Marker"
  //       />
  //     </GoogleMapReact>
  //   </div>
  // );
}