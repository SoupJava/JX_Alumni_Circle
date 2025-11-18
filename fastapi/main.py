from fastapi import FastAPI,File, UploadFile, Form
import uvicorn
import jieba
import openai
import FileConversion
from datetime import datetime
from datetime import timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import uuid
from starlette.responses import FileResponse
import shutil
import os, sys
# 当前路径加入系统变量 ------------------------------------
root_path = os.getcwd()
# print(root_path)
sys.path.append(root_path)
# -----------------------------------------------------

app = FastAPI()
scheduler = AsyncIOScheduler()
user_temp_address={}

@scheduler.scheduled_job('interval', minutes=3)
async def cron_job(): #清理地址缓存
    # 执行任务的内容，例如打印当前时间
    now = datetime.now()
    timestamp = now.timestamp()
    for temp in list(user_temp_address.keys()):
        if user_temp_address.get(temp)[1]<timestamp:
            del user_temp_address[temp]
            continue
    # for i in user_temp_address:
    #     print(i+":"+user_temp_address[i])
    print(len(user_temp_address))
    print(f"The current time is {datetime.now()}")

@scheduler.scheduled_job('interval', minutes=180)
async def cron_job2(): #清理硬盘缓存
    print("开始删除")
    shutil.rmtree("E:\\desktop\\test")
    os.mkdir("E:\\desktop\\test")
    print("删除完毕")
# 启动scheduler
@app.on_event("startup")
async def startup_event():
    print("FastApi服务启动")
    print("定时任务启动")
    scheduler.start()
@app.on_event("shutdown")
async def shutdown_event():
    print("FastApi服务关闭")
    scheduler.shutdown()
    print("定时任务关闭")


@app.get("/")
async def root():
    FileConversion.docxTopdf(r"E:\\desktop\\test\\1.docx",r"E:\\desktop\\test\\1.pdf")
    return {"message": "Hello World"}

@app.get("/sentence")
async def fenci(sentence:str=None):
    work_list=jieba.cut(sentence)
    return work_list

@app.post("/jxxyq/FileConversion")
async def Conversion(file: UploadFile = File(...)):
    # start = time.time()
    try:
        res = await file.read()
        filetype=file.filename.split('.')[-1]
        if filetype=='docx':
            docxName=str(uuid.uuid1())
            path="E:\\desktop\\test\\"+docxName+".docx"
            path2="E:\\desktop\\test\\"+docxName+".pdf"
            with open(path, "wb") as f:
                f.write(res)
            correct_code=FileConversion.docxTopdf(path,path2)
            if correct_code==100:
                id=str(uuid.uuid1())
                token=str(uuid.uuid1())
                now = datetime.now()+timedelta(minutes=2)
                timestamp = now.timestamp()
                value=[]
                value.append(token)
                value.append(timestamp)
                value.append(path2)
                user_temp_address[id]=value
                return "http://192.168.130.48:8000/jxxyq/getfile?id="+id+"&token="+token
            else:
                return "error"
        if filetype=='ppt':
            pptName=str(uuid.uuid1())
            path="E:\\desktop\\test\\"+pptName+".ppt"
            path2="E:\\desktop\\test\\"+pptName+".pdf"
            with open(path, "wb") as f:
                f.write(res)
            correct_code=FileConversion.pptTopdf(path,path2)
            if correct_code==100:
                id=str(uuid.uuid1())
                token=str(uuid.uuid1())
                now = datetime.now()+timedelta(minutes=2)
                timestamp = now.timestamp()
                value=[]
                value.append(token)
                value.append(timestamp)
                value.append(path2)
                user_temp_address[id]=value
                return "http://127.0.0.1:8000/jxxyq/getfile?id="+id+"&token="+token
            else:
                return "error"
        if filetype=='xlsx':
            xlsxName=str(uuid.uuid1())
            path="E:\\desktop\\test\\"+xlsxName+".xlsx"
            path2="E:\\desktop\\test\\"+xlsxName+".pdf"
            with open(path, "wb") as f:
                f.write(res)
            correct_code=FileConversion.excelTopdf(path,path2)
            if correct_code==100:
                id=str(uuid.uuid1())
                token=str(uuid.uuid1())
                now = datetime.now()+timedelta(minutes=2)
                timestamp = now.timestamp()
                value=[]
                value.append(token)
                value.append(timestamp)
                value.append(path2)
                user_temp_address[id]=value
                return "http://127.0.0.1:8000/jxxyq/getfile?id="+id+"&token="+token
            else:
                return "error"
        if filetype=='doc':
            jpgName=str(uuid.uuid1())
            path="E:\\desktop\\test\\"+jpgName+".doc"
            path2="E:\\desktop\\test\\"+jpgName+".docx"
            with open(path, "wb") as f:
                f.write(res)
            correct_code=FileConversion.docTodocx(path,path2)
            if correct_code==100:
                id=str(uuid.uuid1())
                token=str(uuid.uuid1())
                now = datetime.now()+timedelta(minutes=2)
                timestamp = now.timestamp()
                value=[]
                value.append(token)
                value.append(timestamp)
                value.append(path2)
                user_temp_address[id]=value
                return "http://127.0.0.1:8000/jxxyq/getfile?id="+id+"&token="+token
            else:
                return "error"
    except Exception as e:
        return {"message": str(e), 'time' 'filename': file.filename}

@app.get("/jxxyq/getfile")
async def getfile(id:str=None,token:str=None):
    if id in user_temp_address.keys():
        if token==user_temp_address.get(id)[0]:
            now = datetime.now()
            timestamp = now.timestamp()
            if timestamp<=user_temp_address.get(id)[1]:
                result=user_temp_address.get(id)[2].split(".")
                return FileResponse(
                    user_temp_address.get(id)[2],
                    filename="Result."+result[-1],
                )
    return {"err":"You have an error,maybe is TimeOut"}

@app.get("/jxxyq/getzip")
async def getfile(id:str=None,token:str=None):
    return FileResponse(
                    "E://desktop//123.zip",
                    filename="Result.zip",
    )
    # return {"err":"You have an error,maybe is TimeOut"}

if __name__ == '__main__':
    uvicorn.run(app="main:app", host="192.168.130.48", port=8000, reload=False)