package com.ttt.JavaSoup.Entity;

public class Access_Token {
        private String access_token;
        private int expires_in;
        public void setAccess_token(String access_token) {
            this.access_token = access_token;
        }
        public String getAccess_token() {
            return access_token;
        }

        public void setExpires_in(int expires_in) {
            this.expires_in = expires_in;
        }
        public int getExpires_in() {
            return expires_in;
        }

    @Override
    public String toString() {
        return "Access_Token{" +
                "access_token='" + access_token + '\'' +
                ", expires_in=" + expires_in +
                '}';
    }
}
