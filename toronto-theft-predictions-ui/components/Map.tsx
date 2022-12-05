/* eslint-disable react-hooks/exhaustive-deps */
declare var google;
import React, { useEffect } from "react";

const GoogleMapsComponent = ({ setCoordinates }) => {
  let map;
  let marker;

  useEffect(() => {
    // Check if the script is already loaded
    if (document.getElementById("google-map-script")) return;

    // Create the script tag for the Google Maps API
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB24aphQczKB091dWFRnUtX7NON1a0cpsg&libraries=places";
    script.defer = true;
    script.async = true;
    script.id = "google-map-script";

    // Append the script to the document body
    document.body.appendChild(script);

    // Create the map when the Google Maps API is loaded
    script.addEventListener("load", () => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.6532, lng: -79.3832 },
        zoom: 13,
      });

      marker = new google.maps.Marker({
        position: { lat: 43.6532, lng: -79.3832 },
        map: map,
      });

      // Add a listener for the click event get the coordinates and update the marker position
      map.addListener("click", (e) => {
        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setCoordinates(coords);
        marker.setPosition(coords);
      });
    });
  }, []);

  return <div id="map" style={{ height: "400px" }} className="w-full" />;
};

export default GoogleMapsComponent;
