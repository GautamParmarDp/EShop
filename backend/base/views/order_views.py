from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from base.models import Product , Order , OrderItem, ShippingAddress
from base.serializer import ProductSerializer , OrderSerializer
from rest_framework import status
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail':'No Orders Items'} , status=status.HTTP_400_BAD_REQUEST)
    else:
        # 1. create order
        order = Order.objects.create(
                    user = user ,
                    paymentMethod = data['paymentMethod'] ,
                    taxPrice = data['taxPrice'] ,
                    shippingPrice = data['shippingPrice'] ,
                    totalPrice = data['totalPrice']
                    )
        # 2. create shipping address
        shipping = ShippingAddress.objects.create(
                        order = order,
                        address = data['shippingAddress']['address'],
                        city = data['shippingAddress']['city'],
                        postalCode = data['shippingAddress']['postalCode'],
                        country = data['shippingAddress']['country']
                        )
        # 3. create order items and set order to orderItem relation

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name ,
                qty = i['qty'] ,
                price = i['price'] ,
                # price = product.price ,
                image = product.image.url ,
            )  
        
            # 4. update stock
            product.countInStock = product.countInStock - item.qty
            product.save() 
    
        serializer = OrderSerializer(order,many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders( request ):
    user = request.user
    orders = user.order_set.all() #get all of that user's orders
    serializer = OrderSerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders( request ):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById( request , pk ):

    user = request.user
    
    try:
        order = Order.objects.get(_id = pk)
        #2 types of user can see the order..(1)staff/admin user (2) user that placed the order and the userToken that we get are same user then they can see the order
        if(user.is_staff or order.user == user):  
            sereializer = OrderSerializer(order , many=False)
            return Response(sereializer.data)
        else:
            return Response({'detail':'Not authorised to view the Order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist!'},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid( request , pk ):
    order = Order.objects.get(_id = pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered( request , pk ):
    order = Order.objects.get(_id = pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')