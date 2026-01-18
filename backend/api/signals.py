from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User

@receiver(post_delete, sender='api.Client')
def delete_user_with_client(sender, instance, **kwargs):
    """
    يمسح الـ User الخاص بالعميل لما يتم مسح الـ Client
    """
    if instance.user:
        instance.user.delete()