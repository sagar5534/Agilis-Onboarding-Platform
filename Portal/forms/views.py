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

    y = '{ "address": ['

    for idx, item in enumerate(temp):
        temp2 = Address.objects.get(id=item.Address_id)

        if temp2.Suite == "":
            suiteHandler = ""
        else:
            suiteHandler = str(temp2.Suite) + " - "

        x = {
            "address": suiteHandler
            + temp2.StreetAddress
            + ", "
            + temp2.Postal,
            "id": temp2.id,
        }

        if idx == 0:
            y = y + json.dumps(x)
        else:
            y = y + "," + json.dumps(x)

    y = y + "]}"

    
    return HttpResponse(y, content_type="application/json")


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

        print(request.POST)

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

    print(request)
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
