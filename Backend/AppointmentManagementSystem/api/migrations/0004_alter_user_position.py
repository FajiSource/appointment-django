# Generated by Django 5.1.7 on 2025-06-07 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_usertype_user_position'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='position',
            field=models.CharField(choices=[('HeadOfOffice', 'HeadOfOffice'), ('DeputyRegistrar', 'DeputyRegistrar'), ('Examiner', 'Examiner'), ('AdministrativeOfficer', 'AdministrativeOfficer'), ('Client', 'Client')], max_length=50),
        ),
    ]
