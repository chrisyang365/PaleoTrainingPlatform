# Generated by Django 3.0.3 on 2020-09-01 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0009_auto_20200825_0007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='healingscore',
            name='score',
            field=models.CharField(max_length=256),
        ),
    ]
