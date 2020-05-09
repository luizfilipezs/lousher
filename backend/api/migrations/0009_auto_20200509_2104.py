# Generated by Django 3.0.5 on 2020-05-09 21:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20200509_2001'),
    ]

    operations = [
        migrations.AddField(
            model_name='produto',
            name='descricao',
            field=models.CharField(default='Sem descrição disponível.', max_length=220),
        ),
        migrations.AddField(
            model_name='produto',
            name='mililitros',
            field=models.PositiveIntegerField(default=750, verbose_name='Conteúdo em mililitros (ml)'),
        ),
    ]
