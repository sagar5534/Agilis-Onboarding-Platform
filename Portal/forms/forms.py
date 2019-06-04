from django import forms

class CompanyData(forms.Form):
    CompanyName = forms.CharField(label='Company Name')
    SiteAddress = forms.CharField(label="Complete Site Address")
    Bus_Res = forms.ChoiceField(label="Type of Site", 
    choices=[
        ("1", "Business"),
        ("2", "Residential"),
        ]
    , required=True)

    CurProvider = forms.CharField(label="Current Local Service Provider", required=True)
    
    def is_valid(self):
        return super().is_valid()