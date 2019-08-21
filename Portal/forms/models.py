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
    StreetAddress = models.CharField(("Street Address"), max_length=250, blank=True, null=False)
    Postal = models.CharField(("Postal Code"), max_length=7, blank=False, null=False)


class Company(models.Model):

    class Meta:
        verbose_name_plural = "Companies"
        verbose_name = "Company"

    def __str__(self):
        return self.company_name

    id = models.AutoField(("ID"), primary_key=True)
    completed = models.BooleanField(("Completed"), default=False, null=False)
    company_name = models.CharField(("Company Name"), max_length=50, blank=False, null=True)
    site_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, related_name='site_address', null=True)
    type = models.CharField(("Type"), max_length=50, null=True)
    currentProvider = models.CharField(("Current Provider"), max_length=50, null=True)
    #411
    directory_listing = models.CharField(("Directory Listing"), max_length=50, blank=False, null=True)
    listing_name = models.CharField(("Listing Name"), max_length=50, blank=False, null=True)
    category_listing = models.CharField(("Category Listing"), max_length=50, blank=False, null=True)
    listing_phone = models.CharField(("Listing Phone Number"), max_length=16, blank=False, null=True)
    listing_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, related_name='listing_address', null=True)

    #Inserting null into blanks for phones
    #def ...

class CompanyAddressLink(models.Model):
    id = models.AutoField(primary_key=True)
    Address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=False)
    Company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class UserCompLink(models.Model):

    class Meta:
        verbose_name_plural = "User & Company Relations"
        verbose_name = "User & Company Relation"

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, blank=False, null=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE,  blank=False, null=False)

class Numbers(models.Model):

    class Meta:
        verbose_name_plural = "Numbers"
        verbose_name = "Number"
    
    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    number = models.CharField((""), max_length=16, blank=False, null=False)
    Address_911 = models.ForeignKey(Address, on_delete=models.CASCADE, blank=False, null=True)
    Type = models.BooleanField((""), blank=False, null=True)

class Extention(models.Model):

    class Meta:
        verbose_name_plural = "Extentions"
        verbose_name = "Extention"

    id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    ext = models.IntegerField((""), blank=False, null=False)
    name = models.CharField((""), max_length=50, blank=False, null=False)
    caller_id_name = models.CharField((""), max_length=50, blank=False, null=True)
    caller_id_number = models.CharField((""), max_length=16, blank=False, null=True)
    voicemail = models.BooleanField((""), blank=False, null=True)
    voicemail_toEmail = models.BooleanField((""), blank=False, null=True)
    voicemail_email = models.EmailField((""), max_length=254, blank=False, null=True)



class Uploads(models.Model):

    class Meta:
        verbose_name_plural = "User Uploads"
        verbose_name = "Upload"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    document = models.FileField(upload_to='media/')
    type = models.CharField((""), max_length=50, blank=False, null=True)


