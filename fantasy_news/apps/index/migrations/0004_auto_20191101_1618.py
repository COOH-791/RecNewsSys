# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-11-01 08:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0003_remove_new_new_cate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='new',
            name='index_image_url',
            field=models.CharField(default='SOME STRING', max_length=100, verbose_name='新闻列表图片路径'),
        ),
    ]
