const deckgl = new deck.DeckGL({
  container: 'app',
  mapStyle: deck.carto.BASEMAP.POSITRON,
  mapboxApiAccessToken: 'pk.eyJ1IjoibWFuZnUiLCJhIjoiY2tvazlxcmF0MDI0bzJ2cWxuOGV5dWU3dSJ9.AW6J2eFyh_79OQ6jl7LqFA',
  initialViewState: {
    latitude: 42.730058,
    longitude: 10.974754,
    zoom: 14,
    minZoom: 14,
    maxZoom: 15,
    pitch: 40.5,
    bearing: 15
    
  },
  controller: true,
});