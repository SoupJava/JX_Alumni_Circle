package com.ttt.JavaSoup.Entity;

import java.util.List;

public class ClassTableData {
    private List<List<String>> course_time;
    private List<WList> wList;
    private int State;

    public void setCourse_time(List<List<String>> course_time) {
        this.course_time = course_time;
    }

    public List<List<String>> getCourse_time() {
        return course_time;
    }

    public void setWList(List<WList> wList) {
        this.wList = wList;
    }

    public List<WList> getWList() {
        return wList;
    }

    public void setState(int State) {
        this.State = State;
    }

    public int getState() {
        return State;
    }
}
