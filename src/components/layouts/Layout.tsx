import React from "react";

import HeaderComponent from "@/components/layouts/HeaderComponent";
import SideBar from "../SideBar";
import useSWR from "swr";
import { User } from "@/types";
import { swrFetcher } from "@/lib/helpers/client";
import Login from "../Login";
import Loading from "../Loading";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  if (userError) return <Login />;
  if (!userData) return <Loading />;
  return (
    <>
      <HeaderComponent />
      <SideBar user={userData} />
      <section
        className={`z-0 min-h-[100vh] py-[58px] lg:pl-[300px]`}
      >
        {children}
      </section>
    </>
  );
};

export default Layout;
