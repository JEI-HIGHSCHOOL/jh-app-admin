import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import Layout from "@/components/layouts/Layout";
import client from "@/lib/helpers/client";
import Link from "next/link";

const Login: NextPage = () => {
  const [id, setId] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const Login = () => {
    setLoading(true);
    client("POST", "/auth/login", {
      password,
      id,
    }).then((res) => {
      setLoading(false);
      if (res.error) {
        return setError(res.message);
      }
      window.location.href = "/"
    });
  };
  return (
    <main className="flex h-full min-h-[100vh] flex-col items-center justify-center">
      <h2>로그인</h2>
      <div
        className="mt-12"
        onKeyPress={(key) => {
          if (key.key === "Enter") return Login();
        }}
      >
        <div className="flex flex-col items-start">
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
        <Button
          onClick={() => Login()}
          isLoading={loading}
          variant="primary"
          className="mt-12 flex w-64 items-center justify-center"
        >
          로그인
        </Button>
        <Link href={"/register"}>
          <a className="mt-1 flex items-center justify-center">
            회원이 아니신가요? <span className="text-blue-400 ml-1">회원가입</span>
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
