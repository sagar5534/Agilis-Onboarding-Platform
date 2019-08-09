
$(document).ready(function () {
    $(".step1").hide();
    $(".step2").hide();
    //getPhone('SelectPhone')
    //getAddress('SelectAddress')
    $(".step3").hide();
    
    //getAddress('SelectAddress2');
    //getPhone('SelectPhone2');
    //getAddress('SelectAddress3');

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