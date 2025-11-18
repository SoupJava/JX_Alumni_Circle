from django.http import HttpResponse
from django.core import serializers
import json


def storeAdmin_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_number = data.get('user_number')
        password = data.get('password')
        storeAdmin = models.StoreAdmin.objects.filter(user_number=user_number,password=password)
        if storeAdmin:
            response_data = {
                "code":200,
                "text":"成功",
            }
            return HttpResponse(json.dumps(response_data))
        else:
            response_data = {
                "code":400,
                "text":"失败",
            }
            return HttpResponse(json.dumps(response_data))
        
    else:
        response_data = {
            "code":400,
            "text":"失败",
        }
        return HttpResponse(json.dumps(response_data))