# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-11-01 08:03
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='new',
            name='new_cate',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='类别', to='index.Cate'),
        ),
    ]