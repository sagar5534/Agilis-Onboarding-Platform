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

    list_display = ('order', 'company_name', 'site_address', 'completed', 'get_user')
    list_filter = ('completed',)
    fieldsets = ( ('Application' , {'fields': ('company_name', 'site_address', 'type', 'currentProvider')}) , ('411', {'fields': ('directory_listing','listing_name', 'category_listing', 'listing_phone', 'listing_address')}),)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email',)}
        ),
    )

    search_fields = ('order', 'company_name', 'listing_name',)
    ordering = ('id', 'company_name', )
    filter_horizontal = ()

    def get_user(self, obj):
        try:
            x = UserCompLink.objects.filter(company_id=obj.id)
            tempStr = ""
            for each in x:
                temp = MyUser.objects.get(id=each.user_id)
                tempStr = tempStr + temp.email + "; "
            return tempStr
        except UserCompLink.DoesNotExist:
            return obj.id

    get_user.short_description = 'Users Connected'  #Renames column head


    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'site_address' or db_field.name == 'listing_address':
            return AddressChoiceField(queryset=Address.objects.all())
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    pass

class UserCompLinkAdmin(admin.ModelAdmin):

    list_display = ('get_order', 'user', )
    search_fields = ('user', 'company__order',)
    ordering = ('company__order', )
    filter_horizontal = ()

    def get_order(self, obj):
        try:
            x = Company.objects.get(id=obj.company_id)
            return x.order
        except Company.DoesNotExist:
            return "Error"

    get_order.admin_order_field  = 'company__order'  #Allows column order sorting
    get_order.short_description = 'Order ID'  #Renames column head

class NumbersAdmin(admin.ModelAdmin):

    list_display = ('get_order', 'number', 'Address_911', 'Type')
    search_fields = ('company__order', 'number',)
    ordering = ('company__order', 'Type' )
    list_filter = ('Type',)

    filter_horizontal = ()

    def get_order(self, obj):
        try:
            x = Company.objects.get(id=obj.company_id)
            return x.order
        except Company.DoesNotExist:
            return "Error"

    get_order.admin_order_field  = 'company__order'  #Allows column order sorting
    get_order.short_description = 'Order ID'  #Renames column head


class ExtentionsAdmin(admin.ModelAdmin):

    list_display = ('get_order', 'ext', 'get_name', 'caller_id_name')
    search_fields = ('company__order', 'ext', 'name', )
    ordering = ('company__order', )
    filter_horizontal = ()

    def get_name(self, obj):
        try:
            x = Numbers.objects.get(id=obj.caller_id_number)
            return x.number
        except Numbers.DoesNotExist:
            return obj.caller_id_number

    get_name.short_description = 'Caller ID Number'  #Renames column head
        
    def get_order(self, obj):
        try:
            x = Company.objects.get(id=obj.company_id)
            return x.order
        except Company.DoesNotExist:
            return "Error"

    get_order.admin_order_field  = 'company__order'  #Allows column order sorting
    get_order.short_description = 'Order ID'  #Renames column head


class UploadAdmin(admin.ModelAdmin):

    list_display = ('get_order', 'type', 'document',)
    list_filter = ('type',)

    search_fields = ('company__order', 'type', 'document', )
    ordering = ('company__order', 'type')

    filter_horizontal = ()

    def get_order(self, obj):
        try:
            x = Company.objects.get(id=obj.company_id)
            return x.order
        except Company.DoesNotExist:
            return "Error"

    get_order.admin_order_field  = 'company__order'  #Allows column order sorting
    get_order.short_description = 'Order ID'  #Renames column head


admin.site.register(Company, CompanyAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserCompLink, UserCompLinkAdmin)
admin.site.register(Numbers, NumbersAdmin)
admin.site.register(Extention, ExtentionsAdmin)
admin.site.register(Uploads, UploadAdmin)
