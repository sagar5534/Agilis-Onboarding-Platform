# Generated by Django 2.2.1 on 2019-06-06 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0007_auto_20190606_1021'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='type',
            field=models.CharField(max_length=50, null=True, verbose_name=''),
        ),
        migrations.AlterField(
            model_name='address',
            name='Postal',
            field=models.CharField(max_length=7, verbose_name='Postal Code'),
        ),
    ]
