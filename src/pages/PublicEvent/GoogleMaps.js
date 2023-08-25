import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = () => (
  <div
    style={{
      height: "20px",
      width: "20px",
      borderRadius: "999px",
      background: "red",
    }}
  ></div>
);

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 15,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_PLACES_API }}
          center={{ lat: this.props.lat, lng: this.props.lng }}
          defaultZoom={this.props.zoom}
          draggable={false}
        >
          <AnyReactComponent />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
