import type { NextPage } from "next";
import useSWR from "swr";

import Layout from "@/components/layouts/Layout";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import client, { swrFetcher } from "@/lib/helpers/client";
import { User } from "@/types";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import { Toast } from "@/utils/utils";
import { useRouter } from "next/router";

const Notice: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("제목");
  const [url, setUrl] = useState<string>("");
  const [color, setColor] = useState<string>("#6470F7");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("내용을 입력해주세요");
  const [uploading, setUploading] = useState(false);
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );

  if (userError) return <Login />;
  if (!userData) return <Loading />;
  const uploadBanner = () => {
    setUploading(true);
    client("POST", "/banners", {
      title,
      description,
      color,
      url,
      icon
    }).then(res => {
      setUploading(false);
      if (res.error) {
        return Toast(res.message, "error");
      } else {
        router.push("/banners");
        Toast("성공적으로 배너가 등록되었습니다", "success");
      }
    });
  };
  return (
    <Layout>
      <main className="mx-auto flex max-w-4xl flex-col p-5">
        <h2 className="mx-auto">배너등록</h2>
        <div className="mt-12 flex flex-col md:flex-row">
          <div className="mr-2 w-[1/2] w-full">
            <div className="w-full">
              <h4 className="mb-1">제목</h4>
              <Input onChangeHandler={setTitle} placeholder={"제목"} />
            </div>
            <div className="mt-2 w-full">
              <h4 className="mb-1">설명</h4>
              <Input onChangeHandler={setDescription} placeholder={"설명"} />
            </div>
            <div className="mt-2 w-full">
              <h4 className="mb-1">링크</h4>
              <Input onChangeHandler={setUrl} placeholder={"클릭시 이동될 링크"} />
            </div>
            <div className="mt-2 w-full">
              <h4 className="mb-1">아이콘</h4>
              <Input onChangeHandler={setIcon} placeholder={"아이콘"} />
              <span>
                아이콘 목록은{" "}
                <a
                  className="font-bold text-blue-600"
                  rel="noreferrer"
                  href="https://materialdesignicons.com/"
                  target={"_blank"}
                >
                  여기
                </a>
                에서 확인 가능합니다
              </span>
            </div>
            <div className="mt-2 flex w-full flex-row items-center justify-between">
              <h4 className="mb-1">배경 색</h4>
              <input
                className="rounded"
                type={"color"}
                onChange={e => setColor(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 flex w-[1/2] w-full flex-col items-center justify-center rounded-lg border p-2 md:mt-0">
            <h3 className="mb-1">미리보기</h3>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                width: "90%",
                height: 110,
                borderRadius: 15,
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: color,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 17,
                  marginTop: 18,
                  fontWeight: "900",
                  marginLeft: 17,
                }}
              >
                {title}
              </span>
              <span
                style={{
                  color: "white",
                  fontSize: 15,
                  marginTop: 2,
                  fontWeight: "500",
                  marginLeft: 17,
                }}
              >
                {description}
              </span>
              <i
                className={`fas mt-auto ml-auto mb-3 mr-4 text-xl text-white fa-${icon}`}
              ></i>
            </div>
          </div>
        </div>
        <Button onClick={() => {uploadBanner()}} className="flex items-center justify-center mt-5" variant="primary">등록하기</Button>
      </main>
    </Layout>
  );
};

export default Notice;
