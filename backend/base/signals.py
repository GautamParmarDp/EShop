from django.db.models.signals import pre_save
from django.contrib.auth.models import User #default user model

# sender=>The model class.
# instance=>The actual instance being saved.

def updateUser(sender,instance,**kwargs):
    # print('Signal triggered...!!!')
    user = instance
    if user.email != '' :
        user.username = user.email
        
pre_save.connect(updateUser,sender=User)