from django.db import models
from .client import Client


class CashReceipt(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='cash_receipts',
        null=True,
        default=None
    )
    
    date = models.DateField()
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cash Receipt - {self.amount} for {self.client}"
