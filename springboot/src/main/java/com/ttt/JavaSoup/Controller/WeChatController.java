package com.ttt.JavaSoup.Controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ttt.JavaSoup.Common.GetAccessToken;
import com.ttt.JavaSoup.Entity.*;
import okhttp3.*;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class WeChatController {

    @PostMapping("/verify_wx_token")
    public String handleRequest(HttpServletRequest request) {
        // 解析微信服务器推送的消息
        String xml = readRequestBody(request);
        Map<String, String> message = parseMessage(xml);

        // 处理消息
        String response = handleMessage(message);

        return response;
    }

    // 读取请求体
    private String readRequestBody(HttpServletRequest request) {
        try {
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                System.out.println((line));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read request body", e);
        }
    }

    // 解析微信消息
    private Map<String, String> parseMessage(String xml) {
        try {
            Document doc = DocumentHelper.parseText(xml);
            Element root = doc.getRootElement();
            Map<String, String> message = new HashMap<>();
            for (Iterator<Element> it = root.elementIterator(); it.hasNext(); ) {
                Element element = it.next();
                message.put(element.getName(), element.getText());
            }
            return message;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse message", e);
        }
    }

    // 处理微信消息
    private String handleMessage(Map<String, String> message) {
        String msgType = message.get("MsgType");
        String content = message.get("Content");
        System.out.println(content.substring(0,4));
        String access_token=GetAccessToken.getInstance().getAccessToken();
        System.out.println("access_token:"+access_token);
        if ("text".equals(msgType)) {
            if ("hello".equals(content)) {
                return buildTextResponse(message, "Hello, world!\nWelcome to 关注 喵喵鱼汤");
            }
            if("JavaSoup_".equals(content.length()>9?content.substring(0,9):"1")){
                String token = message.get("Content");
                String openid= message.get("FromUserName");
                TokenGetOpenId tokenGetOpenId = null;
                BaseEntity baseEntity = null;
                OkHttpClient client = new OkHttpClient().newBuilder()
                        .build();
                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\r\n       \"token\":\""+token+"\"\r\n}");
                Request request = new Request.Builder()
                        .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=TokenGetOpenId")
                        .method("POST", body)
                        .build();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    baseEntity = new Gson().fromJson(response.body().string(), BaseEntity.class);
                    System.out.println(baseEntity);
                    tokenGetOpenId=new Gson().fromJson(baseEntity.getResp_data(),TokenGetOpenId.class);
                    System.out.println(tokenGetOpenId);

                } catch (IOException e) {
                    return buildTextResponse(message, "程序异常,关联失败");
                }
                if(tokenGetOpenId.getState()==1){
                    client = new OkHttpClient().newBuilder()
                            .build();
                    mediaType = MediaType.parse("application/json");
                    body = RequestBody.create(mediaType, "{\r\n        \"xcx_openid\":\""+tokenGetOpenId.getOpenid()+"\",\r\n        \"openid\":\""+openid+"\"\r\n}");
                    request = new Request.Builder()
                            .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=UserKeep")
                            .method("POST", body)
                            .build();
                    call = client.newCall(request);
                    try {
                        Response response = call.execute();
                        System.out.println("postSync:"+response.body().string());
                        return buildTextResponse(message, "用户"+tokenGetOpenId.getJxid()+"关联成功");
//                    Log.i(TAG,"postSync:"+response.body().string());
                    } catch (IOException e) {
                        return buildTextResponse(message, "程序异常,关联失败");
                    }
                }else{
                    return buildTextResponse(message, "Token可能过期，总之关联失败");
                }
            }
            if("今天的课".equals(content)){
                String openid= message.get("FromUserName");
                TokenGetOpenId tokenGetOpenId = null;
                BaseEntity baseEntity = null;
                OkHttpClient client = new OkHttpClient().newBuilder()
                        .build();
                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+openid+"\"\r\n}");
                Request request = new Request.Builder()
                        .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=Get_OpenId")
                        .method("POST", body)
                        .build();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    baseEntity = new Gson().fromJson(response.body().string(), BaseEntity.class);
                    System.out.println(baseEntity);
                    tokenGetOpenId=new Gson().fromJson(baseEntity.getResp_data(),TokenGetOpenId.class);
                    System.out.println(tokenGetOpenId);
                    if(tokenGetOpenId.getState()==-1){
                        return buildTextResponse(message, "没有找到小新T_T,请确保已经关联交新校友圈♥");
                    }
                } catch (IOException e) {
                    return buildTextResponse(message, "没有找到小新T_T");
                }
                if(tokenGetOpenId.getState()==1){
                    client = new OkHttpClient().newBuilder()
                            .build();
                    mediaType = MediaType.parse("application/json");
                    body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+tokenGetOpenId.getOpenid()+"\"\r\n}");
                    request = new Request.Builder()
                            .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=GetClassTable")
                            .method("POST", body)
                            .build();
                    call = client.newCall(request);
                    try {
                        Response response = call.execute();
                        BaseEntity baseEntity1=new Gson().fromJson(response.body().string(),BaseEntity.class);
                        ClassTableData classTableData=new Gson().fromJson(baseEntity1.getResp_data(),ClassTableData.class);
                        Calendar calendar=Calendar.getInstance();
                        int dayOfWeek=calendar.get(Calendar.DAY_OF_WEEK);
//                        System.out.println(dayOfWeek);
                        List<WList> lw=classTableData.getWList();
//                        System.out.println(lw);
                        String dclazz="单周:\n====================\n";
                        String sclazz="双周:\n====================\n";
                        for(int i=0;i<lw.size();i++){
                            if(lw.get(i).getDsweek().equals("1")){
                                if(lw.get(i).getDays().equals((dayOfWeek-1==0?7:dayOfWeek-1)+"")){
                                    dclazz+="\uD83D\uDCDD课程名:"+lw.get(i).getName()+"\n";
                                    dclazz+="⏰上课时间:第"+lw.get(i).getJie()+"---"+(Integer.parseInt(lw.get(i).getJie())+1)+"节\n";
                                    dclazz+="\uD83C\uDFE0上课地点:"+lw.get(i).getAddress()+"\n";
                                    dclazz+="\uD83E\uDDD1\u200D\uD83E\uDDB1任课老师:"+lw.get(i).getTeacher()+"\n";
                                    dclazz+="-------------------------\n";
                                }
                            }else {
                                if(lw.get(i).getDays().equals((dayOfWeek-1==0?7:dayOfWeek-1)+"")){
                                    sclazz+="\uD83D\uDCDD课程名:"+lw.get(i).getName()+"\n";
                                    sclazz+="⏰上课时间:第"+lw.get(i).getJie()+"---"+(Integer.parseInt(lw.get(i).getJie())+1)+"节\n";
                                    sclazz+="\uD83C\uDFE0上课地点:"+lw.get(i).getAddress()+"\n";
                                    sclazz+="\uD83E\uDDD1\u200D\uD83E\uDDB1任课老师:"+lw.get(i).getTeacher()+"\n";
                                    sclazz+="-------------------------\n";
                                }
                            }
                        }
                        dclazz+="====================\n";
                        sclazz+="====================\n";
                        return buildTextResponse(message, "亲爱的"+tokenGetOpenId.getJxid()+"用户\n您好!\n鱼汤找到小新并查到课表啦\uD83E\uDD24\uD83C\uDF66\n"+dclazz+sclazz);
                    } catch (IOException e) {
                        return buildTextResponse(message, "没有找到小新T_T");
                    }
                }else{
                    return buildTextResponse(message, "没有找到小新T_T");
                }
            }
            if("我的计划".equals(content)){
                String openid= message.get("FromUserName");
                TokenGetOpenId tokenGetOpenId = null;
                BaseEntity baseEntity = null;
                OkHttpClient client = new OkHttpClient().newBuilder()
                        .build();
                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+openid+"\"\r\n}");
                Request request = new Request.Builder()
                        .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=Get_OpenId")
                        .method("POST", body)
                        .build();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    baseEntity = new Gson().fromJson(response.body().string(), BaseEntity.class);
                    System.out.println(baseEntity);
                    tokenGetOpenId=new Gson().fromJson(baseEntity.getResp_data(),TokenGetOpenId.class);
                    System.out.println(tokenGetOpenId);
                    if(tokenGetOpenId.getState()==-1){
                        return buildTextResponse(message, "没有找到小新T_T,请确保已经关联交新校友圈♥");
                    }
                } catch (IOException e) {
                    return buildTextResponse(message, "没有找到小新T_T");
                }
                if(tokenGetOpenId.getState()==1){
                    client = new OkHttpClient().newBuilder()
                            .build();
                    mediaType = MediaType.parse("application/json");
                    body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+tokenGetOpenId.getOpenid()+"\"\r\n}");
                    request = new Request.Builder()
                            .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=GetPlan")
                            .method("POST", body)
                            .build();
                    call = client.newCall(request);
                    try {
                        Response response = call.execute();
                        BaseEntity baseEntity1=new Gson().fromJson(response.body().string(),BaseEntity.class);
                        PlanList planList=new Gson().fromJson(baseEntity1.getResp_data(),PlanList.class);
                        String undo="❌未完成的计划:\n";
                        for(int i=0;i<planList.getData().getPList().size();i++){
                            if(planList.getData().getPList().get(i).getDoor().equals("0")){
                                undo+="--------------------\n";
                                undo+="\uD83D\uDCDD计划内容:"+planList.getData().getPList().get(i).getPMessage()+"\n";
                                undo+="⏰截至时间:"+planList.getData().getPList().get(i).getPTime()+"\n";
                            }
                        }
                        undo+="====================\n";
                        String doit="✔️已完成的计划:\n";
                        for(int i=0;i<planList.getData().getPList().size();i++){
                            if(planList.getData().getPList().get(i).getDoor().equals("1")){
                                doit+="--------------------\n";
                                doit+="\uD83D\uDCDD计划内容:"+planList.getData().getPList().get(i).getPMessage()+"\n";
                                doit+="⏰截至时间:"+planList.getData().getPList().get(i).getPTime()+"\n";
                            }
                        }
                        doit+="====================\n";
                        return buildTextResponse(message, "恭喜你!\n"+tokenGetOpenId.getJxid()+"用户\n鱼汤从小新那里get到了你的计划表！\uD83E\uDD24\uD83C\uDF66\n"+undo+doit);
                    } catch (IOException e) {
                        return buildTextResponse(message, "没有找到小新T_T");
                    }
                }else{
                    return buildTextResponse(message, "没有找到小新T_T");
                }
            }
            if("笔记列表".equals(content)){
                String openid= message.get("FromUserName");
                TokenGetOpenId tokenGetOpenId = null;
                BaseEntity baseEntity = null;
                OkHttpClient client = new OkHttpClient().newBuilder()
                        .build();
                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+openid+"\"\r\n}");
                Request request = new Request.Builder()
                        .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=Get_OpenId")
                        .method("POST", body)
                        .build();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    baseEntity = new Gson().fromJson(response.body().string(), BaseEntity.class);
                    System.out.println(baseEntity);
                    tokenGetOpenId=new Gson().fromJson(baseEntity.getResp_data(),TokenGetOpenId.class);
                    System.out.println(tokenGetOpenId);
                    if(tokenGetOpenId.getState()==-1){
                        return buildTextResponse(message, "没有找到小新T_T,请确保已经关联交新校友圈♥");
                    }
                } catch (IOException e) {
                    return buildTextResponse(message, "没有找到小新T_T");
                }
                if(tokenGetOpenId.getState()==1){
                    client = new OkHttpClient().newBuilder()
                            .build();
                    mediaType = MediaType.parse("application/json");
                    body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+tokenGetOpenId.getOpenid()+"\"\r\n}");
                    request = new Request.Builder()
                            .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=getNoteName")
                            .method("POST", body)
                            .build();
                    call = client.newCall(request);
                    try {
                        Response response = call.execute();
//                        System.out.println(response.body().string());
                        BaseEntity baseEntity1=new Gson().fromJson(response.body().string(),BaseEntity.class);
                        System.out.println(baseEntity1.getResp_data());
                        noteName noteName=new Gson().fromJson(baseEntity1.getResp_data(),noteName.class);
                        List<noteTitle> nt =noteName.getData();
                        String word="查询到的笔记目录如下:\n";
                        for(int i=0;i<nt.size();i++){
                            word+=nt.get(i).getNoteTitle()+"\n";
                        }
                        return buildTextResponse(message,word);
                    } catch (IOException e) {
                        return buildTextResponse(message, "没有找到小新T_T");
                    }
                }else{
                    return buildTextResponse(message, "没有找到小新T_T");
                }
            }
            if("查询笔记".equals(content.length()>4?content.substring(0,4):"1")){
                String title=content.substring(4,content.length());
                String openid= message.get("FromUserName");
                TokenGetOpenId tokenGetOpenId = null;
                BaseEntity baseEntity = null;
                OkHttpClient client = new OkHttpClient().newBuilder()
                        .build();
                MediaType mediaType = MediaType.parse("application/json");
                RequestBody body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+openid+"\"\r\n}");
                Request request = new Request.Builder()
                        .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=Get_OpenId")
                        .method("POST", body)
                        .build();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    baseEntity = new Gson().fromJson(response.body().string(), BaseEntity.class);
                    System.out.println(baseEntity);
                    tokenGetOpenId=new Gson().fromJson(baseEntity.getResp_data(),TokenGetOpenId.class);
                    System.out.println(tokenGetOpenId);
                    if(tokenGetOpenId.getState()==-1){
                        return buildTextResponse(message, "没有找到小新T_T,请确保已经关联交新校友圈♥");
                    }
                } catch (IOException e) {
                    return buildTextResponse(message, "没有找到小新T_T");
                }
                if(tokenGetOpenId.getState()==1){
                    client = new OkHttpClient().newBuilder()
                            .build();
                    mediaType = MediaType.parse("application/json");
//                    {\r\n        \"xcx_openid\":\""+tokenGetOpenId.getOpenid()+"\",\r\n        \"openid\":\""+openid+"\"\r\n}
                    body = RequestBody.create(mediaType, "{\r\n       \"openid\":\""+tokenGetOpenId.getOpenid()+"\",\r\n        \"notename\":\""+title+"\"\r\n}");
                    request = new Request.Builder()
                            .url("https://api.weixin.qq.com/tcb/invokecloudfunction?access_token="+access_token+"&env=cloud1-7g48m2a6e2ac093c&name=getNote")
                            .method("POST", body)
                            .build();
                    call = client.newCall(request);
                    try {
                        Response response = call.execute();
                        BaseEntity baseEntity1=new Gson().fromJson(response.body().string(),BaseEntity.class);
                        NoteM noteM=new Gson().fromJson(baseEntity1.getResp_data(),NoteM.class);
                        NoteMessage noteMessage=noteM.getData();
                        String word=noteMessage.getNoteTitle()+'\n';
                        word=word+noteMessage.getNoteTime()+"\n";
                        word=word+noteMessage.getNotemessage();
                        return buildTextResponse(message,word);
//                        String undo="❌未完成的计划:\n";
//                        for(int i=0;i<planList.getData().getPList().size();i++){
//                            if(planList.getData().getPList().get(i).getDoor().equals("0")){
//                                undo+="--------------------\n";
//                                undo+="\uD83D\uDCDD计划内容:"+planList.getData().getPList().get(i).getPMessage()+"\n";
//                                undo+="⏰截至时间:"+planList.getData().getPList().get(i).getPTime()+"\n";
//                            }
//                        }
//                        undo+="====================\n";
//                        String doit="✔️已完成的计划:\n";
//                        for(int i=0;i<planList.getData().getPList().size();i++){
//                            if(planList.getData().getPList().get(i).getDoor().equals("1")){
//                                doit+="--------------------\n";
//                                doit+="\uD83D\uDCDD计划内容:"+planList.getData().getPList().get(i).getPMessage()+"\n";
//                                doit+="⏰截至时间:"+planList.getData().getPList().get(i).getPTime()+"\n";
//                            }
//                        }
//                        doit+="====================\n";
//                        return buildTextResponse(message, "恭喜你!\n"+tokenGetOpenId.getJxid()+"用户\n鱼汤从小新那里get到了你的计划表！\uD83E\uDD24\uD83C\uDF66\n"+undo+doit);
                    } catch (IOException e) {
                        return buildTextResponse(message, "没有找到小新T_T");
                    }
                }else{
                    return buildTextResponse(message, "没有找到小新T_T");
                }
            }
        } else if ("event".equals(msgType)) {
            String event = message.get("Event");
            if ("subscribe".equals(event)) {
                return buildTextResponse(message, "Welcome to our official account!");
            } else {
                return buildTextResponse(message, "Unknown event: " + event);
            }
        } else {
            return buildTextResponse(message, "Unknown message type: " + msgType);
        }
        return buildTextResponse(message, "鱼汤没明白你现在的意思，可能是我还没学习到这个功能\uD83E\uDD7A\uD83E\uDD7A\uD83E\uDD7A\n不妨试着对我说，‘今天的课’或者‘我的计划’，我会从小新那里告诉你。\n（数据来源来自交心校友圈小程序，在获取信息前请到小程序端点击关于我们来获取token值并发送到这里便可进行关联）");
    }
    // 构造文本消息响应
    private String buildTextResponse(Map<String, String> message, String content) {
        String fromUserName = message.get("ToUserName");
        String toUserName = message.get("FromUserName");
        String createTime = String.valueOf(System.currentTimeMillis() / 1000);
        String msgType = "text";
        String xml = "<xml>";
        xml += "<ToUserName><![CDATA[" + toUserName + "]]></ToUserName>";
        xml += "<FromUserName><![CDATA[" + fromUserName + "]]></FromUserName>";
        xml += "<CreateTime>" + createTime + "</CreateTime>";
        xml += "<MsgType><![CDATA[" + msgType + "]]></MsgType>";
        xml += "<Content><![CDATA[" + content + "]]></Content>";
        xml += "</xml>";
        return xml;
    }
}