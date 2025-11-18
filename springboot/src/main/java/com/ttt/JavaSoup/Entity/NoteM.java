package com.ttt.JavaSoup.Entity;

public class NoteM {
    private NoteMessage data;

    private int State;

    public void setData(NoteMessage data){
        this.data = data;
    }
    public NoteMessage getData(){
        return this.data;
    }
    public void setState(int State){
        this.State = State;
    }
    public int getState(){
        return this.State;
    }
}
