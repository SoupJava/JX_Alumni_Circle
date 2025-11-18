from django.http import HttpResponse
from django.core import serializers
import json


def getGoodsInfo(request):
    # data = json.loads(request.body)
    # user_number = data.get('user_number')
    goods_list = models.Goods.objects.all()
    goods_data = []
    for good in goods_list:
        goods_data.append({
            'id': good.id,
            'name': good.name,
            'price': good.price,
            'bzq': good.bzq,
            'sczq': good.sczq,
            'image': good.image.url,
            'desc': good.desc,
            'goods_type': good.goodstype.name,
            'store': good.store.name
        })
    response_data ={
        'response_code': '200',  
        'text': '商品信息获取成功',
        'goods': goods_data
    }
    # 返回JSON响应
    return HttpResponse(json.dumps(response_data))

def add_good(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        price = data.get('price')
        image = data.get('image')
        desc = data.get('desc')
        goods_type = data.get('goods_type')
        store = data.get('store')
        
        try:
            models.Goods.objects.create(name=name,price=price,image=image,desc=desc,goods_type=goods_type,store=store)
            response_data = {
                "code":"200",
                "text":"成功"
            }
            return HttpResponse(json.dumps(response_data))
        except Exception as e:
            print(e)
            response_data = {
                "code":"400",
                "text":"失败"
            }
            return HttpResponse(json.dumps(response_data))
    
def delete_good(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        try:
            good = models.Goods.objects.filter(id=id)
            if not good:
                response_data = {
                    "code":"400",
                    "text":"失败",
                }
                return HttpResponse(json.dumps(response_data))
            good.delete()
            response_data = {
                "code":"200",
                "text":"成功"
            }
            return HttpResponse(json.dumps(response_data))
        except Exception:
            response_data = {
                    "code":"400",
                    "text":"失败"
                }
            return HttpResponse(json.dumps(response_data))
def update_Good(request):
    # 二次判断
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get('id')
        name = data.get("name")
        price = data.get('price')
        image = data.get('image')
        desc = data.get('desc')
        goods_type = data.get('goods_type')
        store = data.get('store')
        try:
            good = models.Goods.objects.filter(id=id)
            if not good:
                response_data = {
                    "code":"400",
                    "text":"失败"
                }
                return HttpResponse(json.dumps(response_data))
            models.Goods.objects.filter(id=id).update(name=name,price=price,image=image,desc=desc,goods_type=goods_type,store=store)
            response_data = {
                "code":"200",
                "text":"成功"
            }
            return HttpResponse(json.dumps(response_data))
        except Exception:
            response_data = {
                    "code":"400",
                    "text":"失败"
                }
            return HttpResponse(json.dumps(response_data))