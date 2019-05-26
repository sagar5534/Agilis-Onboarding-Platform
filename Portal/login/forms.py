from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label='Username')
    password = forms.CharField(label="Password" ,widget=forms.PasswordInput)

class SignUpForm(forms.Form):
    first_name = forms.CharField(label='First Name', max_length=100)
    last_name = forms.CharField(label='Last Name', max_length=100)
    email = forms.EmailField(label='Email')
    password = forms.CharField(label="Password" ,widget=forms.PasswordInput)
    password_2 = forms.CharField(label="Confirm Password" ,widget=forms.PasswordInput)