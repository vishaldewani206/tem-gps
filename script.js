   // Initialize the map
   const map = L.map('map').setView([25.397469056770063, 68.33540503533844], 13);

   // Add a tile layer (OpenStreetMap)
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '© OpenStreetMap contributors'
   }).addTo(map);

   // Shop's location
   const shopLocation = [25.397469056770063, 68.33540503533844];
   const shopMarker = L.marker(shopLocation).addTo(map);
   shopMarker.bindPopup("Shop Location");

   // Variables to store user marker and circle
   let userMarker, userCircle;

   // Update user location
   function updateUserLocation(position) {
       const userLocation = [position.coords.latitude, position.coords.longitude];

       if (!userMarker) {
           userMarker = L.marker(userLocation).addTo(map);
           userCircle = L.circle(userLocation, {
               radius: position.coords.accuracy,
               color: 'blue',
               fillColor: '#30f',
               fillOpacity: 0.2
           }).addTo(map);
       } else {
           userMarker.setLatLng(userLocation);
           userCircle.setLatLng(userLocation).setRadius(position.coords.accuracy);
       }

       // Center the map only once (optional)
       map.setView(userLocation, 13);

       // Display route
       calculateAndDisplayRoute(userLocation, shopLocation);
   }

   // Watch geolocation
   if ("geolocation" in navigator) {
       navigator.geolocation.watchPosition(
           updateUserLocation,
           (error) => alert(`Error: ${error.message}`),
           { enableHighAccuracy: true }
       );
   } else {
       alert("Your browser does not support geolocation.");
   }

   // Route calculation
   function calculateAndDisplayRoute(userLocation, shopLocation) {
       if (L.Routing) {
           L.Routing.control({
               waypoints: [
                   L.latLng(userLocation),
                   L.latLng(shopLocation)
               ],
               routeWhileDragging: true,
               show: false
           }).addTo(map);
       } else {
           console.error("Leaflet Routing Machine is not loaded.");
       }
   }