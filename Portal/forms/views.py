from django.shortcuts import (
    get_object_or_404,
    render,
    redirect,
)
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
from django import forms
from django.http import JsonResponse
import json

# Main page user hits once logged in
@login_required
def index(request):

    # list all users connections to company
    comps = []

    Companies = UserCompLink.objects.filter(
        user_id=request.user.id
    )
    for x in Companies:
        comps.append(Company.objects.get(id=x.company_id))

    context = {"companies": comps, 
               'user': request.user.email}

    return render(request, "forms/index.html", context)

# Page with details for specific site - Presents information that users need to continue
@login_required
def detail(request, company):

    # Ensure user is authenticated and can view
    get_object_or_404(
        UserCompLink,
        company_id=company,
        user_id=request.user.id,
    )

    # Getting Company Object
    comp = Company.objects.get(id=company)
    request.session["company"] = comp.pk

    context = {"company": comp, 
               'user': request.user.email}

    return render(request, "forms/site.html", context)


@login_required
def MainForm(request):
    # Work with company session
    comps = request.session.get("company")
    context = {"companies": comps, 
               'user': request.user.email}

    return render(request, "forms/submit.html", context)


def form_response(form):
    
    if form.errors:
        error_dict = {
            "status": "form-invalid",
            "formerrors": form.errors,
        }
    else:
        error_dict = {"status": "form-valid"}

    return HttpResponse(
        json.dumps(error_dict),
        content_type="application/json",
    )


