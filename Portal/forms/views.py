from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.http import Http404
from django.contrib.auth.decorators import login_required

#""
@login_required
def index(request):
    return HttpResponse("Index")

