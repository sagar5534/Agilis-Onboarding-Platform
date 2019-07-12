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

//Clearing Google Fill in Address Bar
function clearGoogleAddress(id) {
    document.getElementById("Suite" + id).value = ""
    document.getElementById("street_number" + id).value = ""
    document.getElementById("route" + id).value = ""
    document.getElementById("locality" + id).value = ""
    document.getElementById("administrative_area_level_1" + id).value = ""
    document.getElementById("postal_code" + id).value = ""
    document.getElementById("country" + id).value = ""
}


//Function to getAddress
function getAddress(element, callback) {
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
            if (element != 'SelectAddress2') {
                document.getElementById(element).innerHTML += '<option value=0>Add a new Address</option>'
            }

            if (element == 'SelectAddress2') {
                window.RuleAddress = data.address;
            }
            callback(data.address);
        });
};


//Function to getPhone
function getPhone(element, callback) {

    $.ajax({
            url: '/forms/getPhone',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            document.getElementById(element).innerHTML = ""

            RulePhone = data.phone
            if (element == "SelectPhone2") {
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'

            }
            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

            callback(data.phone);
        });
}


//Global Vars for Numbers - Form 
let portId = 1;
let discId = 1;


//Both Functions are for Numbers - Forms 
//Functions to remove Port Number
function removePortNumber(x) {
    document.getElementById("portnumber" + x).remove();
    document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portbr" + x).remove();
}


//Functions to remove Disc Number
function removeDiscNumber(x) {
    document.getElementById("discnumber" + x).remove();
    document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discbr" + x).remove();
}


//Functions to Add a Port Number
//Check if NEEDED
function addPortNumber() {
    portId++;
    $('#portnumberForm').append("<br id='portbr" + portId + "'><input id=portnumber" + portId + " name='phone' type='text'><button id='portremoveNumber" + portId + "' type=button onclick='removePortNumber(" + portId + ")'>X</button>");
}


//Function to Add a Disconnect Number
function addDiscNumber() {
    discId++;
    $('#discnumberForm').append("<br id='discbr" + discId + "'><input id=discnumber" + discId + " name='phone' type='text'><button id='discremoveNumber" + discId + "' type=button onclick='removeDiscNumber(" + discId + ")'>X</button>");
}


//Function to validate a phone number
function validatePhone(val) {
    var x = val
    x = x.replace('+1', '');
    x = x.replace(/[-+()\s]/g, '');
    return x;
}


//Global Vars for 911 Info 
var normalRules = {}
var ExceptionRules = {}


//Creating the rule table on page startup 911 Info - Forms
function createRuleTable(phone, address) {
    Object.keys(phone).forEach(function (key) {
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
}


//Adding a Rule into 911 Info - Forms
function addRule() {

    var phoneID = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value
    var addressID = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value
    console.log(document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text)
    if (phoneID != "0") {
        var phone = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text

        if (addressID != '0') {

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
        } else {
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
                    } else {
                        console.log("done")
                        getAddress('SelectAddress3', function (address) {
                            document.getElementById("SelectAddress3").selectedIndex = address.length - 1;
                            addRule()
                            document.getElementById('NewAddress3').style.display = "none"
                        });
                    }
                });
        }
    }
}


