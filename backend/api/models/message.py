from django.db import models
from .client import Client

class Message(models.Model):
    SENDER_CHOICES = (
        ('admin', 'Admin'),
        ('client', 'Client')
    )

    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(blank=True, null=True)  # اختياري إذا كان فيه ملف
    timestamp = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='messages/', null=True, blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message from {self.sender} to {self.client.user.username} at {self.timestamp}"