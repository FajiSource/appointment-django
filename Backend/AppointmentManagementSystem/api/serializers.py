from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    # Computed field
    age = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'usertype',
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
        user = User(**validated_data)
        user.set_password(password)
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
    