@login_required
def getAddress(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        return Http404

    temp = CompanyAddressLink.objects.filter(
        Company_id=company
    )

    list_values = []
    for each in temp:

        temp2 = Address.objects.get(id=each.Address_id)
        if temp2.Suite == "":
            suiteHandler = ""
        else:
            suiteHandler = "Suite:" + str(temp2.Suite) + " -"

        list_values.append({
            "address": suiteHandler + temp2.StreetAddress + ", " + temp2.Postal,
            "id": temp2.id,
        })

    y = json.dumps(list_values)

    return HttpResponse(y)


@login_required
def getPhone(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        return Http404

    temp = Numbers.objects.filter(
        company_id=company, Type=1
    )

    y = '{ "phone": ['

    for idx, item in enumerate(temp):

        x = {"phone": item.number, "id": item.id}

        if idx == 0:
            y = y + json.dumps(x)
        else:
            y = y + "," + json.dumps(x)

    y = y + "]}"

    return HttpResponse(y, content_type="application/json")

@login_required
def setAddress(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        raise Http404

    if request.method == "POST":
        form = SetAddress(request.POST)
    else:
        raise Http404

    if form.is_valid():
            Suite = form.cleaned_data["Suite"]
            StreetAddress = form.cleaned_data["StreetAddress"]
            Postal = form.cleaned_data["Postal"]
            Country = form.cleaned_data["Country"]
    else:
        return form_response(form)

    tempAddress = Address.objects.create(
            Suite=Suite,
            StreetAddress=StreetAddress,
            Postal=Postal,
    )
    tempAddress.save()
    tempLink = CompanyAddressLink.objects.create(
        Address_id=tempAddress.pk, Company_id=company
    )
    tempLink.save()

    y = '{ "address": ['

    if tempAddress.Suite == "":
        suiteHandler = ""
    else:
        suiteHandler = str(tempAddress.Suite) + " - "
    
    x = {
        "address": suiteHandler
        + str(tempAddress.StreetAddress)
        + ", "
        + tempAddress.Postal,
        "id": tempAddress.id,
    }

    y = y + json.dumps(x)
    y = y + "]"
    y = y + ', "status": "form-valid"}'

    return HttpResponse(y, content_type="application/json")


@login_required
def catchCompany(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        raise Http404

    if request.method == "POST":
        form = CompanyData(request.POST)
    else:
        raise Http404

    if form.is_valid():
        if form.checkPostal():
            companyName = form.cleaned_data["companyName"]
            Type = form.cleaned_data["type"]
            CurProvider = form.cleaned_data["CurProvider"]
            Postal = form.cleaned_data["Postal"]
            StreetAddress = form.cleaned_data["StreetAddress"]
            Suite = form.cleaned_data["Suite"]

        else:
            form.add_error(
                "Postal Code Error",
                "Please Enter a Valid Postal Code/Zip",
            )
    else:
        return form_response(form)

    try:
        tempAddress = Address.objects.get(
            Suite=Suite,
            Postal=Postal,
            StreetAddress=StreetAddress
        )
    except Address.DoesNotExist:
        tempAddress = Address.objects.create(
            Suite=Suite,
            Postal=Postal,
            StreetAddress=StreetAddress
        )
        tempAddress.save()
        tempLink = CompanyAddressLink.objects.create(
            Address_id=tempAddress.pk, Company_id=company
        )
        tempLink.save()

    # Company
    temp = Company.objects.get(id=company)
    temp.company_name = companyName
    temp.type = Type
    temp.site_address = tempAddress
    temp.currentProvider = CurProvider
    temp.save()

    return form_response(form)


@login_required
def catchPorting(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        return Http404

    if request.method == "POST":

        json_data = json.loads(request.body)
        try:
            port = json_data["port"]
            disc = json_data["disc"]
            
            #Delete at first for removed numbers
            serverPort = Numbers.objects.filter(company_id=company, Type=1)
            for serverEach in serverPort:
                exists = False
                for each in port:
                    if (serverEach.number == each):
                        exists = True
                        break
                if exists == False:
                    #Delete
                    x = Numbers.objects.get(
                        number=serverEach.number, company_id=company, Type=1
                    )
                    x.delete()

            
            serverDisc = Numbers.objects.filter(company_id=company, Type=0)
            for serverEach in serverDisc:
                exists = False
                for each in disc:
                    if (serverEach.number == each):
                        exists = True
                        break
                if exists == False:
                    #Delete
                    x = Numbers.objects.get(
                        number=serverEach.number, company_id=company, Type=0
                    )
                    x.delete()



            #Find any dupl and keep otherwise add
            for x in port:
                try:
                    Numbers.objects.get(
                        number=x, company_id=company, Type=1
                    )

                except Numbers.DoesNotExist:
                    Numbers.objects.create(
                        number=x, company_id=company, Type=1
                    )

            for x in disc:
                try:
                    Numbers.objects.get(
                        number=x, company_id=company, Type=0
                    )

                except Numbers.DoesNotExist:
                    Numbers.objects.create(
                        number=x, company_id=company, Type=0
                    )

        except KeyError:
            Http404("Malformed data!")
    else:
        return Http404

    error_dict = {"status": "form-valid"}

    return HttpResponse(
        json.dumps(error_dict),
        content_type="application/json",
    )


@login_required
def catch411(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        return Http404

    if request.method == "POST":
        if request.POST.get("ignore"):
            comp = Company.objects.get(pk=company)
            comp.directory_listing = 0
            comp.listing_name = ""
            comp.category_listing = ""
            comp.listing_phone = ""
            comp.listing_address_id = ""
            comp.save()

            error_dict = {"status": "form-valid"}
            return HttpResponse(
                json.dumps(error_dict),
                content_type="application/json",
            )

        form = Data411(request.POST)
    else:
        return Http404

    if form.is_valid():

        CompanyName411 = form.cleaned_data["CompanyName411"]
        Category = form.cleaned_data["Category"]
        Phone411 = form.cleaned_data["Phone411"]

        if request.POST.get("Postal"):
            Suite = form.cleaned_data["Suite"]
            StreetAddress = form.cleaned_data["StreetAddress"]
            Postal = form.cleaned_data["Postal"]
            Country = form.cleaned_data["Country"]
        else:
            address = get_object_or_404(
                Address, pk=form.cleaned_data["address"]
            )
    else:
        return form_response(form)

    if request.POST.get("Postal"):
        try:
            address = Address.objects.get(
                Suite=Suite,
                StreetAddress=StreetAddress,
                Postal=Postal
            )
            # Is it adding to CompanyAddressLink
        except Address.DoesNotExist:
            address = Address.objects.create(
                Suite=Suite,
                StreetAddress=StreetAddress,
                Postal=Postal
            )
            address.save()
            linkAddress = CompanyAddressLink.objects.create(
                Address_id=address.pk, Company_id=company
            )
            linkAddress.save()

    comp = Company.objects.get(pk=company)
    comp.listing_name = CompanyName411
    comp.category_listing = Category
    comp.listing_phone = Phone411
    comp.listing_address_id = address
    comp.save()

    return form_response(form)


@login_required
def catch911(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        return Http404

    if request.method == "POST":
        json_data = json.loads(request.body)
        
        for i in json_data:
            pid = json_data[i]['phoneID']
            aid = json_data[i]['addressID']
            print(str(pid) + "- " + str(aid))

            
            tempNum = Numbers.objects.get(pk=pid)
            tempNum.Address_911_id = aid
            tempNum.save()

    else:
        return Http404
    
    return HttpResponse("Done")

@login_required
def catchExt(request):

    return HttpResponse("Done")


@login_required
def initCompany(request):

    if request.session.get("company"):
        company = request.session.get("company")
        print(company)
    else:
        raise Http404

    if request.method == "POST":
        
        compData = Company.objects.get(id=company)
        print(compData.site_address_id)

        compAddress = Address.objects.get(id=compData.site_address_id)
        print(compAddress)

        if compData.company_name != "New Application":
            x = {
                "company_name": compData.company_name,
                "type": compData.type,
                "currentProvider": compData.currentProvider,
                "StreetAddress": compAddress.StreetAddress,
                "Postal": compAddress.Postal,
                "Suite": compAddress.Suite,
            }
            y = json.dumps(x)
            return HttpResponse(y)

    else:
        raise Http404

    return HttpResponse("Done")
  
@login_required
def initPort(request):

    if request.session.get("company"):
        company = request.session.get("company")
        print(company)
    else:
        raise Http404

    if request.method == "POST":
        x = {}
        portData = Numbers.objects.filter(company_id=company, Type=1)
        
        for each in portData:
            print(each.number)
            x[each.number] = 1
        
        discData = Numbers.objects.filter(company_id=company, Type=0)

        for each in discData:
            print(each.number)
            x[each.number] = 0
        
        y = json.dumps(x)
        return HttpResponse(y)

    else:
        raise Http404

    return HttpResponse("Done")
  
@login_required
def init911(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        raise Http404

    if request.method == "POST":
        numbers = Numbers.objects.filter(company_id=company, Type=1)
        list_with_values = []

        for each in numbers:
            if each.Address_911_id != None:
                add = Address.objects.get(id=each.Address_911_id)

                list_with_values.append({
                    "number": each.number,
                    "address_id": add.id,
                    "id": each.id,
                    "address": add.StreetAddress
                })

        y = json.dumps(list_with_values)
        return HttpResponse(y)

    else:
        raise Http404

    return HttpResponse("Done")

@login_required
def init411(request):

    if request.session.get("company"):
        company = request.session.get("company")
    else:
        raise Http404

    if request.method == "POST":
        
        compData = Company.objects.get(id=company)
        if (compData.directory_listing == "0"):
            #None Exists
            return HttpResponse("No")
        elif (compData.directory_listing == "1"):

            #compAddress = Address.objects.get(id=compData.listing_address_id)
            x = {
                "listing_name": compData.listing_name,
                "category_listing": compData.category_listing,
                "listing_phone": compData.listing_phone,
                "listing_address_id": compData.listing_address_id,
            }
            y = json.dumps(x)
            return HttpResponse(y)
        else:
            return HttpResponse("None")
    else:
        raise Http404

    return HttpResponse("Done")

@login_required
def initExt(request):

    
    return HttpResponse("Done")
  
@login_required
def initUpload(request):

    
    return HttpResponse("Done")