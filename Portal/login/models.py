from django.db import models
from django.core.mail import send_mail
from django.utils import timezone
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, AbstractUser
)

class MyUserManager(BaseUserManager):

    def create_user(self, orderId, email, password):
        """
        Create and save a user with the given orderID, email, and password.
        """
        if not orderId:
            raise ValueError('Please enter an Order ID')
        email = self.normalize_email(email)
        orderId = self.model.normalize_username(orderId)
        user = self.model(orderId=orderId, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, orderId , email, password):
        """
        Creates and saves a superuser with the given Ord, date of
        birth and password.
        """
        user = self.create_user(
            orderId,
            password=password,
            email=email,
        )
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
        

class MyUser(AbstractBaseUser):

    class Meta:
         verbose_name = "User"

    orderId = models.CharField(
        verbose_name='Order ID',
        max_length=40, 
        unique=True, 
        blank=False,
        help_text=(
            'Please use correct Order Number'
        )
    )

    first_name = models.CharField(('First Name'), max_length=30, blank=True)
    last_name = models.CharField(('Last Name'), max_length=150, blank=True)

    email = models.EmailField(
        verbose_name='Email Address',
        max_length=255,
        unique=False,
        blank=False,
        help_text=(
            'Used to reach user regarding Password Changes/Resets or Form Issues'
        )
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'orderId'
    REQUIRED_FIELDS = ['email']

    #Required
    is_active = models.BooleanField(
        ('Active'),
        default=True,
        help_text=(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    #For Admin - Controls is_staff
    #Superuser is also staff
    is_superuser = models.BooleanField(
        ('Superuser'),
        default=False,
        help_text=(
            'Makes the user an Admin - can access Admin Page and make changes'
        ),
    )

    #For abstractbaseuser
    @property
    def is_staff(self):
        #All superusers are staff
        return self.is_superuser

    #To print user 
    def __str__(self):
        return "User: " + self.orderId

    #Overide
    def clean(self):
        super().clean()
        self.email = __class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    #For Admin
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    #For Admin
    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True
    