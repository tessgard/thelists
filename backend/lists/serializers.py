from rest_framework import serializers
from django.contrib.auth.models import User
from .models import List, ListItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ['id', 'list', 'content', 'is_checked', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    items = ListItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = List
        fields = ['id', 'owner', 'name', 'is_ordered', 'has_checkboxes', 'items', 'items_count', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_items_count(self, obj):
        return obj.items.count()


class ListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'name', 'is_ordered', 'has_checkboxes']
        read_only_fields = ['id']
