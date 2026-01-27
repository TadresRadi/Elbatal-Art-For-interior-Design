from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class ClientManager(models.Manager):
    """Custom manager for Client model with common queries."""
    
    def get_active_clients(self):
        """Get only active clients."""
        return self.filter(is_active=True, is_deleted=False)
    
    def get_by_username(self, username):
        """Get client by username."""
        return self.filter(user__username=username).first()


class Client(models.Model):
    """Model representing a client with comprehensive validation."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='client_profile',
        help_text=_("User account associated with this client")
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        default='',
        help_text=_("Client phone number")
    )
    
    address = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text=_("Client address")
    )

    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text=_("Client budget amount")
    )

    is_active = models.BooleanField(
        default=True,
        help_text=_("Whether this client is active")
    )
    
    is_deleted = models.BooleanField(
        default=False,
        help_text=_("Whether this client is soft-deleted")
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', _('Active')),
            ('completed', _('Completed')),
            ('pending', _('Pending')),
            ('inactive', _('Inactive')),
        ],
        default='active',
        help_text=_("Current status of the client")
    )
    
    # Legacy discussion completion field (kept for backward compatibility)
    discussion_completed = models.BooleanField(
        default=False,
        help_text=_("Legacy field: whether general discussion is completed")
    )
    
    discussion_completed_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text=_("Legacy field: when general discussion was completed")
    )

    # Separate discussion completion fields for expenses and payments
    expenses_discussion_completed = models.BooleanField(
        default=False,
        help_text=_("Whether expenses discussion is completed")
    )
    
    expenses_discussion_completed_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text=_("When expenses discussion was completed")
    )
    
    payments_discussion_completed = models.BooleanField(
        default=False,
        help_text=_("Whether payments discussion is completed")
    )
    
    payments_discussion_completed_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text=_("When payments discussion was completed")
    )
    
    # Version tracking for expenses and payments discussions
    expenses_version_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_("Number of expense versions created")
    )
    
    payments_version_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text=_("Number of payment versions created")
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("When this client was created")
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("When this client was last updated")
    )

    objects = ClientManager()

    class Meta:
        db_table = 'clients'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['is_active', 'is_deleted']),
            models.Index(fields=['expenses_discussion_completed']),
            models.Index(fields=['payments_discussion_completed']),
        ]

    def __str__(self):
        return f"{self.user.username} ({self.get_status_display()})"

    def clean(self):
        """Model validation."""
        super().clean()
        
        # Validate phone format if provided
        if self.phone:
            # Remove common phone number formatting characters
            phone_digits = ''.join(filter(str.isdigit, self.phone))
            if len(phone_digits) < 10:
                raise ValidationError(_('Phone number must have at least 10 digits.'))
        
        # Validate budget
        if self.budget is not None and self.budget < 0:
            raise ValidationError(_('Budget cannot be negative.'))

    def save(self, *args, **kwargs):
        """Override save to add custom logic."""
        # Ensure is_deleted clients are not active
        if self.is_deleted:
            self.is_active = False
        
        # Call full_clean to run validation
        self.full_clean()
        
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        """Get client's full name from user."""
        return self.user.get_full_name() or self.user.username

    @property
    def email(self):
        """Get client's email from user."""
        return self.user.email

    def has_completed_expenses_discussion(self):
        """Check if expenses discussion is completed."""
        return self.expenses_discussion_completed

    def has_completed_payments_discussion(self):
        """Check if payments discussion is completed."""
        return self.payments_discussion_completed

    def mark_expenses_discussion_completed(self):
        """Mark expenses discussion as completed."""
        from django.utils import timezone
        self.expenses_discussion_completed = True
        self.expenses_discussion_completed_at = timezone.now()
        self.save(update_fields=['expenses_discussion_completed', 'expenses_discussion_completed_at'])

    def mark_payments_discussion_completed(self):
        """Mark payments discussion as completed."""
        from django.utils import timezone
        self.payments_discussion_completed = True
        self.payments_discussion_completed_at = timezone.now()
        self.save(update_fields=['payments_discussion_completed', 'payments_discussion_completed_at'])

    def soft_delete(self):
        """Soft delete the client."""
        self.is_deleted = True
        self.is_active = False
        self.save(update_fields=['is_deleted', 'is_active'])

    def restore(self):
        """Restore a soft-deleted client."""
        self.is_deleted = False
        self.is_active = True
        self.save(update_fields=['is_deleted', 'is_active'])