from django.contrib import admin
from .models import *
from django import forms
# Register your models here.

class AddressAdmin(admin.ModelAdmin):

    list_display = (Address.__str__, 'Postal')
    
    search_fields = ('StreetAddress', "Postal", )
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

    search_fields = ('company_name', 'listing_name', 'company__id', )
    ordering = ('id', 'company_name', )
    filter_horizontal = ()


    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'site_address' or db_field.name == 'listing_address':
            return AddressChoiceField(queryset=Address.objects.all())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    pass

class UserCompLinkAdmin(admin.ModelAdmin):

    list_display = ('user', 'company')
    search_fields = ('user', 'company__id',)
    ordering = ('user', )
    filter_horizontal = ()

class NumbersAdmin(admin.ModelAdmin):

    list_display = ('company', 'number', 'Address_911', 'Type')
    search_fields = ('company__id', 'number',)
    ordering = ('company', 'Type' )
    list_filter = ('Type',)

    filter_horizontal = ()


class ExtentionsAdmin(admin.ModelAdmin):

    list_display = ('company', 'ext', 'get_name', 'caller_id_name')
    search_fields = ('company__id', 'ext', 'name', )
    ordering = ('company', )
    filter_horizontal = ()

    def get_name(self, obj):
        try:
            x = Numbers.objects.get(id=obj.caller_id_number)
            return x.number
        except Numbers.DoesNotExist:
            return obj.caller_id_number

    get_name.admin_order_field  = 'author'  #Allows column order sorting
    get_name.short_description = 'Caller ID Number'  #Renames column head
        


class UploadAdmin(admin.ModelAdmin):

    list_display = ('company', 'document', 'type')
    list_filter = ('type',)

    search_fields = ('company__id', 'type', 'document', )
    ordering = ('company', 'type')

    filter_horizontal = ()


admin.site.register(Company, CompanyAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserCompLink, UserCompLinkAdmin)
admin.site.register(Numbers, NumbersAdmin)
admin.site.register(Extention, ExtentionsAdmin)
admin.site.register(Uploads, UploadAdmin)
