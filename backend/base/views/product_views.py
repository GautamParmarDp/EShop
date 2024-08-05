from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from base.models import Product
# from .products import products
from base.serializer import ProductSerializer
from rest_framework import status

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

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
                    user=user,
                    name='Sample Name',
                    brand = 'Sample Brand',
                    category = 'Sample Category',
                    description ='Put description here',
                    price = 0,
                    countInStock = 0    
                )
    serializer=ProductSerializer(product,many=False) #we are serializing One object so it is False
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    product = Product.objects.get(_id=pk)

    data = request.data
    product.name=data['name']
    product.brand=data['brand']
    product.category=data['category']
    product.description=data['description']
    product.price=data['price']
    product.countInStock=data['countInStock']
    product.save()

    serializer=ProductSerializer(product,many=False) #we are serializing One object so it is False
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')