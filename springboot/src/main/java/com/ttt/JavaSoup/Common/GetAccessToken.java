package com.ttt.JavaSoup.Common;

import com.google.gson.Gson;
import com.ttt.JavaSoup.Entity.Access_Token;
import com.ttt.JavaSoup.Entity.BaseEntity;
import com.ttt.JavaSoup.Entity.TokenGetOpenId;
import okhttp3.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GetAccessToken {
    private static String grant_type="xxxxxxxxxxx";
    private static String appid="xxxxxxxxxx";
    private static String secret="xxxxxxxxxxxxxxxxxxxxxxx";
    private final static GetAccessToken INSTANCE=new GetAccessToken();
    private static String AccessToken;
    private GetAccessToken(){}
    public static GetAccessToken getInstance(){
        return INSTANCE;
    }
    @Scheduled(fixedRate = 1000*3600)
    public void GetToken() {
        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();
        Request request = new Request.Builder()
                .url("https://api.weixin.qq.com/cgi-bin/token?grant_type="+grant_type+"&appid="+appid+"&secret="+secret)
                .get()
                .build();
        Call call = client.newCall(request);
        try {
            Response response = call.execute();
            Access_Token access_token = new Gson().fromJson(response.body().string(), Access_Token.class);
            this.AccessToken=access_token.getAccess_token();
            System.out.println(this.AccessToken);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    public String getAccessToken() {
        return AccessToken;
    }
}
