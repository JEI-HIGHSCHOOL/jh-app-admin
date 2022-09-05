import type { NextPage } from "next";
import useSWR from "swr";

import Layout from "@/components/layouts/Layout";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import client, { swrFetcher } from "@/lib/helpers/client";
import { User } from "@/types";
import { checkUserFlag, Toast } from "@/utils/utils";
import Input from "@/components/Input";
import Button from "@/components/buttons/Button";
import { useState } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: analyticsData, error: analyticsError } = useSWR<{
    device: number,
    banner: number,
    notice: number
  }>(
    "/web/analytics",
    swrFetcher
  );
  if (userError) return <Login />;
  if (!userData||!analyticsData) return <Loading />;
  if (!checkUserFlag(userData.flags, "teacher")) {
    Toast("접근 권한이 없습니다", "error");
    return <Login />;
  }

  return (
    <Layout>
      <main className="flex flex-col p-5">
        <h1 className="text-3xl font-bold">
          어서오세요, {userData.name}{" "}
          {checkUserFlag(userData.flags, "teacher") && "선생"}님
        </h1>
        <div className="mt-5 flex flex-row flex-wrap">
          <div className="max-w-80 mr-1.5 ml-1.5 mb-5 h-44 max-h-44 w-80 rounded-md border bg-white">
            <div className="flex h-[7.5rem] items-center justify-between px-5">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-emerald-600">
                  {analyticsData.device}
                  <span>개</span>
                </div>
                <span className="text-xl text-gray-500">
                  등록된 디바이스
                </span>
              </div>
              <div>
                <i className="fas fa-mobile-alt text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                
              }}
              className="flex h-14 cursor-pointer items-center justify-between rounded-b-md border-b bg-gradient-to-r from-emerald-600 to-emerald-400 px-5 text-white"
            >
              <span className="text-lg font-bold">
                디바이스 관리 (개발중)
              </span>
              <i className="fas fa-hammer" />
            </div>
          </div>
          <div className="max-w-80 mr-1.5 ml-1.5 mb-5 h-44 max-h-44 w-80 rounded-md border bg-white">
            <div className="flex h-[7.5rem] items-center justify-between px-5">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-emerald-600">
                {analyticsData.notice}
                  <span>개</span>
                </div>
                <span className="text-xl text-gray-500">
                  등록된 공지
                </span>
              </div>
              <div>
                <i className="far fa-sticky-note text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                router.push('/notices')
              }}
              className="cursor-pointer h-14 bg-gradient-to-r from-sky-600 to-sky-400 rounded-b-md flex items-center text-white justify-between px-5 border-b"
            >
              <span className="text-lg font-bold">
                공지관리
              </span>
              <i className="fas fa-hammer" />
            </div>
          </div>
          <div className="max-w-80 mr-1.5 ml-1.5 mb-5 h-44 max-h-44 w-80 rounded-md border bg-white">
            <div className="flex h-[7.5rem] items-center justify-between px-5">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-emerald-600">
                {analyticsData.banner}
                  <span>개</span>
                </div>
                <span className="text-xl text-gray-500">
                  표시중인 배너
                </span>
              </div>
              <div>
                <i className="fas fa-bell text-4xl" />
              </div>
            </div>
            <div
              onClick={() => {
                router.push('/banners')
              }}
              className="cursor-pointer h-14 bg-gradient-to-r from-purple-600 to-purple-400 rounded-b-md flex items-center text-white justify-between px-5 border-b"
            >
              <span className="text-lg font-bold">
                배너관리
              </span>
              <i className="fas fa-hammer" />
            </div>
          </div>
        </div>
        <span className="mt-5 text-xl font-bold px-2">회원정보</span>
        <div className="mt-1 flex w-full max-w-sm flex-row items-center justify-between text-lg px-2">
          <span className="mr-5">
            <i className="fa fa-user mr-2" />
            아이디
          </span>
          <span>
            {userData.id
              .substring(userData.id.length / 2, 0)
              .padStart(userData.id.length / 2)
              .padEnd(userData.id.length, "*")}
          </span>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
