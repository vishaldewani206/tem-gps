// Initialize the map
const map = L.map('map').setView([25.397469056770063, 68.33540503533844], 13); // Default center and zoom

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Set the shop's location (replace with your shop's coordinates)
const shopLocation = [25.397469056770063, 68.33540503533844]; // Example: London
const shopMarker = L.marker(shopLocation).addTo(map);
shopMarker.bindPopup("Shop Location").openPopup();

// Variables to store the user marker, circle, and routing control
let userMarker;
let userCircle;
let routingControl;

// Function to update the user's location
function updateUserLocation(position) {
    const userLocation = [position.coords.latitude, position.coords.longitude];

    // If the user marker doesn't exist, create it
    if (!userMarker) {
        userMarker = L.marker(userLocation).addTo(map);
        userCircle = L.circle(userLocation, {
            radius: position.coords.accuracy, // Accuracy radius
            color: 'blue',
            fillColor: '#30f',
            fillOpacity: 0.2
        }).addTo(map);

        // Center the map on the user's location ONLY ONCE (initial load)
        map.setView(userLocation, 13);
    } else {
        // Update the existing marker and circle
        userMarker.setLatLng(userLocation);
        userCircle.setLatLng(userLocation).setRadius(position.coords.accuracy);
    }

    // Calculate and display the route
    calculateAndDisplayRoute(userLocation, shopLocation);
}

// Function to calculate and display the route
function calculateAndDisplayRoute(userLocation, shopLocation) {
    if (L.Routing) {
        // If a routing control already exists, update its waypoints
        if (routingControl) {
            routingControl.setWaypoints([
                L.latLng(userLocation[0], userLocation[1]), // User's location
                L.latLng(shopLocation[0], shopLocation[1])  // Shop's location
            ]);
        } else {
            // Create a new routing control if it doesn't exist
            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLocation[0], userLocation[1]), // User's location
                    L.latLng(shopLocation[0], shopLocation[1])  // Shop's location
                ],
                routeWhileDragging: true,
                show: false // Hide the instructions panel
            }).addTo(map);
        }
    } else {
        console.error("Leaflet Routing Machine is not loaded.");
    }
}

// Watch the user's location
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
        (position) => {
            updateUserLocation(position);
        },
        (error) => {
            alert(`Error: ${error.message}`);
        },
        {
            enableHighAccuracy: true // Request high accuracy
        }
    );
} else {
    alert("Your browser does not support geolocation.");
}