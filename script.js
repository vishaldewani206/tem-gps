// Initialize the map
const map = L.map('map').setView([25.397469056770063, 68.33545867951712], 13); // Default center and zoom

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Set the shop's location (replace with your shop's coordinates)
const shopLocation = [25.397469056770063, 68.33545867951712]; // Example: London
const shopMarker = L.marker(shopLocation).addTo(map);
shopMarker.bindPopup("Shop Location").openPopup();


let userMarker;
let userCircle;

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];

        // Update or create the user marker and circle
        if (!userMarker) {
            userMarker = L.marker(userLocation).addTo(map);
            userCircle = L.circle(userLocation, {
                radius: position.coords.accuracy, // Accuracy radius
                color: 'blue',
                fillColor: '#30f',
                fillOpacity: 0.2
            }).addTo(map);
        } else {
            userMarker.setLatLng(userLocation);
            userCircle.setLatLng(userLocation).setRadius(position.coords.accuracy);
        }

        // Center the map on the user's location
        map.setView(userLocation, 13);

        // Calculate and display the route (optional, see Step 4)
        calculateAndDisplayRoute(userLocation, shopLocation);
    }, (error) => {
        alert(`Error: ${error.message}`);
    }, {
        enableHighAccuracy: true // Request high accuracy
    });
} else {
    alert("Your browser does not support geolocation.");
}


function calculateAndDisplayRoute(userLocation, shopLocation) {
  if (L.Routing) {
      L.Routing.control({
          waypoints: [
              L.latLng(userLocation[0], userLocation[1]), // User's location
              L.latLng(shopLocation[0], shopLocation[1])  // Shop's location
          ],
          routeWhileDragging: true,
          show: false // Hide the instructions panel
      }).addTo(map);
  } else {
      console.error("Leaflet Routing Machine is not loaded.");
  }
}