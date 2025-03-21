var google;

function init() {
  // Check if map element exists
  const mapElement = document.getElementById("map");

  // Only initialize map if element exists
  if (mapElement) {
    const myLatLng = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates

    const map = new google.maps.Map(mapElement, {
      zoom: 15,
      center: myLatLng,
      styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        // ... rest of your map styles
      ],
    });

    const marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: "BOMA Students",
    });
  }
}

// Initialize map when Google Maps API is loaded
if (typeof google !== "undefined") {
  google.maps.event.addDomListener(window, "load", init);
} else {
  console.log("Google Maps not loaded");
}
