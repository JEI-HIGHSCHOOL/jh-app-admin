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

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const Notice: NextPage = () => {
  const router = useRouter()
  const [onPushAlert, setOnPushAlert] = useState(false);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState("내용을 입력해주세요");
  const [uploading, setUploading] = useState(false);
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );

  if (userError) return <Login />;
  if (!userData) return <Loading />;
  const uploadPushAlert = () => {
    setUploading(true)
    client('POST', '/push/noticeadd', {
        title,
        description,
        usePush: onPushAlert
    }).then((res) => {
        setUploading(false)
        if(res.error) {
            return Toast(res.message, "error")
        } else {
            router.push('/notices')
            Toast("성공적으로 공지가 등록되었습니다", "success")
        }
    })
  }
  return (
    <Layout>
      <main className="mx-auto flex max-w-4xl flex-col p-5">
        <h2 className="mx-auto">공지등록</h2>
        <span className="mt-5 font-bold mb-1">공지제목</span>
        <Input placeholder="제목" onChangeHandler={setTitle}/>
        <MDEditor
          className="mx-auto mt-5 w-full"
          height={600}
          value={description}
          onChange={setDescription}
        />
        <div className="flex items-center flex-row ml-auto mt-5">
          <div className="form-check mr-2">
            <input
              className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
              type="checkbox"
              checked={onPushAlert}
              onChange={(e) => setOnPushAlert(e.target.checked)}
              id={` flexCheckChecked-PushAlert`}
            />
            <label
              className="form-check-label inline-block text-gray-800 dark:text-white"
              htmlFor={` flexCheckChecked-PushAlert`}
            >
              푸시알림
            </label>
          </div>
          <Button isLoading={uploading} onClick={() => {
            uploadPushAlert()
          }}>등록하기</Button>
        </div>
      </main>
    </Layout>
  );
};

export default Notice;
