# Generated by Django 2.2.1 on 2019-05-29 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserPRToken',
        ),
        migrations.AlterField(
            model_name='myuser',
            name='email',
            field=models.EmailField(help_text='Used to reach user regarding Password Changes/Resets or Form Issues', max_length=255, unique=True, verbose_name='Email Address'),
        ),
    ]
