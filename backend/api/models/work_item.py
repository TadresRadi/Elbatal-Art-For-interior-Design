from django.db import models


class WorkItem(models.Model):
    CATEGORY_CHOICES = [
        ('villa', 'Villa'),
        ('apartment', 'Apartment'),
        ('office', 'Office'),
    ]

    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='work_items/', null=True, blank=True)
    before_image = models.ImageField(upload_to='work_items/before/', null=True, blank=True)
    after_image = models.ImageField(upload_to='work_items/after/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title_en} ({self.category})"
