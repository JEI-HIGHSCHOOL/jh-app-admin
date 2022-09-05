import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import Layout from "@/components/layouts/Layout";
import ArrowLink from "@/components/links/ArrowLink";
import Loading from "@/components/Loading";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Notice, User } from "@/types";
import { Toast } from "@/utils/utils";
import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiAlarmWarningLine } from "react-icons/ri";
import useSWR from "swr";
import Login from "../login";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const NoticeManage: NextPage<{ noticeId: string }> = ({ noticeId }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState("내용을 입력해주세요");
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: noticesData, error: noticesError } = useSWR<Notice>(
    `/push/notice/${noticeId}`,
    swrFetcher
  );

  useEffect(() => {
    if (noticesData) {
      setTitle(noticesData.title);
      setDescription(noticesData.content);
    }
  }, [noticesData]);

  if (userError) return <Login />;
  if (noticesError && noticesError.message)
    return (
      <main className="bg-white">
        <section className="layout-container flex min-h-screen flex-col items-center justify-center text-center">
          <RiAlarmWarningLine
            size={44}
            className="animate-ping text-red-500 drop-shadow-lg"
          />
          <h1 className="my-8 text-black">{noticesError.message}</h1>
          <ArrowLink href="/" className="text-black" direction="left">
            메인 페이지로
          </ArrowLink>
        </section>
      </main>
    );
  if (!userData || !noticesData) return <Loading />;
  if (userData.id !== noticesData.publisher.id)
    return (
      <main className="bg-white">
        <section className="layout-container flex min-h-screen flex-col items-center justify-center text-center">
          <RiAlarmWarningLine
            size={44}
            className="animate-ping text-red-500 drop-shadow-lg"
          />
          <h1 className="my-8 text-black">자신의 글만 수정가능합니다</h1>
          <ArrowLink href="/" className="text-black" direction="left">
            메인 페이지로
          </ArrowLink>
        </section>
      </main>
    );
  const editNotice = () => {
    setUploading(true);
    client("PATCH", `/push/notice/${noticeId}`, {
      title,
      description,
    }).then(res => {
      setUploading(false);
      if (res.error) {
        return Toast(res.message, "error");
      }
      Toast("성공적으로 공지가 수정되었습니다", "success");
      router.push("/notices");
    });
  };

  const deleteNotice = () => {
    setUploading(true);
    client("DELETE", `/push/notice/${noticeId}`).then(res => {
      setUploading(false);
      if (res.error) {
        return Toast(res.message, "error");
      }
      Toast("성공적으로 공지가 삭제되었습니다", "success");
      router.push("/notices");
    });
  };
  return (
    <>
      <Layout>
        <main className="mx-auto flex max-w-4xl flex-col p-5">
          <h2 className="mx-auto">공지수정</h2>
          <span className="mt-5 mb-1 font-bold">공지제목</span>
          <Input
            placeholder="제목"
            defaultValue={title}
            onChangeHandler={setTitle}
          />
          <MDEditor
            className="mx-auto mt-5 w-full"
            height={600}
            value={description}
            onChange={setDescription}
          />
          <div className="ml-auto mt-5 flex flex-row items-center">
            <Button
              isLoading={uploading}
              variant="ghost"
              onClick={() => {
                deleteNotice();
              }}
              className="mr-3"
            >
              삭제하기
            </Button>
            <Button
              isLoading={uploading}
              onClick={() => {
                editNotice();
              }}
            >
              수정하기
            </Button>
          </div>
        </main>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      noticeId: ctx.params?.id,
    },
  };
};

export default NoticeManage;
