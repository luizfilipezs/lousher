# Generated by Django 3.0.5 on 2020-05-07 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200507_1037'),
    ]

    operations = [
        migrations.AddField(
            model_name='produto',
            name='classe',
            field=models.CharField(blank=True, choices=[('mesa', 'De mesa'), ('leve', 'Leve'), ('champagne', 'Champagne'), ('composto', 'Composto'), ('licoroso', 'Licoroso')], max_length=30),
        ),
        migrations.AddField(
            model_name='produto',
            name='cor',
            field=models.CharField(blank=True, choices=[('tinto', 'Tinto'), ('branco', 'Branco'), ('rose', 'Rosé')], max_length=10),
        ),
        migrations.AddField(
            model_name='produto',
            name='docura',
            field=models.CharField(blank=True, choices=[('seco', 'Seco'), ('meio-seco', 'Meio seco'), ('doce', 'Doce')], max_length=10),
        ),
        migrations.AddField(
            model_name='produto',
            name='pais',
            field=models.CharField(choices=[('brasil', 'Brasil')], default='brasil', max_length=20),
        ),
        migrations.AddField(
            model_name='produto',
            name='regiao',
            field=models.CharField(choices=[('oeste_gaucho', 'Oeste Gaúcho'), ('serra_gaucha', 'Serra Gaúcha')], default='oeste_gaucho', max_length=30),
        ),
        migrations.AddField(
            model_name='produto',
            name='sabor',
            field=models.CharField(blank=True, choices=[('abaunilhado', 'Abaunilhado'), ('amadeirado', 'Amadeirado'), ('amendoado', 'Amendoado'), ('amanteigado', 'Amanteigado'), ('austero', 'Austero'), ('carnoso', 'Carnoso'), ('defumado', 'Defumado')], max_length=20),
        ),
        migrations.AddField(
            model_name='produto',
            name='tipo',
            field=models.CharField(blank=True, choices=[('merlot', 'Merlot'), ('cabernet_suavignon', 'Cabernet Suavignon'), ('carmenere', 'Carménère'), ('tannat', 'Tannat'), ('pinot_noir', 'Pinot Noir'), ('chardonnay', 'Chardonnay')], max_length=30),
        ),
    ]
