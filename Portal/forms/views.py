from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *

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

    return HttpResponse(comp.company_name)

@login_required
def MainForm(request, company):


    return render(request, 'forms/main.html')

@login_required
def catch(request, company):

    if request.method == 'POST':

        email = request.POST['email']
        print(email)

        #form = LoginForm(request.POST)

        #if form.is_valid():
            #username = form.cleaned_data['username']
            #password = form.cleaned_data['password']


    return HttpResponse("")