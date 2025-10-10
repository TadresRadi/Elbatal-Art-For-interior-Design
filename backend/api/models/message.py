from django.db import models
from .client import Client

class Message(models.Model):
    sender = models.CharField(max_length=100)  # "admin" or "client"
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.client.name}"
