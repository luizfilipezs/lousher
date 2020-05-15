# Generated by Django 3.0.5 on 2020-05-13 18:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20200509_2104'),
    ]

    operations = [
        migrations.AddField(
            model_name='pedido',
            name='data_pedido',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='produto',
            name='qntd_disponivel',
            field=models.PositiveIntegerField(default=0),
        ),
    ]