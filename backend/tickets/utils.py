from django.utils import timezone
from django.db.models import Count, Q
from .models import Member, Ticket

def is_working_hours():
    """Checks if current time is between 10 AM and 6 PM."""
    now = timezone.localtime()
    return 10 <= now.hour < 18

def assigned_tickets(ticket):
    """
    Finds the best member for the ticket.
    Rule: Matching Specialty + Lowest Active Load.
    """
    # 1. Filter members who match the issue type and are active
    candidates = Member.objects.filter(specialty=ticket.issue_type, is_active=True)
    
    if not candidates.exists():
        return None # No one available for this issue type

    # 2. Calculate Load: Count of tickets where status is Open or Assigned
    # We annotate each member with a field 'active_load'
    candidates = candidates.annotate(
        active_load=Count('ticket', filter=Q(ticket__status__in=['Open', 'Assigned']))
    ).order_by('active_load').first()

    # 3. Pick the winner (lowest load)
    best_member = candidates
    
    # 4. Assign the ticket
    ticket.assigned_member = best_member
    ticket.status = 'Assigned'
    ticket.save()
    
    # 5. Update Member Stats (Optional, for reporting)
    best_member.total_issues_assigned += 1
    best_member.save()
    
    return best_member