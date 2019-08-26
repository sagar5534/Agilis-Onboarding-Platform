from django.contrib import admin
from .models import MyUser
from django import forms
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.http import HttpRequest
from django.contrib.auth.forms import PasswordResetForm
from django.urls import reverse_lazy
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.db.models.signals import post_save
from django.dispatch import receiver
from forms.models import *


admin.site.site_header = "Agilis Admin"
admin.site.site_title = "Agilis"
admin.site.index_title = "Administration"


@receiver(post_save, sender=MyUser, )
def send_email_handler(sender, **kwargs):
    instance = kwargs.get('instance')
    created = kwargs.get('created')
    if created == True:
        send_email(instance)

def send_email(user):

    form = PasswordResetForm({'email': user.email})

    if form.is_valid():
        request = HttpRequest()
        request.META['SERVER_NAME'] = 'localhost'
        request.META['SERVER_PORT'] = '8000'
        form.save(
            request= request,
            use_https=False,
            from_email="no-reply@agilismail.com", 
            email_template_name='registration/set_password.html',
            subject_template_name='registration/set_password_subject.txt',
        )

class UserCreationForm(forms.ModelForm):
    """
    A form for creating new users. Includes all the required
    fields, plus a repeated password.
    """

    class Meta:
        model = MyUser
        fields = ("email",)


    def save(self, commit=True):
        user = super().save(commit=False)
        password = MyUser.objects.make_random_password()
        user.set_password(password)
        if commit:
            user.save()
        return user
    

class UserChangeForm(forms.ModelForm):
    """
    A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = MyUser
        fields = ('email', 'password', 'first_name', 'last_name', 'is_active', 'is_superuser')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'first_name', 'last_name')
    list_filter = ('is_active' , 'is_superuser',)
    fieldsets = ( ('User' , {'fields': ('email', 'password')}) , ('Personal info', {'fields': ('first_name','last_name')}), ('Permissions', {'fields': ('is_active','is_superuser',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email',)}
        ),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(MyUser, UserAdmin)
admin.site.unregister(Group)
