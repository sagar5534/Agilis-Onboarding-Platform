var placeSearch, autocomplete;

var componentForm = {
  postal_code: 'short_name',
  // country: 'long_name'
};

var componentForm411 = {
  // country411: 'long_name',
  postal_code411: 'short_name'
};

var componentFormExc911 = {
  // countryExc911: 'long_name',
  postal_codeExc911: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  var input = document.getElementById('GoogleAddress')
  var input411 = document.getElementById('GoogleAddress-411')
  //var input3 = document.getElementById('autocomplete3')

  var options = {
    types: ['geocode'],
    componentRestrictions: {country: ['CA', 'US']}
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete411 = new google.maps.places.Autocomplete(input411, options);
  // autocomplete3 = new google.maps.places.Autocomplete(input3, options);

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);
  autocomplete411.setFields(['address_component']);
  //autocomplete3.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete411.addListener('place_changed', fillInAddress411);
  //autocomplete3.addListener('place_changed', fillInAddress3);
}

function fillInAddress(place) {
  // Get the place details from the autocomplete object.

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
  
}

function fillInAddress411() {
  // Get the place details from the autocomplete object.
  var place = autocomplete411.getPlace();

  for (var component in componentForm411) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm411[addressType + "411"]) {
      var val = place.address_components[i][componentForm411[addressType + "411"]];
          document.getElementById(addressType + "411").value = val;
    }
  }

}

function fillInAddressExc911() {
  // Get the place details from the autocomplete object.
  var place = autocompleteExc911.getPlace();

  for (var component in componentFormExc911) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentFormExc911[addressType + "Exc911"]) {
      var val = place.address_components[i][componentFormExc911[addressType + "Exc911"]];
      document.getElementById(addressType + "Exc911").value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function initMap() {

 
  var options = {
    types: ['geocode'],
    componentRestrictions: {country: ['CA', 'US']}
  };

  //For 411 Address
  var input411 = document.getElementById('GoogleAddress-411')
  autocomplete411 = new google.maps.places.Autocomplete(input411, options);
  autocomplete411.setFields(['address_component']);
  autocomplete411.addListener('place_changed', fillInAddress411);

  //For 911 Exc
  var inputExc911 = document.getElementById('GoogleAddress-Exc911')
  autocompleteExc911 = new google.maps.places.Autocomplete(inputExc911, options);
  autocompleteExc911.setFields(['address_component']);
  autocompleteExc911.addListener('place_changed', fillInAddressExc911);


  var map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 46.48, lng: -81}, zoom: 8});

  // Create the search box and link it to the UI element.
  var input = document.getElementById('GoogleAddress');

  var options = {
    types: ['geocode'],
    componentRestrictions: {country: ['CA', 'US']}
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.bindTo('bounds', map);
  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address', 'address_component']);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var geocoder = new google.maps.Geocoder;

  var marker = new google.maps.Marker({map: map});

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    fillInAddress(place)

    if (!place.place_id) {
      return;
    }
    geocoder.geocode({'placeId': place.place_id}, function(results, status) {
      if (status !== 'OK') {
        window.alert('Geocoder failed due to: ' + status);
        return;
      }

      map.setZoom(13);
      map.setCenter(results[0].geometry.location);

      // Set the position of the marker using the place ID and location.
      marker.setPlace(
          {placeId: place.place_id, location: results[0].geometry.location});

      marker.setVisible(true);
    });
  });
}