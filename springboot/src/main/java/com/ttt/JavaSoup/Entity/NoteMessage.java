package com.ttt.JavaSoup.Entity;

public class NoteMessage {
    private String noteTitle;

    private String notemessage;

    private String noteTime;

    public void setNoteTitle(String noteTitle){
        this.noteTitle = noteTitle;
    }
    public String getNoteTitle(){
        return this.noteTitle;
    }
    public void setNotemessage(String notemessage){
        this.notemessage = notemessage;
    }
    public String getNotemessage(){
        return this.notemessage;
    }
    public void setNoteTime(String noteTime){
        this.noteTime = noteTime;
    }
    public String getNoteTime(){
        return this.noteTime;
    }
}
