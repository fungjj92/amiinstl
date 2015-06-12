# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_geolocation'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='latitude',
            field=models.CharField(max_length=15, default='not found'),
        ),
        migrations.AddField(
            model_name='address',
            name='longitude',
            field=models.CharField(max_length=15, default='not found'),
        ),
        migrations.AddField(
            model_name='address',
            name='search',
            field=models.CharField(max_length=100, default='no input'),
        ),
        migrations.AlterField(
            model_name='address',
            name='address',
            field=models.CharField(max_length=200),
        ),
    ]
