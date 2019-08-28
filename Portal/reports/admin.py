from django.contrib import admin
from .models import * 
# Register your models here.
class ReportsAdmin(admin.ModelAdmin):

    list_display = ('company', 'document', 'type')
    list_filter = ('type',)

    search_fields = ('company__id', 'type', 'document', )
    ordering = ('company', 'type')

    filter_horizontal = ()

admin.site.register(Reports, ReportsAdmin)
