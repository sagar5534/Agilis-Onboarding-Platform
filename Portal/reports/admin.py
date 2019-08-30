from django.contrib import admin
from .models import * 
# Register your models here.
class ReportsAdmin(admin.ModelAdmin):

    list_display = ('get_order', 'type', 'document')
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

admin.site.register(Reports, ReportsAdmin)
