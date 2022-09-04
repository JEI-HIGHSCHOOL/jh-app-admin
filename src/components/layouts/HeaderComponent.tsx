import { swrFetcher } from "@/lib/helpers/client";
import { User } from "@/types";
import clsx from "clsx";
import Image from "next/image"
import React from "react";
import useSWR from "swr";
import Loading from "../Loading";
import Login from "../Login";


const HeaderComponent = () => {
  const {data: userData, error: userError} = useSWR<User>('/auth/me', swrFetcher)
  if(userError) return <Login/>
  if(!userData) return <Loading/>
  return (
    <header className="fixed top-0 z-50 w-full bg-white p-0.5 opacity-100 border-b">
      <div
        className={clsx(
          "flex items-center md:justify-between justify-center",
          "mx-auto h-14 max-w-[80vw] px-2"
        )}
      >
        <Image src={"/page_logo.png"} width="230" height="45" alt="logo"/>
        <span className="text-lg font-bold hidden md:block">{userData.name}님</span>
      </div>
    </header>
  );
};

export default HeaderComponent;
