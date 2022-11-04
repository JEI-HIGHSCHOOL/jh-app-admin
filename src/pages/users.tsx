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
import Pagination from "@/components/Pagination";
import clsx from "clsx";
type MemberSearchType = "name" | "id";

const Users: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [memberSearchType, setMemberSearchType] =
    useState<MemberSearchType>("id");
  const [memberSearch, setMemberSearch] = useState("");
  const PER_PAGE = 20;

  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: usersData, error: usersError, mutate: updateUsers } = useSWR<User[]>(
    "/users",
    swrFetcher
  );
  if (userError) return <Login />;

  if (!userData || !usersData) return <Loading />;
  const filterMembers = (search?: string) => {
    return usersData
      ?.filter((one) => {
        if (!search) return true;
        let searchLowercase = search.normalize().toLowerCase();

        switch (memberSearchType) {
          case "name":
            return one.name
              ?.normalize()
              .toLowerCase()
              .includes(searchLowercase);
          case "id":
            return one.id.startsWith(search);
          default:
            return true;
        }
      })
      .sort((a, b) => {
        let aDname = a.name!;
        let bDname = b.name!;
        if (aDname > bDname) return 1;
        else if (aDname < bDname) return -1;
        return 0;
      });
  };
  const filteredMembers = filterMembers(memberSearch) || usersData;
  const slicedMembers = filteredMembers?.slice(
    page * PER_PAGE,
    (page + 1) * PER_PAGE
  );
  const handelPageCallback = (pages: number) => {
    setPage(pages);
  };

  const PageBar = (
    <div className="flex justify-center">
      <Pagination
        totalItems={filteredMembers?.length}
        pageCallback={handelPageCallback}
        perPage={PER_PAGE}
      />
    </div>
  );
  const handleMemberSearchTypeOnChange = (searchType: MemberSearchType) => {
    setMemberSearchType(searchType);
    setMemberSearch("");
  };

  const userRoleHanler = (user: User, role: string) => {
    client("POST", `/users/${user._id}/role`, {
      role: role,
    }).then((res) => {
      if (res.error) {
        return Toast(res.message, "error");
      }
      Toast(
        `${user.name}(${user.id})님의 권한이 업데이트 되었습니다`,
        "success"
      );
      updateUsers()
    });
  };
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center p-5">
        <h2>유저 관리</h2>
        <div className="mt-2 flex w-full max-w-4xl flex-row items-center justify-between">
          <div className="flex space-x-2">
            <span>검색 방식</span>
            <div className="form-check">
              <input
                className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                type="checkbox"
                checked={memberSearchType === "id"}
                onChange={(e) => handleMemberSearchTypeOnChange("id")}
                id={` flexCheckChecked-id`}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-white"
                htmlFor={` flexCheckChecked-id`}
              >
                아이디
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                type="checkbox"
                checked={memberSearchType === "name"}
                onChange={(e) => handleMemberSearchTypeOnChange("name")}
                id={` flexCheckChecked-name`}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-white"
                htmlFor={` flexCheckChecked-name`}
              >
                이름
              </label>
            </div>
          </div>
          <Input
            className="w-48"
            placeholder={"검색어"}
            onChangeHandler={setMemberSearch}
          />
        </div>
        <div className="mt-5 flex w-full flex-col items-center justify-center space-y-2">
          {slicedMembers.map((user, index) => (
            <>
              <div
                key={index}
                className="flex w-full max-w-4xl items-center justify-between rounded-lg bg-gray-100 px-3 py-2"
              >
                <div className="flex flex-row space-x-2">
                  <span>
                    {checkUserFlag(user.flags, "admin")
                      ? "관리자"
                      : checkUserFlag(user.flags, "teacher") && "선생님"}{" "}
                    {user.name}
                  </span>
                  <span>
                    {user.id
                      .substring(user.id.length / 2, 0)
                      .padStart(user.id.length / 2)
                      .padEnd(user.id.length, "*")}
                  </span>
                </div>
                <div>
                <select
                    className={clsx(
                      "inline-flex items-center rounded px-3 py-2 font-medium",
                      "focus:outline-none focus:ring-0 focus-visible:border-2 focus-visible:border-orange-500",
                      "shadow-sm w-48",
                      "transition-colors duration-75",
                      "border border-gray-300 bg-white"
                    )}
                    defaultValue={"default"}
                    onChange={(e) => {
                      if(e.target.value === "default") return
                      userRoleHanler(user, e.target.value);
                    }}
                  >
                    <option value="default">권한</option>
                    <option value="busdriver">버스기사 권한</option>
                    <option value="teacher">선생님 권한</option>
                    <option value="admin">관리자 권한</option>
                  </select>
                </div>
              </div>
            </>
          ))}
        </div>
        {PageBar}
      </main>
    </Layout>
  );
};

export default Users;
