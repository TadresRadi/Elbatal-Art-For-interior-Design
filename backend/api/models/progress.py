from django.db import models
from .project import Project

class Progress(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='progress')
    percentage = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=100, default='Not Started')  # e.g., In Progress, Completed
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project.title} - {self.percentage}%"