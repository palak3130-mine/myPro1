from django.contrib import admin
from .models import ClientCompany, Member, Ticket

# Register your models here.
@admin.register(ClientCompany)
class ClientCompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'category_type', 'contact_number')

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_name', 'specialty', 'is_active', 'total_issues_assigned')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_code', 'org_name', 'status', 'assigned_member', 'created_at')
    list_filter = ('status', 'issue_type')