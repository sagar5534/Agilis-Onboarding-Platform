//All Methods for CSRF Token Sending between JS and Python
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


function fillCompany(callback){

    $.ajax({
            url: '/forms/initCompany',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });

}

function fillPort(callback){

    $.ajax({
            url: '/forms/initPort',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });

}

function fill911(callback){

    $.ajax({
            url: '/forms/init911',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });
}

function fill411(callback){

    $.ajax({
            url: '/forms/init411',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });
}

function fillExt(callback){

    $.ajax({
            url: '/forms/initExt',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });
}

function fillUpload(callback){

    $.ajax({
            url: '/forms/initUpload',
            method: 'POST',
        })
        .done(function (data) {

            callback(data);

        });
}


$(document).ready(function () {

    fillCompany(function(data) {

        var obj = JSON.parse(data);

        document.getElementById("Provider").value = obj.currentProvider
        document.getElementById("CompanyName").value = obj.company_name
        document.getElementById("Type").value = obj.type
        document.getElementById("GoogleAddress").value = obj.StreetAddress
        document.getElementById("postal_code").value = obj.Postal
        document.getElementById("Suite").value = obj.Suite

    });

    fillPort(function(data) {

        var obj = JSON.parse(data);

        for (x in obj){

            if (obj[x] == 1){
                portId++;

                $('#numbersPort').append("<div class='div-block-17 w-clearfix' id='portid" + portId + "'>"
                + "<div class='text-block-14'>#</div>"
                + "<div class='form-number'>" + x + "</div>"
                + "<a class='form-x-btn w-button' onclick='removePortNumber(" + portId + ")'>X</a></div>")
                
                portNumbers[portId] = x
            }
            else{
                discId++; 
                
                $('#numbersDisc').append("<div class='div-block-17 w-clearfix' id='discid" + discId + "'>"
                + "<div class='text-block-14'>#</div>"
                + "<div class='form-number'>" + x + "</div>"
                + "<a class='form-x-btn w-button' onclick='removeDiscNumber(" + discId + ")'>X</a></div>")

                discNumbers[discId] = x
            }

        } 
    });

    fill911(function(data) {
        
        var obj = JSON.parse(data);
      
        getAddress("SelectAddress911", function (address) {
            getPhone("SelectPhoneExc911", function (phone) {
                createRuleTable(phone, address);
                getAddress("SelectAddressExc911")
                PromptNewAddress('Exc911')
                for (x in obj){

                    document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='exception" + obj[x].id + "'>" +
                            "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + obj[x].number + "</div>" +
                            "<div class='form-grid-entry'>" + obj[x].address + "</div>" +
                            "<input type='button' class='w-button' value='X' onclick='removeRule(" + obj[x].id + ", " + document.getElementById('SelectPhoneExc911').selectedIndex + ")'>" +
                        "</div>"
        
                    
                    ExceptionRules[obj[x].id] = {
                        phoneID: obj[x].id,
                        phone: obj[x].number,
                        addressID: obj[x].address_id,
                        address: obj[x].address,
                        location: "location"
                    }
        
                    delete normalRules[obj[x].id]
                    document.getElementById("rule" + obj[x].id).remove();
    
                    document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].disabled = true;
        
                }
            });
        });
    });

    fill411(function(data) {
        
        //console.log(data)
        if (data == "No" || data == "None"){
            $("#411No").prop("checked", true).trigger("click");
            
        }
        else{

            $("#411Yes").prop("checked", true).trigger("click");

            getAddress('SelectAddress411', function () {
                getPhone('SelectPhone411', function () {

                    var obj = JSON.parse(data);
                    
                    document.getElementById('CompanyName411').value = obj.listing_name;
                    document.getElementById('Category411').value = obj.category_listing;
                    document.getElementById('SelectAddress411').value = obj.listing_address_id;
                    document.getElementById('SelectPhone411').value = obj.listing_phone;
        
                })
            })

        }

    });

    fillExt(function(data) {
        
        //console.log(data)

    });

    fillUpload(function(data) {
        
        //console.log(data)

    });

});


