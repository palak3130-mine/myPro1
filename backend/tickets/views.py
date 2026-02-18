from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket, ClientCompany
from .serializers import TicketSerializer, ClientCompanySerializer
from .utils import assigned_tickets  # Import your logic function
from django.utils import timezone
from django.shortcuts import get_object_or_404

# 1. API to get the list of Companies for the Dropdown
@api_view(['GET'])
def get_client_companies(request):
    companies = ClientCompany.objects.all()
    serializer = ClientCompanySerializer(companies, many=True)
    return Response(serializer.data)

# 2. API to Create a Ticket (The Logic Core)
@api_view(['POST'])
def create_ticket(request):
    serializer = TicketSerializer(data=request.data)
    
    if serializer.is_valid():
        # Save the ticket first (Status = Open)
        ticket = serializer.save()
        
        # Check Time (10 AM - 6 PM)
        now = timezone.localtime()
        current_hour = now.hour
        
        message = ""
        
        # LOGIC: If between 10 AM and 6 PM (18:00)
        if 10 <= current_hour < 18:
            # Attempt to assign immediately
            member = assigned_tickets(ticket)
            if member:
                message = f"{member.member_name} is assigned for your service and will contact you very soon."
            else:
                message = "Ticket received. Finding the best available member..."
        else:
            # Off-hours (6 PM - 10 AM)
            # Ticket stays 'Open' (Pending)
            message = "The service team is available between 10 am – 6 pm. The assigned member will contact you very soon."
            
        return Response({
            "status": "success",
            "ticket_id": ticket.ticket_id,
            "message": message
        })
        return Response(serializer.errors, status=400)

# 3. API to Check Ticket Status
@api_view(['GET'])
def get_ticket_status(request, ticket_code):
    # Search by the new random code
    ticket = get_object_or_404(Ticket, ticket_code=ticket_code)
    serializer = TicketSerializer(ticket)
    return Response(serializer.data)
    
    