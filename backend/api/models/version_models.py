from django.db import models
from .client import Client


class ExpenseVersion(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='expense_versions'
    )
    version_number = models.IntegerField()
    discussion_completed_at = models.DateTimeField()
    expenses_data = models.JSONField()  # Store the expenses data as JSON
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['client', 'version_number']
        ordering = ['version_number']

    def __str__(self):
        return f"{self.client.user.username} - Expenses Version {self.version_number}"


class PaymentVersion(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='payment_versions'
    )
    version_number = models.IntegerField()
    discussion_completed_at = models.DateTimeField()
    payments_data = models.JSONField()  # Store the payments data as JSON
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['client', 'version_number']
        ordering = ['version_number']

    def __str__(self):
        return f"{self.client.user.username} - Payments Version {self.version_number}"
