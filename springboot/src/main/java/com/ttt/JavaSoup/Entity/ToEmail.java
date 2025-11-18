package com.ttt.JavaSoup.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToEmail implements Serializable {

  /**
   * 邮件接收方，可多人
   */
  private String[] tos;
  /**
   * 邮件主题
   */
  private String subject;
  /**
   * 邮件内容
   */
  private String content;

  public String[] getTos() {
    return tos;
  }

  public void setTos(String[] tos) {
    this.tos = tos;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
}
