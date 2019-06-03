from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from .models import *


@login_required
def index(request):
    user = request.user

    #list all users connections to company 
    comps = []
 
    q = UserCompLink.objects.filter(user_id=user.id)
    for x in q:
        comps.append(Company.objects.get(id=x.company_id))
    
    context = {
        'companies': comps
    }
    
    return render(request, 'forms/index.html', context)

@login_required
def detail(request, company):

    #Ensure user is authenticated and can view
    get_object_or_404(UserCompLink, company_id=company, user_id=request.user.id)

    #Getting Company Object
    comp = Company.objects.get(id=company)

    return HttpResponse(comp.company_name)