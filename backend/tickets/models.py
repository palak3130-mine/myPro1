import random
import string
from django.db import models
from django.utils import timezone

# --- Helper Function to Generate Random Code ---
def generate_ticket_code():
    # Generates a random 6-character string (e.g., "A7X29B")
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# 1. Client Company Table
class ClientCompany(models.Model):
    CATEGORY_CHOICES = [('Gold', 'Gold'), ('Silver', 'Silver'), ('Bronze', 'Bronze')]
    company_name = models.CharField(max_length=255, unique=True)
    category_type = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Bronze')
    contract_duration = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return self.company_name

# 2. Member (Staff) Table
class Member(models.Model):
    SPECIALTY_CHOICES = [('Hardware', 'Hardware'), ('Software', 'Software'), ('Network', 'Network')]
    member_name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    total_issues_assigned = models.IntegerField(default=0)
    resolved_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.member_name} ({self.specialty})"

# 3. Ticket Table (Updated with ticket_code)
class Ticket(models.Model):
    STATUS_CHOICES = [('Open', 'Open'), ('Assigned', 'Assigned'), ('Resolved', 'Resolved'), ('Closed', 'Closed')]
    SOURCE_CHOICES = [('Website', 'Website'), ('WhatsApp', 'WhatsApp'), ('Email', 'Email'), ('Phone', 'Phone')]
    
    # NEW: Random 6-char code
    ticket_code = models.CharField(max_length=6, default=generate_ticket_code, unique=True, editable=False)
    
    org_name = models.ForeignKey(ClientCompany, on_delete=models.CASCADE)
    submitter_name = models.CharField(max_length=255)
    submission_source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='Website')
    issue_type = models.CharField(max_length=50, choices=Member.SPECIALTY_CHOICES)
    description = models.TextField()
    contact_number = models.CharField(max_length=20, default='')
    email = models.EmailField(default='')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    assigned_member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Ticket #{self.ticket_code} - {self.org_name}"