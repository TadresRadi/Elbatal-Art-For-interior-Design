from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .client import Client


class BaseVersionManager(models.Manager):
    """Base manager for version models with common queries."""
    
    def get_by_client(self, client):
        """Get versions for a specific client."""
        return self.filter(client=client)
    
    def get_latest_version(self, client):
        """Get the latest version for a client."""
        return self.filter(client=client).order_by('-version_number').first()


class ExpenseVersionManager(BaseVersionManager):
    """Manager for ExpenseVersion model."""
    pass


class PaymentVersionManager(BaseVersionManager):
    """Manager for PaymentVersion model."""
    pass


class BaseVersionModel(models.Model):
    """Abstract base model for version tracking."""
    
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='%(class)s_set',
        help_text=_("Client this version belongs to")
    )
    
    version_number = models.PositiveIntegerField(
        help_text=_("Version number (starts from 1)")
    )
    
    discussion_completed_at = models.DateTimeField(
        help_text=_("When the discussion was completed")
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text=_("When this version was created")
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("When this version was last updated")
    )

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['client', 'version_number']),
            models.Index(fields=['client', 'discussion_completed_at']),
            models.Index(fields=['created_at']),
        ]
        unique_together = ['client', 'version_number']
        ordering = ['-version_number']

    def __str__(self):
        return f"{self.client.user.username} - {self._get_model_name()} Version {self.version_number}"

    def _get_model_name(self):
        """Get the model name for string representation."""
        return self.__class__.__name__.replace('Version', '')

    def clean(self):
        """Model validation."""
        super().clean()
        
        if self.version_number <= 0:
            raise ValidationError(_('Version number must be positive.'))
        
        # Validate that version numbers are sequential
        latest_version = self.__class__.objects.filter(client=self.client).order_by('-version_number').first()
        if latest_version and self.version_number != latest_version.version_number + 1:
            if self.version_number <= latest_version.version_number:
                raise ValidationError(_('Version number must be greater than existing versions.'))
            else:
                raise ValidationError(_('Version numbers must be sequential.'))

    def save(self, *args, **kwargs):
        """Override save to add custom logic."""
        self.full_clean()
        super().save(*args, **kwargs)


class ExpenseVersion(BaseVersionModel):
    """Model for tracking expense versions after discussion completion."""
    
    expenses_data = models.JSONField(
        help_text=_("Serialized expense data at the time of version creation")
    )

    objects = ExpenseVersionManager()

    class Meta(BaseVersionModel.Meta):
        db_table = 'expense_versions'
        verbose_name = _('Expense Version')
        verbose_name_plural = _('Expense Versions')

    def clean(self):
        """Validate expenses data."""
        super().clean()
        
        if not isinstance(self.expenses_data, list):
            raise ValidationError(_('Expenses data must be a list.'))
        
        if not self.expenses_data:
            raise ValidationError(_('Expenses data cannot be empty.'))
        
        # Validate each expense item
        required_fields = ['id', 'date', 'description', 'amount', 'status']
        for i, expense in enumerate(self.expenses_data):
            if not isinstance(expense, dict):
                raise ValidationError(_('Expense item at index %(index)s must be a dictionary.') % {'index': i})
            
            for field in required_fields:
                if field not in expense:
                    raise ValidationError(_('Expense item at index %(index)s missing required field: %(field)s') % {
                        'index': i, 'field': field
                    })
            
            # Validate amount
            try:
                amount = float(expense['amount'])
                if amount < 0:
                    raise ValidationError(_('Expense amount at index %(index)s cannot be negative.') % {'index': i})
            except (ValueError, TypeError):
                raise ValidationError(_('Expense amount at index %(index)s must be a valid number.') % {'index': i})

    @property
    def expenses_count(self):
        """Get the number of expenses in this version."""
        return len(self.expenses_data) if isinstance(self.expenses_data, list) else 0

    @property
    def total_amount(self):
        """Calculate total amount of expenses in this version."""
        if not isinstance(self.expenses_data, list):
            return 0
        
        total = 0
        for expense in self.expenses_data:
            try:
                total += float(expense.get('amount', 0))
            except (ValueError, TypeError):
                continue
        
        return total


class PaymentVersion(BaseVersionModel):
    """Model for tracking payment versions after discussion completion."""
    
    payments_data = models.JSONField(
        help_text=_("Serialized payment data at the time of version creation")
    )

    objects = PaymentVersionManager()

    class Meta(BaseVersionModel.Meta):
        db_table = 'payment_versions'
        verbose_name = _('Payment Version')
        verbose_name_plural = _('Payment Versions')

    def clean(self):
        """Validate payments data."""
        super().clean()
        
        if not isinstance(self.payments_data, list):
            raise ValidationError(_('Payments data must be a list.'))
        
        if not self.payments_data:
            raise ValidationError(_('Payments data cannot be empty.'))
        
        # Validate each payment item
        required_fields = ['id', 'date', 'amount']
        for i, payment in enumerate(self.payments_data):
            if not isinstance(payment, dict):
                raise ValidationError(_('Payment item at index %(index)s must be a dictionary.') % {'index': i})
            
            for field in required_fields:
                if field not in payment:
                    raise ValidationError(_('Payment item at index %(index)s missing required field: %(field)s') % {
                        'index': i, 'field': field
                    })
            
            # Validate amount
            try:
                amount = float(payment['amount'])
                if amount < 0:
                    raise ValidationError(_('Payment amount at index %(index)s cannot be negative.') % {'index': i})
            except (ValueError, TypeError):
                raise ValidationError(_('Payment amount at index %(index)s must be a valid number.') % {'index': i})

    @property
    def payments_count(self):
        """Get the number of payments in this version."""
        return len(self.payments_data) if isinstance(self.payments_data, list) else 0

    @property
    def total_amount(self):
        """Calculate total amount of payments in this version."""
        if not isinstance(self.payments_data, list):
            return 0
        
        total = 0
        for payment in self.payments_data:
            try:
                total += float(payment.get('amount', 0))
            except (ValueError, TypeError):
                continue
        
        return total
