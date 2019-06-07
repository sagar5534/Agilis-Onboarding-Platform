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
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


$(document).ready(function()
{   
    $(".step1").show();
    $(".step2").hide();
    $(".step3").hide();
    
    $(".step1").submit(function(e)
    {   
        e.preventDefault();
        $.ajax({
            url : '/forms/catch',
            data : 
            {
                companyName : $(".step1").children().children("input[name='CompanyName']").val(),
                type : document.getElementById("id_Bus_Res").options[document.getElementById("id_Bus_Res").selectedIndex].text,
                CurProvider : $(".step1").children().children("input[name='CurProvider']").val(),
                Suite : document.getElementById("Suite").value,
                StreetNum : document.getElementById("street_number").value,
                Street : document.getElementById("route").value,
                City : document.getElementById("locality").value,
                Prov : document.getElementById("administrative_area_level_1").value,
                Postal : document.getElementById("postal_code").value,
                Country : document.getElementById("country").value,
            },
            method : 'POST',
            success: function(data) {
               

            },
            error: function(data) {
                
            }
        })
       .done(function(data)
        {   
            if (data.status=="form-invalid") {
                //Fix errors
                alert(data.formerrors['Postal'])
                console.log(data)
                //$('.class-name').html(data.form-errors)
            }
            else{
                //If valid form
                $(".step2").show();
                $(".step1").hide();
            }
        });
    });

    $(".step2").submit(function(e)
    {
        e.preventDefault();
        
        $.ajax({
           url : '/forms/1/catch',
           data : 
           { 
            email : $(".step2").children("input[name='email']").val(),
           },
           method : 'POST'
       })
       .done(function(data)
       {
           $(".step3").show();
           $(".step2").hide();
       });
    });

    $(".step3").submit(function(e)
    {
        e.preventDefault();
        
        $.ajax({
           url : '/echo/html/',
           data : { phone : $(".step3").children("input[name='phone']").val(), html : 'test' },
           method : 'POST'
       })
       .done(function(data)
       {
           $(".step3").hide();

           // We're done :)
       });
    });
});