from django.db import models
from login.models import MyUser
from phonenumber_field.modelfields import PhoneNumberField


class Address(models.Model):
    id = models.AutoField(primary_key=True)
    Suite = models.CharField("", max_length=50, null=True, blank=True)
    StreetNum = models.IntegerField((""), default=0, blank=False, null=False)
    Street = models.CharField(("Street"), default="", max_length=50, blank=False, null=False)
    City = models.CharField(("City"), default="", max_length=50, blank=False, null=False)
    Prov = models.CharField((""), default="", max_length=50, blank=False, null=False)
    Postal = models.CharField(("Postal Code"), max_length=7, blank=False, null=False)
    Country = models.CharField((""),default="", max_length=50, blank=False, null=False)

    '''
    provTypes = [
        ('Ontario', 'ON'),
        ('Quebec', 'QC'),
        ('British Columbia', 'BC'),
        ('Alberta', 'AB'),
        ('Manitoba', 'MB'),
        ('Saskatchewan', 'SK'),
        ('Nova Scotia', 'NS'),
        ('New Brunswick', 'NB'),
        ('Newfoundland and Labrador', 'NL'),
        ('Prince Edward Island', 'PE'),
        ('Northwest Territories', 'NT'),
        ('Yukon', 'YT'),
        ('Nunavut', 'NU'),
    ]
    Province = models.CharField(
        max_length=2,
        choices=provTypes,
        default='Ontario',
    )
    '''

class Company(models.Model):
    id = models.AutoField(primary_key=True)
    completed = models.BooleanField((""), default=False, null=True)
    company_name = models.CharField(("Company Name"), max_length=50, blank=False, null=True)
    site_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, related_name='site_address', null=True)
    main_phone = models.CharField(("Main Phone"), max_length=50, blank=True, null=True)
    main_fax = models.CharField(("Main Fax"), max_length=50, blank=True, null=True)
    type = models.CharField((""), max_length=50, null=True)
    currentProvider = models.CharField((""), max_length=50, null=True)
    #411
    directory_listing = models.CharField(("Directory Listing"), max_length=50, blank=False, null=True)
    listing_name = models.CharField(("Listing Name"), max_length=50, blank=False, null=True)
    category_listing = models.CharField(("Category Listing"), max_length=50, blank=False, null=True)
    listing_phone = PhoneNumberField(("Listing Phone Number"), blank=False, null=True)
    listing_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, related_name='listing_address', null=True)

    #Inserting null into blanks for phones
    #def ...

class UserCompLink(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=False, null=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class Numbers(models.Model):
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    number = PhoneNumberField((""), blank=False, null=False)
    Address_911 = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=True)

class Extention(models.Model):
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    ext = models.IntegerField((""), blank=False, null=False)
    name = models.CharField((""), max_length=50, blank=False, null=False)
    caller_id_name = models.CharField((""), max_length=50, blank=False, null=False)
    called_id_number = PhoneNumberField((""), blank=False, null=False)
    voicemail = models.BooleanField((""), blank=False)
    voicemail_toEmail = models.BooleanField((""), blank=False, null=True)
    voicemail_email = models.EmailField((""), max_length=254, blank=False, null=True)
