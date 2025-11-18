package com.ttt.JavaSoup.Entity;

import java.util.List;

public class noteName {
    private List<noteTitle> data;

    private int State;

    public void setData(List<noteTitle> data){
        this.data = data;
    }
    public List<noteTitle> getData(){
        return this.data;
    }
    public void setState(int State){
        this.State = State;
    }
    public int getState(){
        return this.State;
    }
}
