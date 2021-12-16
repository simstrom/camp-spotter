mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'details-map', // container ID
	style: 'mapbox://styles/mapbox/light-v10', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: '#2EC4B6' })
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 20 }).setHTML(
			`<h5>${campground.title}</h5><p>${campground.location}</p>`
		)
	)
	.addTo(map);
