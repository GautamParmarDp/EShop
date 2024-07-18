from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
# from .products import products
from .serializer import ProductSerializer

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