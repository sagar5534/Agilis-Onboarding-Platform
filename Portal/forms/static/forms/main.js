function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function PromptNewAddress(period) {
    if (period == "0"){
        document.getElementById('NewAddress').style.display = "block"
    }else{
        document.getElementById('NewAddress').style.display = "none"
    }
} 

function getAddress() {

    $.ajax({
        url: '/forms/getAddress',
        data: {
        },
        method: 'POST',
    })
    .done(function (data) {
        document.getElementById('SelectAddress').innerHTML = ""

        for (x in data.address){
            document.getElementById('SelectAddress').innerHTML = document.getElementById('SelectAddress').innerHTML + '<option value=' + data.address[x].id + '>' + data.address[x].address+ '</option>'
        }

        document.getElementById('SelectAddress').innerHTML = document.getElementById('SelectAddress').innerHTML +  '<option value=0>Add a new Address</option>'

    });
}

$(document).ready(function () {
    $(".step1").show();
    //temps
    getAddress()
    $(".step2").hide();
    $(".step3").hide();


    //For Step 2 Radio Button
    $("input:radio[name='option']").click(function () {
        var radioValue = $("input[name='option']:checked").val();
        if (radioValue == 1) {
            document.getElementById('CompanyName411').disabled = false;
            document.getElementById('Category').disabled = false;
            document.getElementById('phone').disabled = false;
            document.getElementById('SelectAddress').disabled = false;
            PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)
        } else {
            document.getElementById('NewAddress').style.display = "none"
            document.getElementById('CompanyName411').value = '';
            document.getElementById('CompanyName411').disabled = true;
            document.getElementById('Category').disabled = true;
            document.getElementById('phone').disabled = true;
            document.getElementById('SelectAddress').disabled = true;
        }
    });




    $(".step1").submit(function (e) {
        e.preventDefault();
        $.ajax({
                url: '/forms/catch',
                data: {
                    companyName: $(".step1").children().children("input[name='CompanyName']").val(),
                    type: document.getElementById("id_Bus_Res").options[document.getElementById("id_Bus_Res").selectedIndex].text,
                    CurProvider: $(".step1").children().children("input[name='CurProvider']").val(),
                    Suite: document.getElementById("Suite").value,
                    StreetNum: document.getElementById("street_number").value,
                    Street: document.getElementById("route").value,
                    City: document.getElementById("locality").value,
                    Prov: document.getElementById("administrative_area_level_1").value,
                    Postal: document.getElementById("postal_code").value,
                    Country: document.getElementById("country").value,
                },
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    //Fix errors
                    alert(data.formerrors['Postal'])
                    console.log(data)
                    //$('.class-name').html(data.form-errors)
                } else {
                    //If valid form
                    getAddress()
                    $(".step1").hide();
                    $(".step2").show();
                }
            });
    });


    



    $(".step2").submit(function (e) {

        if (document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value == 0){
            data = {
                CompanyName411: document.getElementById('CompanyName411').value,
                Category: document.getElementById('Category').value,
                Phone411: document.getElementById('phone').value,
                Suite: document.getElementById("Suite2").value,
                StreetNum: document.getElementById("street_number2").value,
                Street: document.getElementById("route2").value,
                City: document.getElementById("locality2").value,
                Prov: document.getElementById("administrative_area_level_12").value,
                Postal: document.getElementById("postal_code2").value,
                Country: document.getElementById("country2").value,
            }
        }
        else{
            data = {
                CompanyName411: document.getElementById('CompanyName411').value,
                Category: document.getElementById('Category').value,
                Phone411: document.getElementById('phone').value,
                address: document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value
            }
        }
        
        e.preventDefault();
        $.ajax({
                url: '/forms/catch2',
                data: data,
                method: 'POST',
            })
            .done(function(data) {
                if (data.status == "form-invalid") {
                    //Fix errors
                    console.log(data)
                    //$('.class-name').html(data.form-errors)
                } else {
                    //If valid form
                    $(".step3").show();
                    $(".step2").hide();
                }
            });
    });

    $(".step3").submit(function (e) {
        e.preventDefault();

        $.ajax({
                url: '/echo/html/',
                data: {
                    phone: $(".step3").children("input[name='phone']").val(),
                    html: 'test'
                },
                method: 'POST'
            })
            .done(function (data) {
                $(".step3").hide();

                // We're done :)
            });
    });
});