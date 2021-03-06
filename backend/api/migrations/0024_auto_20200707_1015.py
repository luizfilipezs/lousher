# Generated by Django 3.0.5 on 2020-07-07 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_mensagemcontato_lido'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContaEmail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('servico', models.CharField(choices=[('gmail', 'Gmail'), ('hotmail', 'Hotmail'), ('outlook', 'Outlook')], default='outlook', max_length=25)),
                ('email', models.CharField(blank=True, max_length=60, null=True)),
                ('password', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='grupo',
            name='docura',
            field=models.CharField(blank=True, choices=[('seco', 'Seco'), ('suave', 'Suave')], max_length=10),
        ),
        migrations.AlterField(
            model_name='grupo',
            name='regiao',
            field=models.CharField(choices=[('norte_gaucho', 'Norte Gaúcho'), ('serra_gaucha', 'Serra Gaúcha')], default='norte_gaucho', max_length=30),
        ),
        migrations.AlterField(
            model_name='grupo',
            name='tipo',
            field=models.CharField(blank=True, choices=[('merlot', 'Merlot'), ('bordo', 'Bordô'), ('cabernet_suavignon', 'Cabernet Suavignon'), ('carmenere', 'Carménère'), ('tannat', 'Tannat'), ('pinot_noir', 'Pinot Noir'), ('chardonnay', 'Chardonnay')], max_length=30),
        ),
        migrations.AlterField(
            model_name='pedido',
            name='observacoes',
            field=models.CharField(default='Sem comentários adicionais do cliente.', max_length=300),
        ),
        migrations.AlterField(
            model_name='pedido',
            name='status',
            field=models.CharField(choices=[('analise', 'em análise'), ('preparando', 'preparando envio'), ('despachado', 'despachado'), ('entregue', 'entregue'), ('suspenso', 'suspenso'), ('cancelado', 'cancelado')], default='analise', max_length=20),
        ),
    ]
