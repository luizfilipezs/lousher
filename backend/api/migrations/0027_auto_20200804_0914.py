# Generated by Django 3.0.5 on 2020-08-04 12:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_produto_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='produto',
            old_name='image',
            new_name='imagem',
        ),
    ]