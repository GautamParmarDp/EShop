from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User #default user model
from django.contrib.auth.hashers import make_password
from base.serializer import UserSerializer ,UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # # Learned How to add custom user data within our Encoded Token
    # @classmethod
    # def get_token(cls, user):
    #     token = super().get_token(user)

    #     # Add custom claims
    #     token['username'] = user.username
    #     token['message'] = 'Testing..'
    #     # ...

    #     return token

    # Learned How to add custom user data(Not encoded) in respone along with Encoded Token
    def validate(self, attrs):
        data = super().validate(attrs)

        # refresh = self.get_token(self.user)

        # data["refresh"] = str(refresh)
        # data["access"] = str(refresh.access_token)

        # data["username"] = self.user.username
        # data["email"] = self.user.email
        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data 
    # print("data : ",data)
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),

        )
        serializer = UserSerializerWithToken(user,many=False)
        return Response(serializer.data)
    except:
        message={'detail':'User with this emial already exists'}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user 
    # usually in Django when user is LoggedIn using default authentication system we can get that user using request.user
    # But here we are using API decorator so request.user gives us the user data from the Token
    
    serializer=UserSerializer(user,many=False) #we are serializing Many objects so it is T rue
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user #got the user obj from the token that was sent
    serializer=UserSerializerWithToken(user,many=False) #we are serializing one object so it is False

    #user updated in the database using data from the request and saved
    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password']!='' :
        user.password = make_password(data['password'])
    user.save()
    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request): #Admin can see all users
    users = User.objects.all()
    serializer=UserSerializer(users,many=True) #we are serializing Many objects so it is T rue
    return Response(serializer.data)
