# Generated by Django 3.0.5 on 2020-05-09 14:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_itempedido_pedido'),
    ]

    operations = [
        migrations.CreateModel(
            name='Oferta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(max_length=70)),
                ('preco_oferta', models.PositiveIntegerField()),
                ('vencimento', models.DateField()),
            ],
        ),
        migrations.AddField(
            model_name='produto',
            name='oferta',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Oferta'),
        ),
    ]
