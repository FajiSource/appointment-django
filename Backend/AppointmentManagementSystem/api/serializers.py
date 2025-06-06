from rest_framework import serializers
from .models import User
from .models import Client
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    # Computed field
    age = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'position',
            'firstname',
            'lastname',
            'middlename',
            'address',
            'civil_status',
            'birthday',
            'birthplace',
            'mobile_number',
            'email',
            'gender',
            'age',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['is_staff'] = True
        user = User(**validated_data)
        user.password = make_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'  
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
     
        password = validated_data.pop('password')
        client = Client(**validated_data)
        client.password = make_password(password)  
        client.save()
        return client