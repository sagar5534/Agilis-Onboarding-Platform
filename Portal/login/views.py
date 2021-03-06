from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.shortcuts import resolve_url
from .forms import LoginForm
from .models import *
from urllib.parse import urlparse, urlunparse
from django.conf import settings
from django.contrib.auth import (
    REDIRECT_FIELD_NAME, get_user_model, login as auth_login,
    logout as auth_logout, update_session_auth_hash,
)
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import (
    AuthenticationForm, PasswordChangeForm, PasswordResetForm, SetPasswordForm,
)
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect, QueryDict
from django.shortcuts import resolve_url
from django.urls import reverse_lazy

from django.utils.decorators import method_decorator
from django.utils.http import is_safe_url, urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from forms.models import *
from django.core.mail import send_mail


#Ensure user is logged in before they can access this view otherwise send to login form
@login_required
def index(request):
    #Sending to Forms/Index
    return redirect(reverse('index'))

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
            username = form.cleaned_data['Email']
            password = form.cleaned_data['Password']

            #Authenticates user using Authentication Model
            user = authenticate(request, username=username, password=password)

            #if user is successfully logged in 
            if user is not None:
                login(request, user)
                return redirect(next)
            #Otherwise add error. Page reloaded will pick up the issue
            form.add_error('Password', 'Incorrect Credentials')
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

import re

@login_required
def register_user(request):

    print("Here")
    if not request.user.is_superuser:
       return HttpResponse('This user does not have access!')

    if request.method == 'POST':
        print("InPost")
        register = MyUser()
        register.email = request.POST['Email']
        register.first_name = request.POST['FName']
        register.last_name = request.POST['LName']
        compId = request.POST['ID']
        compId = compId.upper()

        pattern = re.compile("^ORD-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$")
        if (pattern.match(compId)):
            try:   
                tempUser = MyUser.objects.get(email=register.email)
                if (tempUser):
                    try:
                        tempComp = Company.objects.get(order=compId)
                        if (tempComp):
                            x = UserCompLink.objects.create(company_id=tempComp.id, user_id=tempUser.id)
                            x.save()
                            return HttpResponse("User has been connected to pre-existing application")

                    except Company.DoesNotExist:
                        user = MyUser.objects.get(email=register.email)
                        x = Company.objects.create(order=compId, completed=0, company_name='New Application')
                        UserCompLink.objects.create(company_id=x.id, user_id=user.id)

                        #Send Email
                    return HttpResponse("User has been connected to new Application")

            except MyUser.DoesNotExist:
                print()
            
            try:
                tempComp = Company.objects.get(order=compId)
                if (tempComp):
                    user = register.save()
                    user = MyUser.objects.get(email=register.email)
                    UserCompLink.objects.create(company_id=tempComp.id, user_id=user.id)
                return HttpResponse("New User has been connected to Pre-existing Company")
            except Company.DoesNotExist:
                print()
            

            user = register.save()
            user = MyUser.objects.get(email=register.email)
            x = Company.objects.create(order=compId, completed=0, company_name='New Application')
            UserCompLink.objects.create(company_id=x.id, user_id=user.id)
            return HttpResponse("New User has been connected to new application")

        else:
            return HttpResponse("Error - ORD Number Incorrect")
        
        return redirect("/")
           
    else:
        return render(request, "login/add-user.html", {})



INTERNAL_RESET_URL_TOKEN = 'set-password'
INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'


class PasswordContextMixin:
    extra_context = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': self.title,
            **(self.extra_context or {})
        })
        return context


class PasswordResetView(PasswordContextMixin, FormView):
    email_template_name = 'registration/password_reset_email.html'
    extra_email_context = None
    form_class = PasswordResetForm
    from_email = None
    html_email_template_name = None
    subject_template_name = 'registration/password_reset_subject.txt'
    success_url = reverse_lazy('password_reset_done')
    template_name = 'registration/password_reset_form.html'
    title = _('Password reset')
    token_generator = default_token_generator

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def form_valid(self, form):
        opts = {
            'use_https': self.request.is_secure(),
            'token_generator': self.token_generator,
            'from_email': self.from_email,
            'email_template_name': self.email_template_name,
            'subject_template_name': self.subject_template_name,
            'request': self.request,
            'html_email_template_name': self.html_email_template_name,
            'extra_email_context': self.extra_email_context,
        }
        form.save(**opts)
        return super().form_valid(form)


class PasswordResetDoneView(PasswordContextMixin, TemplateView):
    template_name = 'registration/password_reset_done.html'
    title = _('Password reset sent')


class PasswordResetConfirmView(PasswordContextMixin, FormView):
    
    form_class = SetPasswordForm
    post_reset_login = False
    post_reset_login_backend = None
    success_url = reverse_lazy('password_reset_complete')
    template_name = 'login/set-password.html'
    title = _('Enter new password')
    token_generator = default_token_generator

    @method_decorator(sensitive_post_parameters())
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        assert 'uidb64' in kwargs and 'token' in kwargs

        self.validlink = False
        self.user = self.get_user(kwargs['uidb64'])
        if self.user is not None:
            token = kwargs['token']
            if token == INTERNAL_RESET_URL_TOKEN:
                session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(self.user, session_token):
                    # If the token is valid, display the password reset form.
                    self.validlink = True
                    return super().dispatch(*args, **kwargs)
            else:
                if self.token_generator.check_token(self.user, token):
                    # Store the token in the session and redirect to the
                    # password reset form at a URL without the token. That
                    # avoids the possibility of leaking the token in the
                    # HTTP Referer header.
                    self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                    redirect_url = self.request.path.replace(token, INTERNAL_RESET_URL_TOKEN)
                    return HttpResponseRedirect(redirect_url)

        # Display the "Password reset unsuccessful" page.
        return self.render_to_response(self.get_context_data())

    def get_user(self, uidb64):
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = MyUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, MyUser.DoesNotExist, ValidationError):
            user = None
        return user

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.user
        return kwargs

    def form_valid(self, form):
        user = form.save()
        del self.request.session[INTERNAL_RESET_SESSION_TOKEN]
        if self.post_reset_login:
            auth_login(self.request, user, self.post_reset_login_backend)
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.validlink:
            context['validlink'] = True
        else:
            context.update({
                'form': None,
                'title': _('Password reset unsuccessful'),
                'validlink': False,
            })
        return context


class PasswordResetCompleteView(PasswordContextMixin, TemplateView):
    template_name = 'registration/password_reset_complete.html'
    title = _('Password reset complete')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['login_url'] = resolve_url(settings.LOGIN_URL)
        return context