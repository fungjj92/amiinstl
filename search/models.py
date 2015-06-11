from django.db import models

#controller will figure out how to deal with userinputs
#view asks models for data it needs
#model will have to get stuff from DB to feed to leaflet in form

#model for getting geolocation info from address or button click

#maybe collect usage info


class Address(models.Model):
    address = models.CharField(max_length=100)


class geoLocation(models.Model):
    latitude = models.CharField(max_length=15)
    longitude = models.CharField(max_length=15)

