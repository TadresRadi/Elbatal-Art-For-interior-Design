from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    user = models.OneToOneField(
    User,
    on_delete=models.CASCADE,
)

    phone = models.CharField(
    max_length=20,
    blank=True,
    default=''
)
    address = models.CharField(
    max_length=255,
    blank=True,
    default=''
)

    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username