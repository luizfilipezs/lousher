# Generated by Django 3.0.5 on 2020-05-16 06:26

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20200516_0115'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='oferta',
            name='descricao',
        ),
        migrations.RemoveField(
            model_name='oferta',
            name='preco_oferta',
        ),
        migrations.AddField(
            model_name='oferta',
            name='porcentagem',
            field=models.PositiveIntegerField(default=10, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
        ),
    ]