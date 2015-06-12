from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def index(request):
    return render(request, "search/index.html")

@csrf_exempt
def newSearch(request):
    #handle address from user input
    if request.method == 'POST':
        search = request.POST.get('address')
        lat = request.POST.get('latitude')
        lon = request.POST.get('longitude')
        address = request.POST.get('fullname')
        createAddress = Address.objects.create(search=search, latitude=lat, longitude=lon, address=address)
    return JsonResponse({'id': createAddress.id, 'search': createAddress.search, 'latitude': createAddress.latitude, 'longitude': createAddress.longitude, 'address': createAddress.address})


@csrf_exempt
def geoLocate(request):
    if request.method == 'POST':
        lat = request.POST.get('latitude')
        lon = request.POST.get('longitude')
        createPoint = geoLocation.objects.create(latitude=lat, longitude=lon)
    return JsonResponse({'id': createPoint.id, 'latitude': createPoint.latitude, 'longitude': createPoint.longitude})