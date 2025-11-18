from django.http import HttpResponse
from django.core import serializers
import json


def getStoresInfo(request):
    if request.method == "GET":
        stores = models.Store.objects.all()
        stores_data = serializers.serialize('json', stores)
        stores_data_json = json.loads(stores_data)
        print(stores_data_json)
        stores_data = []
        for stores in stores_data_json:
            store = stores['fields']
            print(store)
            stores_data.append(store)
        response_data = {
            'code': '200',
            'text': '店铺信息获取成功',
            'data':{
                'stores': stores_data
            }
            
        }
        return HttpResponse(json.dumps(response_data))
def add_Store(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        phone = data.get("phone")
        logo = data.get("logo")
        try:
            models.Store.objects.create(name=name,phone=phone,logo=logo)
            response_data = {
                "code":"200",
                "text":"成功",
            }
            return HttpResponse(json.dumps(response_data))
        except Exception as e:
            print(e)
            response_data = {
                "code":"400",
                "text":"失败",
            }
            return HttpResponse(json.dumps(response_data))
    
def delete_Store(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        try:
            store = models.Store.objects.filter(name=name)
            if not store:
                response_data = {
                    "code":"400",
                    "text":"失败",
                }
                return HttpResponse(json.dumps(response_data))
            store.delete()
            response_data = {
                "code":"200",
                "text":"成功",
            }
            return HttpResponse(json.dumps(response_data))
        except Exception:
            response_data = {
                    "code":"400",
                    "text":"失败",
                }
            return HttpResponse(json.dumps(response_data))
def update_Store(request):
    # 二次判断
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        phone = data.get("phone")
        logo = data.get("logo")
        try:
            store = models.Store.objects.filter(name=name)
            if not store:
                response_data = {
                    "code":"400",
                    "text":"失败",
                }
                return HttpResponse(json.dumps(response_data))
            models.Store.objects.filter(name=name).update(phone=phone,logo=logo)
            response_data = {
                "code":"200",
                "text":"成功",
            }
            return HttpResponse(json.dumps(response_data))
        except Exception:
            response_data = {
                    "code":"400",
                    "text":"失败",
                }
            return HttpResponse(json.dumps(response_data))