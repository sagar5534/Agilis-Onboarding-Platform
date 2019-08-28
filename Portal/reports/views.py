from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from openpyxl import Workbook
from django.http import HttpResponse

from forms.models import *

from django.shortcuts import (
    get_object_or_404,
    render,
    redirect,
    HttpResponseRedirect,
)
import random
from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.core.files.storage import FileSystemStorage
import os
from django.views.decorators.http import require_POST
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

from openpyxl import load_workbook
import csv
from .models import * 

# Create your views here.

@login_required
def CreateExtensionsForm(request):

    if request.session.get("company"):
        company = request.session.get("company")
        print(company)
    else:
        raise Http404

    try:
        Exts = Extention.objects.filter(company_id=company)
    except Extention.DoesNotExist:
        raise Http404

    # #Create file
    # save_path = os.path.join(settings.MEDIA_ROOT, str(company), "Extensions.csv")
    # toForm = os.path.join(str(company), "Extensions.csv")
    # path = default_storage.save(save_path, "Extensions.csv")
    # # document = Uploads.objects.create(document=toForm, company=tempComp,  type='bill')
    

    save_path = os.path.join(settings.MEDIA_ROOT, "Reports", "Extensions.csv")
    toForm = os.path.join("Reports", "Extensions.csv")

    with open(save_path, 'w', newline='') as csvfile:

        fieldnames = ['Extension Number','Extension Name','CIDName','CIDNum','E911CIDNum','DirectorySearchable','DefaultNPA','Wrap Time','Record Call','FwdTime','Record Notify Email','Roaming Passcode','VM Extension Number','VM Forward Email','VM to Email Only','VM Passcode','SIP Username','SIP Password','Extension Active']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()

        for Ext in Exts:
            number = Ext.ext
            name = Ext.name
            cidName = Ext.caller_id_name

            try:
                cidNumber = Numbers.objects.get(id=Ext.caller_id_number).number
            except Numbers.DoesNotExist:
                cidNumber = Ext.caller_id_number

            E911Number = cidNumber
            directorySearch = 1
            defaultNPA = "" 
            wrapTime = 0
            recordCall = 2
            forwardTime = 25
            recordNotify = ""
            roamingPass = ""
            VMExtNumber = 0
            VMPasscode = ""
            if (Ext.voicemail == True):
                VMExtNumber = str(1) + str(number)
                VMPasscode = 12345
            VMtoEmail = 0
            VMEmail = ""
            if (Ext.voicemail_toEmail == True):
                VMEmail = Ext.voicemail_email
                VMtoEmail = 1
            ExtActive = 1

            writer.writerow({
                'Extension Number': number,
                'Extension Name': name,
                'CIDName': cidName,
                'CIDNum': cidNumber,
                'E911CIDNum': E911Number,
                'DirectorySearchable': directorySearch,
                'DefaultNPA': defaultNPA,
                'Wrap Time': wrapTime,
                'Record Call': recordCall,
                'FwdTime': forwardTime,
                'Record Notify Email': recordNotify,
                'Roaming Passcode': roamingPass,
                'VM Extension Number': VMExtNumber,
                'VM Forward Email': VMEmail,
                'VM to Email Only': VMtoEmail,
                'VM Passcode': VMPasscode,
                'SIP Username': "",
                'SIP Password': "",
                'Extension Active': ExtActive
                })

    tempComp = Company.objects.get(id=company)

    x = Reports.objects.create(company=tempComp, document=toForm, type="Extensions")
    x.save()
    return HttpResponse("Done Report" + str(company))


@login_required
def CreatePortingForm(request):

    print("Porting")



@login_required
def CreatePBXForm(request):

    print("PBX")
