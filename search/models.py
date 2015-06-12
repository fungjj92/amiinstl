from django.db import models

#Deal with user inputs (Address, geoLocation)
#View asks models for data it needs

#Model will have to get stuff from DB to feed to leaflet in form

class Address(models.Model):
    search = models.CharField(max_length=100, default="no input")
    latitude = models.CharField(max_length=15, default="not found")
    longitude = models.CharField(max_length=15, default="not found")
    address = models.CharField(max_length=200)


class geoLocation(models.Model):
    latitude = models.CharField(max_length=15)
    longitude = models.CharField(max_length=15)

