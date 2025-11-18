from django.http import HttpResponse, JsonResponse
from kzqa.utils.aliyunOss import put_object_oss
import json
import base64
import uuid, os, zipfile
from django.conf import settings
from django.core.cache import cache
from django.views.decorators.cache import cache_page

from django.core.files.storage import FileSystemStorage
# 上传 文件到本地
def uploadFile(request):
    if request.method == 'POST':
        fs = FileSystemStorage()
        file_data = request.FILES['files']
        print(settings.MEDIA_ROOT)
        filename = fs.save(file_data.name, file_data)
        file_url = settings.MEDIA_URL + filename
        response_data = {
            "code":200,
            "text":"成功",
            "file_url":file_url
        }
        return HttpResponse(json.dumps(response_data))

"""
    上传到 阿里云OSS
"""
def uploadFileOss(request):
    image_object = request.FILES.get('img')
    ext = image_object.name.rsplit('.')[-1]
    key = "{}.{}".format(str(uuid.uuid4()), ext)
    image_object_bytes = image_object.read()
    file_url = put_object_oss(ObjectName=key, LocalFile=image_object_bytes, )
    response_data = {
        'response_code': '200',
        'text': '上传成功',
        'file_url': file_url
    }
    response_json = json.dumps(response_data)
    return HttpResponse(response_json)

@cache_page(3 * 60)
def handle_file_download(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        file_list = data.get('file_list')
        valid_files = all(os.path.isfile(file_path) for file_path in file_list)
        if valid_files:
            zip_file_name = generate_zip_file(file_list)

            if zip_file_name:
                download_link = create_download_link(zip_file_name)
                response_data = {
                    "code":200,
                    "text":"成功",
                    "data":{
                        "download_url":download_link
                    }
                }
                print(response_data)
                # 响应下载链接给前端
                return HttpResponse(json.dumps(response_data))
            else:
                response_data = {
                    "code":400,
                    "text":"失败"
                }
                return HttpResponse(json.dumps(response_data))
        else:
            response_data = {
                "code":400,
                "text":"失败"
            }
            return HttpResponse(json.dumps(response_data))
    else:
        response_data = {
            "code":400,
            "text":"失败"
        }
        return HttpResponse(json.dumps(response_data))


def generate_zip_file(file_list):
    # 创建一个临时的内存文件
    temp_file = uuid.uuid4().hex + '.zip'
    zip_io = zipfile.ZipFile(temp_file, 'w', zipfile.ZIP_DEFLATED)

    for file_path in file_list:
        if os.path.isfile(file_path):
            zip_io.write(file_path, os.path.basename(file_path))
        else:
            return None
    zip_io.close()
    return temp_file


def create_download_link(file_name):
    # 生成唯一的下载链接
    link = f"/download/{file_name}"
    # 设置缓存过期时间
    cache.set(link, file_name, timeout=180)  # 3分钟过期
    return link
