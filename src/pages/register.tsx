import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import Layout from "@/components/layouts/Layout";
import client from "@/lib/helpers/client";
import Link from "next/link";
import { Toast } from "@/utils/utils";

const Login: NextPage = () => {
  const [id, setId] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordCheck, setPasswordCheck] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const Register = () => {
    if (passwordCheck !== password)
      return Toast("비밀번호가 일치하지 않습니다", "error");
    setLoading(true);
    client("POST", "/auth/signup", {
      password,
      id,
      name
    }).then((res) => {
      setLoading(false);
      if (res.error) {
        return setError(res.message);
      }
      router.push("/");
    });
  };
  return (
    <main className="flex h-full min-h-[100vh] flex-col items-center justify-center">
      <h2>회원가입</h2>
      <div
        className="mt-12"
        onKeyPress={(key) => {
          if (key.key === "Enter") return Register();
        }}
      >
        <div className="mt-5 flex flex-col items-start">
          <h4 className="mb-1">이름</h4>
          <Input
            className="w-64"
            placeholder={"이름"}
            onChangeHandler={setName}
          />
        </div>
        <div className="mt-5 flex flex-col items-start">
          <h4 className="mb-1">아이디</h4>
          <Input
            className="w-64"
            placeholder={"아이디"}
            onChangeHandler={setId}
            type="id"
          />
        </div>
        <div className="mt-5 flex flex-col items-start">
          <h4 className="mb-1">비밀번호</h4>
          <Input
            className="w-64"
            placeholder={"비밀번호"}
            onChangeHandler={setPassword}
            type="password"
          />
        </div>
        <div className="mt-5 flex flex-col items-start">
          <h4 className="mb-1">비밀번호 확인</h4>
          <Input
            className="w-64"
            placeholder={"비밀번호 확인"}
            onChangeHandler={setPasswordCheck}
            type="password"
          />
        </div>
        <Button
          onClick={() => Register()}
          isLoading={loading}
          variant="primary"
          className="mt-12 flex w-64 items-center justify-center"
        >
          회원가입
        </Button>
        <Link href={"/login"}>
          <a className="mt-1 flex items-center justify-center">
            이미 가입한적이 있나요?{" "}
            <span className="ml-1 text-blue-400">로그인</span>
          </a>
        </Link>
        {error && (
          <>
            <div className="mt-5 flex w-64 flex-row items-center rounded bg-red-500 px-4 py-1 text-white min-h-10">
              <i className="fas fa-exclamation-triangle mr-2" />
              <span>{error}</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Login;
