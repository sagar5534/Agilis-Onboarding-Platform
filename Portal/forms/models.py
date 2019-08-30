from django.db import models
from login.models import MyUser
from django.forms import ModelForm
from django import forms


class Address(models.Model):

    class Meta:
        verbose_name_plural = "addresses"
        verbose_name = "Address"
        ordering = ('id',)
        
    def __str__(self):
        return str(self.StreetAddress)

    id = models.AutoField(("ID:"), primary_key=True)
    Suite = models.CharField(("Suite"), max_length=50, null=True, blank=True)
    StreetAddress = models.CharField(("Street Address"), max_length=250, blank=True, null=True)
    Postal = models.CharField(("Postal Code"), max_length=7, blank=True, null=True)


class Company(models.Model):

    class Meta:
        verbose_name_plural = "Applications"
        verbose_name = "Application"

    def __str__(self):
        return str(self.id)

    id = models.AutoField(("ID"), primary_key=True)

    order = models.CharField(("Order"), max_length=50, blank=False, null=True)
    completed = models.BooleanField(("Completed"), default=False, null=False)
    company_name = models.CharField(("Company Name"), max_length=50, blank=False, null=True)
    site_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, related_name='site_address', null=True)
    type = models.CharField(("Type"), max_length=50, null=True)
    currentProvider = models.CharField(("Current Provider"), max_length=50, null=True)
    #411
    directory_listing = models.BooleanField(("Directory Listing"), blank=False, null=True)
    #directory_listing = models.CharField(("Directory Listing"), max_length=50, blank=True, null=True)
    listing_name = models.CharField(("Listing Name"), max_length=50, blank=True, null=True)
    category_listing = models.CharField(("Category Listing"), max_length=50, blank=True, null=True)
    listing_phone = models.CharField(("Listing Phone Number"), max_length=16, blank=True, null=True)
    listing_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True, related_name='listing_address')

    #Inserting null into blanks for phones
    #def ...

class CompanyAddressLink(models.Model):
    id = models.AutoField(primary_key=True)
    Address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=False)
    Company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class UserCompLink(models.Model):

    class Meta:
        verbose_name_plural = "User & Application Connections"
        verbose_name = "User & Application Connections"

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=False, null=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class Numbers(models.Model):

    class Meta:
        verbose_name_plural = "Phone Numbers"
        verbose_name = "Phone Number"
    
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    number = models.CharField(("Number"), max_length=16, blank=False, null=False)
    Address_911 = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=True)
    Type = models.BooleanField(("To Be Ported"), blank=False, null=True)

class Extention(models.Model):

    class Meta:
        verbose_name_plural = "Extentions"
        verbose_name = "Extention"

    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    ext = models.IntegerField(("Extension"), blank=False, null=False)
    name = models.CharField(("User Name"), max_length=50, blank=False, null=False)
    caller_id_name = models.CharField(("Caller ID"), max_length=50, blank=False, null=True)
    caller_id_number = models.CharField(("Caller ID Number"), max_length=16, blank=False, null=True)
    voicemail = models.BooleanField(("Voicemail"), blank=False, null=True)
    voicemail_toEmail = models.BooleanField(("Voicemail To Email"), blank=False, null=True)
    voicemail_email = models.EmailField(("Email Address"), max_length=254, blank=True, null=True)



class Uploads(models.Model):

    class Meta:
        verbose_name_plural = "User Uploads"
        verbose_name = "Upload"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    document = models.FileField(upload_to='media/')
    type = models.CharField(("Type"), max_length=50, blank=False, null=True)


