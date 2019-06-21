from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
from django import forms
from django.http import JsonResponse
import json

#Main page user hits once logged in
@login_required
def index(request):

    #list all users connections to company 
    comps = []
 
    Companies = UserCompLink.objects.filter(user_id=request.user.id)
    for x in Companies:
        comps.append(Company.objects.get(id=x.company_id))
    
    context = {
        'companies': comps
    }
    
    return render(request, 'forms/index.html', context)


#Page with details for specific site - Presents information that users need to continue
@login_required
def detail(request, company):

    #Ensure user is authenticated and can view
    get_object_or_404(UserCompLink, company_id=company, user_id=request.user.id)

    #Getting Company Object
    comp = Company.objects.get(id=company)
    request.session['company'] = comp.pk

    context = {
        'company': comp
    }

    return render(request, 'forms/detail.html', context )

@login_required
def MainForm(request):
    #Work with company session 
    comps = request.session.get('company')
    context = {
        'company': comps
    }

    return render(request, 'forms/mainForm.html', context )


def form_response(form):

    if (form.errors):
        error_dict= {
            'status':'form-invalid',
            'formerrors':form.errors
        }
    else:
        error_dict= {
            'status':'form-valid',
        }
    return HttpResponse(json.dumps(error_dict),content_type="application/json")


@login_required
def getAddress(request):

    if request.session.get('company'):
        company = request.session.get('company')
    else:
        return Http404

    temp = CompanyAddressLink.objects.filter(Company_id=company)

    y = '{ "address": ['

    for idx,item in enumerate(temp):
        temp2 = Address.objects.get(id=item.Address_id)
        
        if temp2.Suite == "":
            suiteHandler = ""
        else:
            suiteHandler =  str(temp2.Suite) + ' - '

        x = {
            'address': suiteHandler + str(temp2.StreetNum) + " " + temp2.Street + ', ' +temp2.City + ', ' + temp2.Prov,
            'id': temp2.id
        }

        if idx==0:
            y = y + json.dumps(x)
        else:
            y = y + ',' + json.dumps(x)

    y = y + ']}'

    print(y)
    return HttpResponse(y,content_type="application/json")
    

@login_required
def catch(request):

    if request.session.get('company'):
        company = request.session.get('company')
    else:
        return Http404

    if request.method == 'POST':
        form = CompanyData(request.POST)
    else:
        return Http404

    if form.is_valid():
        if form.checkPostal():
            companyName = form.cleaned_data['companyName']
            Type = form.cleaned_data['type']
            CurProvider = form.cleaned_data['CurProvider']
            Suite = form.cleaned_data['Suite']
            StreetNum = form.cleaned_data['StreetNum']
            Street = form.cleaned_data['Street']
            City = form.cleaned_data['City']
            Prov = form.cleaned_data['Prov']
            Postal = form.cleaned_data['Postal']
            Country = form.cleaned_data['Country']
        else:
            form.add_error('Postal Code Error', "Please Enter a Valid Postal Code/Zip")
    else:
        return form_response(form)
    

    try:
        tempAddress = Address.objects.get(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
    except Address.DoesNotExist:
        tempAddress = Address.objects.create(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
        tempAddress.save()
        tempLink = CompanyAddressLink.objects.create(Address_id=tempAddress.pk, Company_id=company)
        tempLink.save()

    #Company  
    temp = Company.objects.get(id=company)
    temp.company_name = companyName
    temp.type = Type
    temp.site_address = tempAddress
    temp.currentProvider = CurProvider
    temp.save()

    return form_response(form)


@login_required
def catch2(request):

    if request.session.get('company'):
        company = request.session.get('company')
    else:
        return Http404

    if request.method == 'POST':
        if request.POST.get('ignore'):
            comp = Company.objects.get(pk=company)
            comp.listing_name = ""
            comp.category_listing = ""
            comp.listing_phone = ""
            comp.listing_address_id = ""
            comp.save()

            error_dict= {
                'status':'form-valid',
            }
            return HttpResponse(json.dumps(error_dict),content_type="application/json")

        form = Data411(request.POST)
    else:
        return Http404

    if form.is_valid():
        
        CompanyName411 = form.cleaned_data['CompanyName411']
        Category = form.cleaned_data['Category']
        Phone411 = form.cleaned_data['Phone411']

        if request.POST.get('Suite2'):
            Suite = form.cleaned_data['Suite2']
            StreetNum = form.cleaned_data['StreetNum2']
            Street = form.cleaned_data['Street2']
            City = form.cleaned_data['City2']
            Prov = form.cleaned_data['Prov2']
            Postal = form.cleaned_data['Postal2']
            Country = form.cleaned_data['Country2']
        else:
            address = get_object_or_404(Address, pk=form.cleaned_data['address'])
    else:
        return form_response(form)

    Phone411 = Phone411.replace('+1', '')
    Phone411 = Phone411.replace('(', '')
    Phone411 = Phone411.replace(')', '')
    Phone411 = Phone411.replace('+', '')
    Phone411 = Phone411.replace('-', '')

    if (len(Phone411) != 10 or Phone411.isdigit() == False):
        form.add_error('Phone411', "Please Enter a Valid Phone Number")
        return form_response(form)
   
    
    if request.POST.get('Suite2'):
        try:
            address = Address.objects.get(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
            #Is it adding to CompanyAddressLink
        except Address.DoesNotExist:
            address = Address.objects.create(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
            address.save()
            linkAddress = CompanyAddressLink.objects.create(Address_id=address.pk, Company_id=company)
            linkAddress.save()
    
    comp = Company.objects.get(pk=company)
    comp.listing_name = CompanyName411
    comp.category_listing = Category
    comp.listing_phone = Phone411
    comp.listing_address_id = address
    comp.save()

    return form_response(form)
    

@login_required
def catch3(request):

    if request.session.get('company'):
        company = request.session.get('company')
    else:
        return Http404

    if request.method == 'POST':
        json_data = json.loads(request.body) # request.raw_post_data w/ Django < 1.4
        try:
            disc = json_data['disc']
            port = json_data['port']

            for x in disc:
                try:
                    Numbers.objects.get(number=x, company_id=company, Type=0)
                
                except Numbers.DoesNotExist:
                    Numbers.objects.create(number=x, company_id=company, Type=0)
            

            for x in port:
                try:
                    Numbers.objects.get(number=x, company_id=company, Type=1)
                
                except Numbers.DoesNotExist:
                    Numbers.objects.create(number=x, company_id=company, Type=1)

        except KeyError:
            Http404("Malformed data!")
    else:
        return Http404;

    error_dict = {
        'status':'form-valid',
    }

    return HttpResponse(json.dumps(error_dict),content_type="application/json")
