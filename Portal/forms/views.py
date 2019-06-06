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

    return HttpResponse(comp.company_name)

@login_required
def MainForm(request):
    #Work with company session 
    comps = request.session.get('company')
    context = {
        'company': comps
    }

    return render(request, 'forms/main.html', context )


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
    print(error_dict)
    return HttpResponse(json.dumps(error_dict),content_type="application/json")

@login_required
def catch(request):

    if request.session.get('company'):
        company = request.session.get('company')

        if request.method == 'POST':

            form = CompanyData(request.POST)

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
                    
                    try:
                        tempAddress = Address.objects.get(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
                    except Address.DoesNotExist:
                        tempAddress = Address.objects.create(Suite=Suite, StreetNum=StreetNum, Street=Street, City=City, Prov=Prov, Postal=Postal, Country=Country)
                        tempAddress.save()

                    #Company
                    temp = Company.objects.get(id=company)
                    temp.company_name = companyName
                    temp.type = Type
                    temp.site_address = tempAddress
                    temp.currentProvider = CurProvider
                    temp.save()

                else:
                    form.add_error('Postal', "Please Enter a Valid Zip")

        return form_response(form)

    return HttpResponse('Error')
    
    
