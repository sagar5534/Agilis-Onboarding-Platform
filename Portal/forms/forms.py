from django import forms
import re
from django.core import validators

def postalValidateCA(S):
    S = S.upper().replace(" ", "")
    if len(S) == 6:
        for i in range(len(S)):
            if i % 2 == 0:
                #Even index (0, 2, 4, 6...) , has to be 'letter'
                if not(S[i].isalpha()):
                    return False 
            else:
                #Odd index (1, 3, 5, 7...), must be 'number'
                if not(S[i].isdigit()):
                    return False

    else:
        #You can save some cpu ticks here... at this point, the string has to be of length 6 or you know it's not a zip
        return False
    return True

def postalValidateUS(S):
    regex = re.compile(r"(\b\d{5}-\d{4}\b|\b\d{5}\b\s)")
    matches = re.findall(regex, S)

    if matches:
        return True;
    return False;

class CompanyData(forms.Form):
    companyName = forms.CharField(label='Company Name')
    type = forms.CharField(label="Bus", max_length=100, required=False)
    CurProvider = forms.CharField(label="Current Local Service Provider", max_length=100, required=True)
    Suite = forms.CharField(label="Suite", max_length=100, required=False)
    Postal = forms.CharField(label="Postal", max_length=200, required=False)
    StreetAddress = forms.CharField(label="StreetAddress", max_length=200, required=False)

    def is_valid(self):
        return super().is_valid()
    
    def checkPostal(self):
        if postalValidateCA(self.cleaned_data['Postal']) or postalValidateUS(self.cleaned_data['Postal']):
            return True

class Data411(forms.Form):
    CompanyName411 = forms.CharField(label='Company Name 411', required=True)
    Category = forms.CharField(label="Category", required=True)
    Phone411 = forms.CharField(label="Phone411", required=True)
    Suite = forms.CharField(label="Suite", max_length=100, required=False)
    StreetNum = forms.IntegerField(label="StreetNum", required=False)
    Street = forms.CharField(label="Street", max_length=350, required=False)
    City = forms.CharField(label="City", max_length=200, required=False)
    Prov = forms.CharField(label="Prov", max_length=200, required=False)
    Postal = forms.CharField(label="Postal", max_length=200, required=False)
    Country = forms.CharField(label="Country", max_length=200, required=False)
    address = forms.IntegerField()


class SetAddress(forms.Form):
    Suite = forms.CharField(label="Suite", max_length=100, required=False)
    StreetAddress = forms.CharField(label="StreetAddress", max_length=350, required=False)
    Postal = forms.CharField(label="Postal", max_length=200, required=False)
    Country = forms.CharField(label="Country", max_length=200, required=False)

    def is_valid(self):
        return super().is_valid()
    
    def checkPostal(self):
        if (self.cleaned_data['Country'] == 'Canada'):
            return postalValidateCA(self.cleaned_data['Postal'])
        if (self.cleaned_data['Country'] == 'United States'):
            return postalValidateUS(self.cleaned_data['Postal'])