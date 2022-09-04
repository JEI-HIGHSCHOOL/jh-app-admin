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
  const router = useRouter()
  const [password, setPassword] = useState<string>();
  const [changePassword, setChangePassword] = useState<string>()
  const [changePasswordCheck, setChangePasswordCheck] = useState<string>()
  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>()
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  if (userError) return <Login />;
  if (!userData) return <Loading />;
  if(!checkUserFlag(userData.flags, "teacher")) {
    Toast("접근 권한이 없습니다", "error")
    return <Login />
  } 
  const changePasswordHanler = () => {
    if(changePasswordCheck !== changePassword) return Toast("비밀번호가 일치하지 않습니다", "error")
    setChangePasswordLoading(true)
    client("POST", "/users/changepassword", {
      password,
      changePassword
    }).then((res) => {
      setChangePasswordLoading(false)
      if(res.error) {
        return Toast(res.message, "error")
      }
      Toast("비밀번호가 변경되었습니다", "success")
      client("POST", "/auth/logout").then((res) => {
        router.push('/login')
      })
    })
  }
  return (
    <Layout>
      <main className="flex flex-col p-5">
        <h1 className="text-3xl font-bold">
          어서오세요, {userData.name}{" "}
          {checkUserFlag(userData.flags, "teacher") && "선생"}님
        </h1>
        <span className="mt-5 text-xl font-bold">
          회원정보
        </span>
        <div className="mt-1 flex flex-row text-lg items-center max-w-sm w-full justify-between">
          <span className="mr-5"><i className="fa fa-user mr-2" />아이디</span>
          <span>{userData.id.substring(userData.id.length / 2, 0).padStart(userData.id.length / 2).padEnd(userData.id.length, "*")}</span>
        </div>
        <div className="mt-2 flex flex-col text-lg">
          <span><i className="fa fa-lock mr-2" />비밀번호</span>
          <div className="flex flex-col mt-2 lg:items-center items-start justify-between max-w-sm lg:flex-row">
            <span>기존 비밀번호</span>
            <Input className="lg:w-fit w-full" placeholder="기존 비밀번호" type={"password"} onChangeHandler={setPassword}/>
          </div>
          <div className="flex flex-col mt-2 lg:items-center items-start justify-between max-w-sm lg:flex-row">
            <span>변경할 비밀번호</span>
            <Input className="lg:w-fit w-full" placeholder="변경할 비밀번호" type={"password"} onChangeHandler={setChangePassword}/>
          </div>
          <div className="flex flex-col mt-2 lg:items-center items-start justify-between max-w-sm lg:flex-row">
            <span>비밀번호 확인</span>
            <Input className="lg:w-fit w-full" placeholder="변경할 비밀번호 확인" type={"password"} onChangeHandler={setChangePasswordCheck}/>
          </div>
          <div className="flex items-end justify-end mt-2 w-full max-w-sm">
            <Button isLoading={changePasswordLoading} onClick={() => changePasswordHanler()} variant="outline" className="h-10 text-lg">비밀번호 변경</Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
