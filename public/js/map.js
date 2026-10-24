const property = window.property;

mapboxgl.accessToken = mapToken;
console.log(mapToken);
console.log("This was out by here");
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/standard",
  center: property.geoLocation.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// create the popup
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(property.geoLocation.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25}).setHTML(
  `<h4>${property.location}</h4><p>This location is provided by the owner</p>`
))
  .addTo(map);
  

