package com.ttt.JavaSoup.Entity;

import java.util.Date;

public class Plan {
    private int overTime;
    private String pMessage;
    private String pTime;
    private String uuid;
    private String door;

    public void setOverTime(int overTime) {
        this.overTime = overTime;
    }

    public int getOverTime() {
        return overTime;
    }

    public void setPMessage(String pMessage) {
        this.pMessage = pMessage;
    }

    public String getPMessage() {
        return pMessage;
    }

    public void setPTime(String pTime) {
        this.pTime = pTime;
    }

    public String getPTime() {
        return pTime;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setDoor(String door) {
        this.door = door;
    }

    public String getDoor() {
        return door;
    }

    @Override
    public String toString() {
        return "Plan{" +
                "overTime=" + overTime +
                ", pMessage='" + pMessage + '\'' +
                ", pTime=" + pTime +
                ", uuid='" + uuid + '\'' +
                ", door='" + door + '\'' +
                '}';
    }
}