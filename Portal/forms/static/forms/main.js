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

function clearGoogleAddress(id){
    document.getElementById("Suite" + id).value = ""
    document.getElementById("street_number" + id).value = ""
    document.getElementById("route" + id).value = ""
    document.getElementById("locality" + id).value = ""
    document.getElementById("administrative_area_level_1" + id).value = ""
    document.getElementById("postal_code" + id).value = ""
    document.getElementById("country" + id).value = ""
}

function PromptNewAddress(period) {
    if (period == "0") {
        document.getElementById('NewAddress').style.display = "block"
    } else {
        document.getElementById('NewAddress').style.display = "none"
    }
}

function getAddress(element, callback){

    $.ajax({
            url: '/forms/getAddress',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            document.getElementById(element).innerHTML = ""

            for (x in data.address) {
                document.getElementById(element).innerHTML += '<option value=' + data.address[x].id + '>' + data.address[x].address + '</option>'
            }
            if (element != 'SelectAddress2'){
                document.getElementById(element).innerHTML += '<option value=0>Add a new Address</option>'
            }

            if (element == 'SelectAddress2'){
                window.RuleAddress = data.address;
            }
            callback(data.address);
        });
};



function getPhone(element, callback) {

    $.ajax({
            url: '/forms/getPhone',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            document.getElementById(element).innerHTML = ""
            
            RulePhone = data.phone
            if (element == "SelectPhone2"){
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'
                
            }
            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

            callback(data.phone);
        });
}

let portId = 1; 
let discId = 1;

function removePortNumber(x) {
    document.getElementById("portnumber" + x).remove();
    document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portbr" + x).remove();
}

function removeDiscNumber(x) {
    document.getElementById("discnumber" + x).remove();
    document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discbr" + x).remove();
}

function addPortNumber() {
    portId++;
    $('#portnumberForm').append("<br id='portbr" + portId + "'><input id=portnumber" + portId + " name='phone' type='text'><button id='portremoveNumber" + portId + "' type=button onclick='removePortNumber(" + portId + ")'>X</button>");
}

function addDiscNumber() {
    discId++;
    $('#discnumberForm').append("<br id='discbr" + discId + "'><input id=discnumber" + discId + " name='phone' type='text'><button id='discremoveNumber" + discId + "' type=button onclick='removeDiscNumber(" + discId + ")'>X</button>");
}

function validatePhone(val) {
    var x = val
    x = x.replace('+1', '');
    x = x.replace(/[-+()\s]/g, '');
    return x;
}

var normalRules = []
var ExceptionRules = {}

function createRuleTable(phone, address) {

    Object.keys(phone).forEach(function(key){
        normalRules[phone[key].id] = {
            phoneID: phone[key].id,
            addressID: address[0].id,
            phone: phone[key].phone,
            address: address[0].address
        }

        document.getElementById('RulesTable').innerHTML += '<tr id="rule' + phone[key].id + '">' +
                                                                '<td>' + phone[key].phone + '</td>' + 
                                                                '<td>' + address[0].address + '</td>' +
                                                            '</tr>'
    });

    console.log(normalRules)
    console.log(phone)
    console.log(address)
}

function addRule() {
    
    var phoneID = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value
    var addressID = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value
    console.log(document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text)
    if (phoneID != "0"){
        var phone = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text

        if (addressID != '0'){
            
            var address = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text

            document.getElementById('ExceptionsTable').innerHTML += '<tr id="exception' + phoneID + '">' +
                                                                    '<td>' + phone + '</td>' + 
                                                                    '<td>' + address + '</td>' +
                                                                    '<td>' +
                                                                        '<button type=button onclick="removeRule(' + phoneID + ', ' + document.getElementById("SelectPhone2").selectedIndex + ')">X</button>' +
                                                                    '</td>' +
                                                                '</tr>'
            
            ExceptionRules[document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value] = {
                phoneID: document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value,
                phone: document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text,
                addressID: document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value,
                address: document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text
            }
            
            delete normalRules[phoneID]
            document.getElementById("rule" + phoneID).remove();
        
            document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].disabled = true;
            document.getElementById("SelectPhone2").selectedIndex = 0;
        }
        else{
            //Create a new address
            data = {
                Suite: document.getElementById("Suite3").value,
                StreetNum: document.getElementById("street_number3").value,
                Street: document.getElementById("route3").value,
                City: document.getElementById("locality3").value,
                Prov: document.getElementById("administrative_area_level_13").value,
                Postal: document.getElementById("postal_code3").value,
                Country: document.getElementById("country3").value,
            }

            $.ajax({
                url: '/forms/setAddress',
                data: data,
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    var output = '';
                    for (var property in data.formerrors) {
                        output += data.formerrors[property] + '\n';
                    }
                    alert(output);
                } 
                
                else {
                    console.log("done")
                    getAddress('SelectAddress3', function(address){
                        document.getElementById("SelectAddress3").selectedIndex = address.length - 1;
                        addRule()
                        document.getElementById('NewAddress3').style.display = "none"
                    });  
                }
            });
        }
    }
}

function removeRule(id, location){

    var addressID = document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].value
    var address = document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].text

    normalRules[id] = {
        phoneID: ExceptionRules[id].phoneID,
        addressID: addressID,
        phone: ExceptionRules[id].phone,
        address: address
    }

    document.getElementById('RulesTable').innerHTML += '<tr id="rule' + normalRules[id].phoneID + '">' +
                                                            '<td>' + normalRules[id].phone + '</td>' + 
                                                            '<td>' + normalRules[id].address + '</td>' +
                                                        '</tr>'

    delete ExceptionRules[id]
    document.getElementById("SelectPhone2").options[location].disabled = false;
    document.getElementById("exception" + id).remove();

    console.log(ExceptionRules)
    console.log(normalRules)
    
}

