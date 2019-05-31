from django.db import models
from ..login.models import *

class UserCompLink(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=False, null=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class Address(models.Model):
    id = models.AutoField(primary_key=True)
    Street = models.CharField(("Street"), max_length=50, blank=False, null=False)
    City = models.CharField(("City"), max_length=50, blank=False, null=False)

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
        max_lenght=2,
        choices=provTypes,
        default='Ontario',
    )

    PostalCode = models.CharField(("Postal Code - A#A#A#"), max_length=7, blank=False, null=False)

class Company(models.Model):
    id = models.AutoField(primary_key=True)
    company_name = models.CharField(("Company Name"), max_length=50, blank=False, null=False)
    site_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=False)
    main_phone = models.CharField(("Main Phone"), max_length=50, blank=True, null=True)
    main_fax = models.CharField(("Main Fax"), max_length=50, blank=True, null=True)

    #411
    directory_listing = models.CharField(("Directory Listing"), max_length=50, blank=False, null=True)
    listing_name = models.CharField(("Listing Name"), max_length=50, blank=False, null=True)
    category_listing = models.CharField(("Category Listing"), max_length=50, blank=False, null=True)
    listing_phone = models.PhoneNumberField(("Listing Phone Number"), blank=False, null=True)
    listing_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=True)

    #Inserting null into blanks for phones
    #def ...


class Numbers(models.Model):
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    number = models.PhoneNumberField((""), blank=False, null=False)
    Address_911 = models.ManyToManyField(Address, blank=False, null=False)

class Extention(models.Model):
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    ext = models.IntegerField((""), blank=False, null=False)
    name = models.CharField((""), max_length=50, blank=False, null=False)
    caller_id_name = models.CharField((""), max_length=50, blank=False, null=False)
    called_id_number = models.PhoneNumberField((""), blank=False, null=False)
    voicemail = models.BooleanField((""), blank=False, null=True)
    voicemail_toEmail = models.BooleanField((""), blank=False, null=True)
    voicemail_email = models.EmailField((""), max_length=254, blank=False, null=True)
