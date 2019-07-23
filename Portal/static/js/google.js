var placeSearch, autocomplete;

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

var componentForm2 = {
  street_number2: 'short_name',
  route2: 'long_name',
  locality2: 'long_name',
  administrative_area_level_12: 'short_name',
  country2: 'long_name',
  postal_code2: 'short_name'
};

var componentForm3 = {
  street_number3: 'short_name',
  route3: 'long_name',
  locality3: 'long_name',
  administrative_area_level_13: 'short_name',
  country3: 'long_name',
  postal_code3: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  var input = document.getElementById('autocomplete')
  var input2 = document.getElementById('autocomplete2')
  var input3 = document.getElementById('autocomplete3')

  var options = {
    types: ['geocode'],
    componentRestrictions: {country: ['CA', 'US']}
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete2 = new google.maps.places.Autocomplete(input2, options);
  autocomplete3 = new google.maps.places.Autocomplete(input3, options);

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);
  autocomplete2.setFields(['address_component']);
  autocomplete3.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2.addListener('place_changed', fillInAddress2);
  autocomplete3.addListener('place_changed', fillInAddress3);
}

function fillInAddress() {
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

function fillInAddress2() {
  // Get the place details from the autocomplete object.
  var place = autocomplete2.getPlace();

  for (var component in componentForm2) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    console.log(addressType)
    if (componentForm2[addressType + "2"]) {
      var val = place.address_components[i][componentForm2[addressType + "2"]];
      document.getElementById(addressType + "2").value = val;
    }
  }
}

function fillInAddress3() {
  // Get the place details from the autocomplete object.
  var place = autocomplete3.getPlace();

  for (var component in componentForm3) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    console.log(addressType)
    if (componentForm3[addressType + "3"]) {
      var val = place.address_components[i][componentForm3[addressType + "3"]];
      document.getElementById(addressType + "3").value = val;
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