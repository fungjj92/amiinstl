from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def index(request):
    return render(request, "search/index.html")

def newSearch(request):
    return None
