# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-11-04 09:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0006_auto_20191104_1544'),
    ]

    operations = [
        migrations.AlterField(
            model_name='new',
            name='new_time',
            field=models.CharField(max_length=100, verbose_name='发布时间'),
        ),
    ]