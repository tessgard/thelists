from django.db import models


class List(models.Model):
    name = models.CharField(max_length=255)
    is_ordered = models.BooleanField(default=False)
    has_checkboxes = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name}"


class ListItem(models.Model):
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='items')
    content = models.TextField()
    is_checked = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.content[:50]} - {self.list.name}"
