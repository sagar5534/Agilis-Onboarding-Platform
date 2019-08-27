var placeSearch, autocomplete;

var componentForm = {
  postal_code: 'short_name',
  // country: 'long_name'
};

var componentFormExc911 = {
  // countryExc911: 'long_name',
  postal_codeExc911: 'short_name'
};


function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  var input = document.getElementById('GoogleAddress')
  var inputExc911 = document.getElementById('GoogleAddress-Exc911')


  var options = {
    types: ['geocode'],
    componentRestrictions: {country: ['CA', 'US']}
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocompleteExc911 = new google.maps.places.Autocomplete(inputExc911, options);

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);
  autocompleteExc911.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  autocompleteExc911.addListener('place_changed', fillInAddressExc911);
}



function fillInAddress(place) {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

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