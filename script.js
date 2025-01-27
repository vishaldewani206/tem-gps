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

  // Smoothly animate marker position
  function smoothlyMoveMarker(marker, newLatLng) {
      const currentLatLng = marker.getLatLng();

      const animationDuration = 1000; // Animation duration in ms
      const frameRate = 60; // Frames per second
      const steps = animationDuration / (1000 / frameRate); // Number of steps
      const deltaLat = (newLatLng.lat - currentLatLng.lat) / steps;
      const deltaLng = (newLatLng.lng - currentLatLng.lng) / steps;

      let step = 0;
      function animate() {
          if (step < steps) {
              const intermediateLatLng = {
                  lat: currentLatLng.lat + deltaLat * step,
                  lng: currentLatLng.lng + deltaLng * step,
              };
              marker.setLatLng(intermediateLatLng);
              step++;
              requestAnimationFrame(animate);
          } else {
              marker.setLatLng(newLatLng); // Final position
          }
      }
      animate();
  }

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

          // Center map on the user's initial location
          map.setView(userLocation, 13);
      } else {
          // Smoothly move the marker
          smoothlyMoveMarker(userMarker, L.latLng(userLocation));
          userCircle.setLatLng(userLocation).setRadius(position.coords.accuracy);

          // Optionally pan the map only when the user moves significantly
          const mapBounds = map.getBounds();
          if (!mapBounds.contains(userLocation)) {
              map.panTo(userLocation, { animate: true, duration: 1.5 });
          }
      }

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