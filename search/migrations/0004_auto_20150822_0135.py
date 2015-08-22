# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0003_auto_20150612_1524'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='latitude',
            field=models.CharField(default=b'not found', max_length=25),
        ),
        migrations.AlterField(
            model_name='address',
            name='longitude',
            field=models.CharField(default=b'not found', max_length=25),
        ),
        migrations.AlterField(
            model_name='geolocation',
            name='latitude',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='geolocation',
            name='longitude',
            field=models.CharField(max_length=25),
        ),
    ]