$(document).ready(function () {
    
    //For Step 2 --- Yes or No for Directory Listing
    $("input:radio[name='option']").click(function () {
        var radioValue = $("input[name='option']:checked").val();
        if (radioValue == 1) {
            document.getElementById('CompanyName411').disabled = false;
            document.getElementById('Category').disabled = false;
            document.getElementById('phone').disabled = false;
            document.getElementById('SelectAddress').disabled = false;
            document.getElementById('SelectPhone').disabled = false;
            PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)
            PromptNewPhone(document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].value)

        } else {
            document.getElementById('NewAddress').style.display = "none"
            document.getElementById('CompanyName411').value = '';
            document.getElementById('CompanyName411').disabled = true;
            document.getElementById('Category').disabled = true;
            document.getElementById('phone').disabled = true;
            document.getElementById('SelectAddress').disabled = true;
            document.getElementById('SelectPhone').disabled = true;
        }
    });

    $("#SelectAddress2").on('change', function() {
        
        document.getElementById('RulesTable').innerHTML = "<tr><th>Phone</th><th>Address</th><th></th></tr>"

        Object.keys(normalRules).forEach(function(key){
            normalRules[key] = {
                phone: normalRules[key].phone,
                phoneID: normalRules[key].phoneID,
                address: document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].text,
                addressID: document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].value
            }
            
            document.getElementById('RulesTable').innerHTML += '<tr id="rule' + normalRules[key].phoneID + '">' +
                                                                    '<td>' + normalRules[key].phone + '</td>' + 
                                                                    '<td>' + normalRules[key].address + '</td>' +
                                                                '</tr>'
        });

    });

    //Hiding for the Address on Step 4
    $("#SelectAddress3").on('change', function() {
        var add3 = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value;
        if (add3 == "0"){
            clearGoogleAddress(3)
            document.getElementById('NewAddress3').style.display = "block"
        }else{
            document.getElementById('NewAddress3').style.display = "none"
        }
    });
    
    //Showing Screens
    $(".step1").hide();
    $(".step2").hide();
    getPhone('SelectPhone', function(){})
    getAddress('SelectAddress', function(){})
    $(".step3").hide();
    
    getAddress("SelectAddress2", function(address) {
        getPhone("SelectPhone2", function(phone) {
            createRuleTable(phone, address);
        });
    });
    getAddress('SelectAddress3', function(){})
    $(".step4").show();
    
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
                    alert(data.formerrors.Phone411)
                } else {
                    //If valid form
                    getAddress('SelectAddress')
                    $(".step1").hide();
                    $(".step2").show();
                }
            });
    });

    //Step 2
    $(".step2").submit(function (e) {
        e.preventDefault();

        var formCorrect = true;

        var div = document.getElementById('portnumberForm')
        var children = div.childNodes;
        var elements = [];
        for (var i = 0; i < div.childNodes.length; i++) {
            var child = div.childNodes[i];
            if (child.name == 'phone') {
                if (!(child.value == "")) {
                    child.value = validatePhone(child.value)
                    if (child.value.length == 10 && (/^\d+$/.test(child.value))) {
                        elements.push(child.value)
                    } else {
                        formCorrect = false;
                        break;
                    }
                }
            }
        }

        var div = document.getElementById('discnumberForm')
        var children = div.childNodes;
        var discelements = [];
        for (var i = 0; i < div.childNodes.length; i++) {
            var child = div.childNodes[i];
            if (child.name == 'phone') {
                if (!(child.value == "")) {
                    child.value = validatePhone(child.value)
                    if (child.value.length == 10 && (/^\d+$/.test(child.value))) {
                        discelements.push(child.value)
                    } else {
                        formCorrect = false;
                        break;
                    }
                }
            }
        }

        if (formCorrect == true) {
            //Data
            let Data = {
                port: elements,
                disc: discelements
            }

            $.ajax({
                    url: '/forms/catch2',
                    data: JSON.stringify(Data),
                    contentType: "application/json",
                    method: 'POST'
                })
                .done(function (data) {
                    if (data.status == "form-invalid") {
                        alert(data.formerrors.Phone411)
                    } else {
                        //If valid form
                        getPhone('SelectAddress')
                        $(".step2").hide();
                        $(".step3").show();
                    }
                });
        } else {
            alert("Please enter a Valid Phone Number")
        }

    });

    //Step 3
    $(".step3").submit(function (e) {

        //Type of Data to be send over to Catch2
        if (document.getElementById('radio-yes').checked == true) {
            if (document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value == 0) {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category').value,
                    Phone411: document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].text,
                    Suite: document.getElementById("Suite2").value,
                    StreetNum: document.getElementById("street_number2").value,
                    Street: document.getElementById("route2").value,
                    City: document.getElementById("locality2").value,
                    Prov: document.getElementById("administrative_area_level_12").value,
                    Postal: document.getElementById("postal_code2").value,
                    Country: document.getElementById("country2").value,
                }
            } else {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category').value,
                    Phone411: document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].text,
                    address: document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value
                }
            }
        } else {
            data = {
                ignore: 1
            }
        }
        
        e.preventDefault();
        $.ajax({
                url: '/forms/catch3',
                data: data,
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    var output = '';
                    for (var property in data.formerrors) {
                        output += data.formerrors[property] + '\n';
                    }
                    alert(output);
                } else {
                    $(".step3").hide();
                }
            });
    });

    $(".step4").submit(function (e) {

        e.preventDefault();
        $.ajax({
                url: '/forms/catch4',
                data: data,
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    var output = '';
                    for (var property in data.formerrors) {
                        output += data.formerrors[property] + '\n';
                    }
                    alert(output);
                } else {
                    $(".step4").hide();
                }
            });
    });

});