# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_alter_message_options_alter_message_content'),
    ]

    operations = [
        # Rename title to description
        migrations.RenameField(
            model_name='expense',
            old_name='title',
            new_name='description',
        ),
        # Remove project field
        migrations.RemoveField(
            model_name='expense',
            name='project',
        ),
        # Add client field (nullable for existing records)
        migrations.AddField(
            model_name='expense',
            name='client',
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='expenses',
                to='api.client'
            ),
        ),
        # Add date field with default
        migrations.AddField(
            model_name='expense',
            name='date',
            field=models.DateField(default='2024-01-01'),
            preserve_default=False,
        ),
        # Add status field
        migrations.AddField(
            model_name='expense',
            name='status',
            field=models.CharField(
                choices=[
                    ('paid', 'Paid'),
                    ('pending', 'Pending'),
                    ('upcoming', 'Upcoming')
                ],
                default='pending',
                max_length=10
            ),
        ),
        # Add updated_at field
        migrations.AddField(
            model_name='expense',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
