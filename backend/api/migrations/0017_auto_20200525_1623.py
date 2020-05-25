# Generated by Django 3.0.5 on 2020-05-25 16:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20200518_1114'),
    ]

    operations = [
        migrations.CreateModel(
            name='Grupo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(default='Sem descrição disponível.', max_length=220)),
                ('pais', models.CharField(choices=[('brasil', 'Brasil')], default='brasil', max_length=20)),
                ('regiao', models.CharField(choices=[('oeste_gaucho', 'Oeste Gaúcho'), ('serra_gaucha', 'Serra Gaúcha')], default='oeste_gaucho', max_length=30)),
                ('mililitros', models.PositiveIntegerField(default=750, verbose_name='Conteúdo em mililitros (ml)')),
                ('tipo', models.CharField(blank=True, choices=[('merlot', 'Merlot'), ('cabernet_suavignon', 'Cabernet Suavignon'), ('carmenere', 'Carménère'), ('tannat', 'Tannat'), ('pinot_noir', 'Pinot Noir'), ('chardonnay', 'Chardonnay')], max_length=30)),
                ('cor', models.CharField(blank=True, choices=[('tinto', 'Tinto'), ('branco', 'Branco'), ('rose', 'Rosé')], max_length=10)),
                ('docura', models.CharField(blank=True, choices=[('seco', 'Seco'), ('meio-seco', 'Meio seco'), ('doce', 'Doce')], max_length=10)),
                ('classe', models.CharField(blank=True, choices=[('mesa', 'De mesa'), ('leve', 'Leve'), ('champagne', 'Champagne'), ('composto', 'Composto'), ('licoroso', 'Licoroso')], max_length=30)),
                ('sabor', models.CharField(blank=True, choices=[('abaunilhado', 'Abaunilhado'), ('amadeirado', 'Amadeirado'), ('amendoado', 'Amendoado'), ('amanteigado', 'Amanteigado'), ('austero', 'Austero'), ('carnoso', 'Carnoso'), ('defumado', 'Defumado')], max_length=20)),
            ],
        ),
        migrations.RemoveField(
            model_name='produto',
            name='classe',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='cor',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='descricao',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='docura',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='mililitros',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='pais',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='regiao',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='sabor',
        ),
        migrations.RemoveField(
            model_name='produto',
            name='tipo',
        ),
        migrations.AddField(
            model_name='produto',
            name='grupo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.Grupo'),
        ),
    ]