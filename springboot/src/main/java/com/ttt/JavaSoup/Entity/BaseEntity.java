package com.ttt.JavaSoup.Entity;

public class BaseEntity {
    private int errcode;
    private String errmsg;
    private String resp_data;

    public int getErrcode() {
        return errcode;
    }

    public void setErrcode(int errcode) {
        this.errcode = errcode;
    }

    public String getErrmsg() {
        return errmsg;
    }

    public void setErrmsg(String errmsg) {
        this.errmsg = errmsg;
    }

    public String getResp_data() {
        return resp_data;
    }

    public void setResp_data(String resp_data) {
        this.resp_data = resp_data;
    }

    @Override
    public String toString() {
        return "BaseEntity{" +
                "errcode=" + errcode +
                ", errmsg='" + errmsg + '\'' +
                ", resp_data='" + resp_data + '\'' +
                '}';
    }
}
