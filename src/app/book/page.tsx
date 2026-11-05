import { permanentRedirect } from "next/navigation";

/** 书籍介绍已并入首页 /，/book 永久重定向到首页（/book/chapters/* 不受影响） */
export default function BookRedirect() {
  permanentRedirect("/");
}
