# Generated by Django 2.2.1 on 2019-06-03 18:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0002_auto_20190603_1329'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='numbers',
            name='Address_911',
        ),
        migrations.AddField(
            model_name='numbers',
            name='Address_911',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='forms.Address'),
        ),
    ]
