from django.contrib import admin
from .models import *
from django import forms
# Register your models here.

class AddressAdmin(admin.ModelAdmin):

    list_display = ('id', Address.__str__)
    
    search_fields = ('Street', 'City', 'Country')
    ordering = ('id',)
    filter_horizontal = ()

    pass

class AddressChoiceField(forms.ModelChoiceField):
        def label_from_instance(self, obj):
            return "Address {}".format( str(obj.id) + ": " + obj.StreetAddress)

class CompanyAdmin(admin.ModelAdmin):

    list_display = ('id', 'company_name', 'site_address', 'completed')
    list_filter = ('completed',)
    fieldsets = ( ('Company' , {'fields': ('company_name', 'site_address', 'type', 'currentProvider')}) , ('411', {'fields': ('directory_listing','listing_name', 'category_listing', 'listing_phone', 'listing_address')}),)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email',)}
        ),
    )

    search_fields = ('company_name', 'listing_name', '')
    ordering = ('id', 'company_name', )
    filter_horizontal = ()


    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        
        if db_field.name == 'site_address' or db_field.name == 'listing_address' :
            return AddressChoiceField(queryset=Address.objects.all())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    pass

class UserCompLinkAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', 'company')
    search_fields = ('user', 'company',)
    ordering = ('id', 'user', )
    filter_horizontal = ()

class NumbersAdmin(admin.ModelAdmin):

    list_display = ('id', 'company', 'number', 'Address_911')
    search_fields = ('company', 'number',)
    ordering = ('company', )
    filter_horizontal = ()


class ExtentionsAdmin(admin.ModelAdmin):

    list_display = ('id', 'company', 'ext')
    search_fields = ('company', 'ext', 'name', )
    ordering = ('company', )
    filter_horizontal = ()


class UploadAdmin(admin.ModelAdmin):

    list_display = ('company', 'document')
    search_fields = ('document', )
    ordering = ('company', )
    filter_horizontal = ()


admin.site.register(Company, CompanyAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserCompLink, UserCompLinkAdmin)
admin.site.register(Numbers, NumbersAdmin)
admin.site.register(Extention, ExtentionsAdmin)
admin.site.register(Uploads, UploadAdmin)
