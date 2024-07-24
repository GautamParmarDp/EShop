from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from .models import Product
from django.contrib.auth.models import User #default user model

# from .products import products
from .serializer import ProductSerializer , UserSerializer ,UserSerializerWithToken

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

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

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/products/',
        'api/products/create/',

        'api/products/upload/',
        'api/products/<id>/reviews/',

        'api/products/top/',
        'api/products/<id>/',
        'api/products/delete/<id>/',
        'api/products/<update>/<id>/',
    ]

    return Response(routes)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user 
    # usually in Django when user is LoggedIn using default authentication system we can get that user using request.user
    # But here we are using API decorator so request.user gives us the user data from the Token
    
    serializer=UserSerializer(user,many=False) #we are serializing Many objects so it is T rue
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer=UserSerializer(users,many=True) #we are serializing Many objects so it is T rue
    return Response(serializer.data)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer=ProductSerializer(products,many=True) #we are serializing Many objects so it is T rue
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request,pk):
    # product=[]
    # for i in products:
    #     if i['_id']==pk :
    #         product=i
    #         break
    product = Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False) #we are serializing One object so it is False

    return Response(serializer.data)