package com.ttt.JavaSoup.Entity;

import java.util.List;

public class PlanList {
    private PlanData data;
    private int State;

    public void setData(PlanData data) {
        this.data = data;
    }

    public PlanData getData() {
        return data;
    }

    public void setState(int State) {
        this.State = State;
    }

    public int getState() {
        return State;
    }
}
