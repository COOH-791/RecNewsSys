# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-11-01 08:04
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0002_auto_20191101_1603'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='new',
            name='new_cate',
        ),
    ]
