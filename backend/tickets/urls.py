from django.urls import path
from . import views

urlpatterns = [
    path('clients/', views.get_client_companies, name='get_clients'),
    path('create/', views.create_ticket, name='create_ticket'),
    path('status/<str:ticket_code>/', views.get_ticket_status, name='get_ticket_status'),
]