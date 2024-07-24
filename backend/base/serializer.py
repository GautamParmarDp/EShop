from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    name= serializers.SerializerMethodField(read_only=True)
    
    _id= serializers.SerializerMethodField(read_only=True) 
    #bcz in frontend api we used _id so rather than changing complete model just changing it here in response
    isAdmin= serializers.SerializerMethodField(read_only=True) 

    class Meta:
        model = User
        fields = ['id','_id','username','email','name','isAdmin']
    
    def get_name(self,obj):
        # obj is User Object here
        name = obj.first_name
        if name == '':
            name = obj.email
        return name
    
    def get__id(self,obj):
        _id=obj.id
        return _id
    
    def get_isAdmin(self,obj):
        return obj.is_staff
    