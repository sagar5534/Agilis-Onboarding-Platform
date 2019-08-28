from django.db import models
from forms.models import *
# Create your models here.

class Reports(models.Model):

    class Meta:
        verbose_name_plural = "Reports"
        verbose_name = "Report"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=False, null=False)
    document = models.FileField(upload_to='report/')
    type = models.CharField(("Type"), max_length=50, blank=False, null=True)


