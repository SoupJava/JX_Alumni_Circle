import os
import shutil

from win32com import client as wc
import zipfile
def docxTopdf(path,path2):
    from docx2pdf import convert
    convert(path,path2)
    return 100
def pptTopdf(path,path2):
    print(path)
    path2 = path2.replace('/', '\\');
    print(path2)
    pptt = wc.Dispatch("PowerPoint.Application")
    ppt = pptt.Presentations.Open(path)
    ppt.SaveAs(path2, 32)
    ppt.Close()
    pptt.Quit()
    # from ppt2pdf import convert
    # path2 = path2.Replace('/', '\\');
    # convert(path,path2)
    return 100
def jpgTopdf(path,path2):
    from PIL import Image
    img=Image.open(path)
    img.save(path2,"PDF",resolution=100.0,save_all=True)
    return 100
def excelTopdf(path,path2):
    print(path)
    print(path2)
    excel=wc.Dispatch("Excel.Application")
    xls=excel.Workbooks.Open(path)
    xls.SaveAs(path2,57)
    xls.Close()
    excel.Quit()
    return 100
def pdfTodocx(path,path2):
    from pdf2docx import Converter
    #pdf转word
    a = Converter(path)  #pdf的路径
    a.convert(path2)
    a.close() #一定要有，释放内存用的
    return 100
def docTodocx(path,path2):
    word = wc.Dispatch("Word.Application")
    doc = word.Documents.Open(path)
    doc.SaveAs(path2, 12)  # 12表示docx格式
    doc.Close()
    word.Quit()
    return 100
def zipTopdf(path,path2):
    zipfilename=path
    if zipfile.is_zipfile(zipfilename):
        zfile=support_gbk(zipfile.ZipFile(zipfilename))
        dirpath=path[:-4]
        dirpath2=path2[:-4]
        os.mkdir(dirpath2)
        for file in zfile.namelist():
            zfile.extract(file,dirpath)
        files=os.listdir(dirpath)
        print(files)
        for file in files:
            result=os.path.splitext(file)
            filetype=result[1]
            filename=result[0]
            filepath=dirpath+"/"+file
            print(filepath)
            filepath2=dirpath2+"/"+filename+".pdf"
            print(filetype)
            if filetype=='.docx':
                docxTopdf(filepath,filepath2)
            elif filetype=='.ppt':
                pptTopdf(filepath,filepath2)
            elif filetype=='.xlsx':
                excelTopdf(filepath,filepath2)
            elif filetype=='.jpg':
                jpgTopdf(filepath,filepath2)
        zipDir(dirpath2,path2)#压缩文件夹
        shutil.rmtree(dirpath)
        shutil.rmtree(dirpath2)
        return 100
def zipTodocx(path,path2):
    zipfilename=path
    if zipfile.is_zipfile(zipfilename):
        zfile=support_gbk(zipfile.ZipFile(zipfilename))
        dirpath=path[:-4]
        dirpath2=path2[:-4]
        os.mkdir(dirpath2)
        for file in zfile.namelist():
            zfile.extract(file,dirpath)
        files=os.listdir(dirpath)
        for file in files:
            result=os.path.splitext(file)
            filetype=result[1]
            filename=result[0]
            filepath=dirpath+"/"+file
            filepath2=dirpath2+"/"+filename+".docx"
            if filetype=='.doc':
                docTodocx(filepath,filepath2)
            elif filetype=='.pdf':
                pdfTodocx(filepath,filepath2)
        zipDir(dirpath2,path2)#压缩文件夹
        shutil.rmtree(dirpath)
        shutil.rmtree(dirpath2)
        return 100
def zipDir(dirpath,outFullName):
    zip = zipfile.ZipFile(outFullName,"w",zipfile.ZIP_DEFLATED)
    for path,dirnames,filenames in os.walk(dirpath):
        fpath = path.replace(dirpath,'')

        for filename in filenames:
            zip.write(os.path.join(path,filename),os.path.join(fpath,filename))
    zip.close()
#中文编码补丁
def support_gbk(zip_file: zipfile.ZipFile):
    name_to_info = zip_file.NameToInfo
    # copy map first
    for name, info in name_to_info.copy().items():
        real_name = name.encode('cp437').decode('gbk')
        if real_name != name:
            info.filename = real_name
            del name_to_info[name]
            name_to_info[real_name] = info
    return zip_file

if __name__ =="__main__":
    docTodocx(r"E:\\desktop\\test\\1.doc",r"E:\\desktop\\test\\1.docx")