# Generated by Django 3.0.5 on 2020-05-16 01:15

from django.db import migrations
from django.contrib.postgres.operations import UnaccentExtension, TrigramExtension


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20200516_0106'),
    ]

    operations = [
        UnaccentExtension(),
        TrigramExtension()
    ]