//Removing an Exception from 911 Info - Forms
function removeRule(id, location) {

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


//To merge two objects into one - 911 Info 
function merge_options(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}


 

function PromptNewAddress(period) {
    var sel = "SelectAddress" + period

    var address = document.getElementById(sel).options[document.getElementById(sel).selectedIndex].value;
    if (address == "0") {
        clearGoogleAddress(period)
        document.getElementById('NewAddress' + period).style.display = "block"
    } else {
        document.getElementById('NewAddress' + period).style.display = "none"
    }
}

function collapsible() {

    var coll = document.getElementsByClassName("collapsible");
    console.log(coll)
    var i;

    for (i = 0; i < coll.length; i++) {
        console.log(coll[i])
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
    }
}

//Step 5 - Extensions
ExtNum = 1;
function addExt(){

    document.getElementById('cards').innerHTML += '<button class="collapsible" type="button" id="ExtCard' + ExtNum + '">New Extension</button>' + 

    '<div class="content"> <br><br> <div id="locationField"> <label class="label">Extension #:</label> <input class="field" id="ExtNumber' + ExtNum + '" type="text" name="ExtNumber" maxlength="100" placeholder="Extension Number" required> <br> <label class="label" for="ExtName">Name:</label> <input class="field" id="ExtName" type="text" name="Name" maxlength="100" placeholder="Name" required> <br> <label class="label" for="ExtCallerID">Caller ID Name:</label> <input class="field" id="ExtCallerID" type="text" name="ExtCallerID" maxlength="100" placeholder="Caller ID Name" required> <br> <label class="label" for="ExtCallerID">Caller ID Number:</label> <select id="SelectPhoneExt"> </select> </div> <br><br><br> <div id="locationField"> <label class="label">Voicemail:</label><br> <input type="radio" id="radio-yes" name="optionV" value=1 checked>Yes<br> <input type="radio" id="radio-no" name="optionV" value=0>No<br> </div> <br><br><br> <div id="VTE"> <label class="label">Voicemail To Email:</label><br> <input type="radio" id="radio-yes" name="optionVTE" value=1 checked>Yes<br> <input type="radio" id="radio-no" name="optionVTE" value=0>No<br> <br> <div id="EmailVTE"> <label class="label" for="ExtEmail">Email:</label> <input class="field" id="ExtEmail" type="text" name="ExtEmail" maxlength="100" placeholder="Email For Voicemail" required> <br> </div> </div> <br><br> </div> '
    
    ExtNum++
    collapsible()

    $('#ExtNumber1').on('input', function() {
        document.getElementById('ExtCard1').innerHTML = '#' + document.getElementById('ExtNumber1').value
        console.log("DID")
    });

}


//Instructions that occur once document is ready
$(document).ready(function () {

    addExt()

    //A main site is changed on 911 Info - Form
    $("#SelectAddress2").change( function(e){
        e.preventDefault();
        document.getElementById('RulesTable').innerHTML = "<tr><th>Phone</th><th>Address</th><th></th></tr>"
    
        Object.keys(normalRules).forEach(function (key) {
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
    
     //Does user want to be listed in 411 Directory - 411 Directory - Forms
    $("input:radio[name='option']").click(function () {
        var radioValue = $("input[name='option']:checked").val();
        if (radioValue == 1) {
            document.getElementById('CompanyName411').disabled = false;
            document.getElementById('Category').disabled = false;
            document.getElementById('SelectAddress').disabled = false;
            document.getElementById('SelectPhone').disabled = false;
            //PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)

        } else {
            document.getElementById('NewAddress').style.display = "none"
            document.getElementById('CompanyName411').value = '';
            document.getElementById('CompanyName411').disabled = true;
            document.getElementById('Category').disabled = true;
            document.getElementById('SelectAddress').disabled = true;
            document.getElementById('SelectPhone').disabled = true;
        }
    });

    //Step 5 - Extenstions
    $("input:radio[name='optionV']").click(function () {
        var radioValue = $("input[name='optionV']:checked").val();
        if (radioValue == 1) {
            document.getElementById('VTE').style.display = "block"
            //PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)

        } else {
            document.getElementById('VTE').style.display = "none"
        }
    });

    $("input:radio[name='optionVTE']").click(function () {
        var radioValue = $("input[name='optionVTE']:checked").val();
        if (radioValue == 1) {
            document.getElementById('EmailVTE').style.display = "block"
            //PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)

        } else {
            document.getElementById('EmailVTE').style.display = "none"
        }
    });


    //Showing Screens
    $(".step1").hide();
    $(".step2").hide();
    $(".step3").hide();
    $(".step4").hide();
    getPhone('SelectPhoneExt', function(){})
    $(".step5").show();

    //Company Info
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
                    $(".step1").hide();
                    $(".step2").show();
                }
            });
    });

    //Port Number
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
                    } 
                    else {
                        getAddress('SelectAddress', function () {
                            $('#SelectAddress').on('change', PromptNewAddress(''))
                        })
                        getPhone('SelectPhone', function () {})
                       
                        $(".step2").hide();
                        $(".step3").show();
                    }
                });
        } else {
            alert("Please enter a Valid Phone Number")
        }

    });

    //411 Info
    $(".step3").submit(function (e) {

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
                    getAddress("SelectAddress2", function (address) {
                        getPhone("SelectPhone2", function (phone) {
                            createRuleTable(phone, address);
                            
                        });
                    });

                    $(".step3").hide();
                    $(".step4").show();
                    getAddress('SelectAddress3', function(){
                        $('#SelectAddress3').on('change', PromptNewAddress('3'))
                    })
                }
            });
    });

    //911 Info 
    $(".step4").submit(function (e) {

        data = merge_options(normalRules, ExceptionRules)

        e.preventDefault();
        $.ajax({
                url: '/forms/catch4',
                data: JSON.stringify(data),
                contentType: "application/json",
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
                    addExt()
                    $(".step5").show();
                }
            });
    });

    //911 Info 
    $(".step5").submit(function (e) {

        data = merge_options(normalRules, ExceptionRules)

        e.preventDefault();
        $.ajax({
                url: '/forms/catch4',
                data: JSON.stringify(data),
                contentType: "application/json",
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
                    $(".step5").hide();
                }
            });
    });



});

