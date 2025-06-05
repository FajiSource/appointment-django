from django.db import models
from datetime import date
from auditlog.registry import auditlog
from auditlog.models import AuditlogHistoryField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin,Group,Permission

# Create your models here.
# Custom user manager to handle user creation and superuser creation
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field is required')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('usertype', 'HeadOfOffice')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)




class User(AbstractBaseUser, PermissionsMixin):
    # User type choices
    HEAD_OFFICE = 'HeadOfOffice'
    DEPUTY_REGISTRAR = 'DeputyRegistrar'
    EXAMINER = 'Examiner'
    ADMIN_OFFICER = 'AdministrativeOfficer'


    POSITION_CHOICES = [
        (HEAD_OFFICE, 'HeadOfOffice'),
        (DEPUTY_REGISTRAR, 'DeputyRegistrar'),
        (EXAMINER, 'Examiner'),
        (ADMIN_OFFICER, 'AdministrativeOfficer'),
    ]


    # Civil status choices
    CIVIL_STATUS_CHOICES = [
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Widowed', 'Widowed'),
        ('Divorced', 'Divorced'),
        ('Separated', 'Separated'),
    ]


    # Gender choices
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]


    # User fields
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)


    position = models.CharField(max_length=50, choices=POSITION_CHOICES)
    lastname = models.CharField(max_length=150)
    firstname = models.CharField(max_length=150)
    middlename = models.CharField(max_length=150, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    civil_status = models.CharField(max_length=20, choices=CIVIL_STATUS_CHOICES, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    birthplace = models.CharField(max_length=150, blank=True, null=True)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)


    # Audit log tracking
    history = AuditlogHistoryField()


    objects = CustomUserManager()


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['usertype', 'firstname', 'lastname', 'email']


    def __str__(self):
        return f"{self.lastname}, {self.firstname}"


    @property
    def age(self):
        today = date.today()
        if self.birthday:
            return today.year - self.birthday.year - (
                (today.month, today.day) < (self.birthday.month, self.birthday.day)
            )
        return None


    class Meta:
        db_table = 'tblUser'

