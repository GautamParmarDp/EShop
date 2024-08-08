from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from base.models import Product , Review
# from .products import products
from base.serializer import ProductSerializer
from rest_framework import status

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword') #whatever we are searching in searchBox that querytext comes here
    # print('query:',query)
    if query == None:
        query = ''
    
    # icontains=> case insensitive search
    products = Product.objects.filter( name__icontains=query )
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

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get( _id=product_id )
    product.image = request.FILES.get('image')
    product.save()

    return Response('Image uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request,pk):
    user=request.user
    product = Product.objects.get(_id=pk)
    data=request.data

    #1. review already exists
    alreadyExists = product.review_set.filter(user=user).exists() #return true if product review is already filled by user
    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response( content , status=status.HTTP_400_BAD_REQUEST )
    #2. No rating or 0 
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating'}
        return Response( content , status=status.HTTP_400_BAD_REQUEST )
    else:
        review = Review.objects.create(
                    user=user,
                    product=product,
                    name=user.first_name,
                    rating=data['rating'], 
                    comment=data['comment'],
                )
        #get all Reviews in queryset after new review is created and update (numReviews,rating) in product model 
        allReviews = product.review_set.all() 
        product.numReviews = len(allReviews) #numReviews updated in product model

        total = 0
        for i in allReviews:
            total = total + i.rating
        product.rating = total/len(allReviews) #rating updated in product model
        product.save()

        return Response('Review added')

    #3. create review
