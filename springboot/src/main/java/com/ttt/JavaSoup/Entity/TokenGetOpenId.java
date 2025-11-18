package com.ttt.JavaSoup.Entity;

public class TokenGetOpenId {
    String openid;
    String jxid;
    int State;

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public int getState() {
        return State;
    }

    public void setState(int state) {
        State = state;
    }

    public String getJxid() {
        return jxid;
    }

    public void setJxid(String jxid) {
        this.jxid = jxid;
    }

    @Override
    public String toString() {
        return "TokenGetOpenId{" +
                "openid='" + openid + '\'' +
                ", jxid='" + jxid + '\'' +
                ", State=" + State +
                '}';
    }
}