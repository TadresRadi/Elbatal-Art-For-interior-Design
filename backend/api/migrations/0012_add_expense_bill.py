# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_update_expense_model'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='bill',
            field=models.FileField(blank=True, null=True, upload_to='expenses/'),
        ),
    ]
