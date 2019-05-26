from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.shortcuts import resolve_url
from .forms import LoginForm

#Ensure user is logged in before they can access this view otherwise send to login form
@login_required
def index(request):
    return render(request, 'login/index.html')

#Login Protocol to handle user logins at the website front. NOT ADMIN
def loginProtocol(request):

    #Requests the next url to redirect to once login is completed
    if 'next' in request.GET:
        next = request.GET['next']
    else:
        #Otherwise send to the main page of website
        next = '/'

    #Ensures user is not already authenticated (Logged in)
    if request.user.is_authenticated:
       return redirect(next)

    #If POST data exists ie. Username and Password
    if request.method == 'POST':

        form = LoginForm(request.POST)

        #Gets and cleans data 
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            #Authenticates user using Authentication Model
            user = authenticate(request, username=username, password=password)

            #if user is successfully logged in 
            if user is not None:
                login(request, user)
                return redirect(next)
            #Otherwise add error. Page reloaded will pick up the issue
            form.add_error('password', 'Incorrect Credentials')
    #If post data does not exist then send back empty page with Form ready for user creds.
    else:
        form = LoginForm()
    
    #Sends this info to the HTML
    context = {
        'form' : form,
        'next' : next
    }
    #Render login HTML page
    return render(request, 'login/login.html', context)

#Protocol to handle user logot
def logoutProtocol(request):

    #logs out the user using Authentication model - Session is deleted 
    logout(request)
    
    #If Logout Url is giving in the Settings page - Then redirect to the site
    if settings.LOGOUT_REDIRECT_URL:
        next_page = resolve_url(settings.LOGOUT_REDIRECT_URL)
        return redirect(next_page)

    #Otherwise send to main page
    return redirect('/')

