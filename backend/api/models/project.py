from django.db import models
from django.db.models import Sum
from .client import Client


class Project(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
    )

    client = models.OneToOneField(
        Client,
        on_delete=models.CASCADE,
        related_name='project'
    )

    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )

    start_date = models.DateField(null=True, blank=True)
    expected_end_date = models.DateField(null=True, blank=True)

    total_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"

    # ⬇️⬇️⬇️ مهم جدًا: methods جوه الكلاس ⬇️⬇️⬇️
    @property
    def total_spent(self):
        result = self.expenses.aggregate(total=Sum('amount'))['total']
        return result or 0

    @property
    def remaining_budget(self):
        return self.total_budget - self.total_spent