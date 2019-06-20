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
            document.getElementById('SelectAddress').innerHTML += '<option value=' + data.address[x].id + '>' + data.address[x].address+ '</option>'
        }

        document.getElementById('SelectAddress').innerHTML +=  '<option value=0>Add a new Address</option>'

    });
}


let portId = 1;
let discId = 1;

function removePortNumber(x){
    document.getElementById("portnumber" + x).remove();
    document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portbr" + x).remove();
}

function removeDiscNumber(x){
    document.getElementById("discnumber" + x).remove();
    document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discbr" + x).remove();
}

function addPortNumber() {
    portId++; 
    $('#portnumberForm').append("<br id='portbr" + portId +"'><input id=portnumber"+portId+" name='phone' type='text'><button id='portremoveNumber"+portId+ "' type=button onclick='removePortNumber("+portId+")'>X</button>");
}

function addDiscNumber() {
    discId++; 
    $('#discnumberForm').append("<br id='discbr" + discId +"'><input id=discnumber"+discId+" name='phone' type='text'><button id='discremoveNumber"+discId+ "' type=button onclick='removeDiscNumber("+discId+")'>X</button>");
}


$(document).ready(function () {
    $(".step1").hide();
    $(".step2").hide();
    $(".step3").show();


    //For Step 2 --- Yes or No for Directory Listing
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


    //Step 1
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
                } else {
                    //If valid form
                    getAddress()
                    $(".step1").hide();
                    $(".step2").show();
                }
            });
    });


    //Step 2
    $(".step2").submit(function (e) {

        //Type of Data to be send over to Catch2
        if (document.getElementById('radio-yes').checked == true){
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
        }
        else{
            data = {
                ignore: 1
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
                } else {
                    //If valid form
                    $(".step3").show();
                    $(".step2").hide();
                }
            });
    });

    function validatePhone(val){
        var x = val
        x = x.replace('+1', '');
        x = x.replace(/[-+()\s]/g, '');
        return x;
    }

    //Step 3
    $(".step3").submit(function (e) {
        e.preventDefault();

        var formCorrect = true;

        var div = document.getElementById('portnumberForm')
        var children = div.childNodes;
        var elements = [];
        for (var i=0; i<div.childNodes.length; i++) {
            var child = div.childNodes[i];
            if (child.name == 'phone'){
                child.value = validatePhone(child.value)
                if (child.value.length == 10){
                    elements.push(child.value)
                }else{
                    formCorrect = false;
                    break;
                }
            }
        }

        var div = document.getElementById('discnumberForm')
        var children = div.childNodes;
        var discelements = [];
        for (var i=0; i<div.childNodes.length; i++) {
            var child = div.childNodes[i];
            if (child.name == 'phone'){
                child.value = validatePhone(child.value)
                if (child.value.length == 10){
                    discelements.push(child.value)
                }else{
                    formCorrect = false;
                    break;
                }
            }
        }
        
        if (formCorrect == true){
             //Data
            let Data = {
                port: elements,
                disc: discelements
            }  

            $.ajax({
                    url: '/forms/catch3',
                    data: JSON.stringify(Data),
                    contentType: "application/json",
                    method: 'POST'
                })
                .done(function (data) {
                    $(".step3").hide();
                });
        }else{
           alert("Please enter a Valid Phone Number") 
        }
       
    });
});