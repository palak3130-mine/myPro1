from rest_framework import serializers
from .models import Ticket, Member, ClientCompany

class ClientCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientCompany
        fields = ['id', 'company_name']

class TicketSerializer(serializers.ModelSerializer):
    org_name_display = serializers.CharField(source='org_name.company_name', read_only=True)
    assigned_member_display = serializers.CharField(source='assigned_member.member_name', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'ticket_code',   # <--- Using Code now
            'org_name', 'org_name_display', 
            'submitter_name', 'submission_source', 
            'issue_type', 'description', 
            'contact_number', 'email',
            'status', 'assigned_member', 'assigned_member_display',
            'created_at'
        ]