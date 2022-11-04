import type { NextPage } from "next";
import useSWR from "swr";

import Layout from "@/components/layouts/Layout";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Banner, User } from "@/types";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import Input from "@/components/Input";
import { Toast } from "@/utils/utils";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import clsx from "clsx";
type NoticeSearchType = "name" | "content";
const PER_PAGE = 20;
const Notice: NextPage = () => {
  const router = useRouter();
  const [noticeSearch, setNoticeSearch] = useState("");
  const [page, setPage] = useState(0);
  const [noticeSearchType, setNoticeSearchType] =
    useState<NoticeSearchType>("name");
  const [uploading, setUploading] = useState(false);
  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const {
    data: bannersData,
    error: bannersError,
    mutate: reloadBanners,
  } = useSWR<Banner[]>("/banners/admin", swrFetcher);

  if (userError) return <Login />;
  if (!userData || !bannersData) return <Loading />;
  const filterNotices = (search?: string) => {
    return bannersData
      ?.filter((one) => {
        if (!search) return true;
        let searchLowercase = search.normalize().toLowerCase();

        switch (noticeSearchType) {
          case "name":
            return one.title
              ?.normalize()
              .toLowerCase()
              .includes(searchLowercase);
          case "content":
            return one.description.includes(search);
          default:
            return true;
        }
      })
      .sort((a, b) => {
        let aDname = a.published_date!;
        let bDname = b.published_date!;
        if (aDname > bDname) return -1;
        else if (aDname < bDname) return 1;
        return 0;
      });
  };
  const filteredNotices = filterNotices(noticeSearch) || bannersData;
  const slicedNotices = filteredNotices?.slice(
    page * PER_PAGE,
    (page + 1) * PER_PAGE
  );
  const handelPageCallback = (pages: number) => {
    setPage(pages);
  };

  const PageBar = (
    <div className="flex justify-center">
      <Pagination
        totalItems={filteredNotices?.length}
        pageCallback={handelPageCallback}
        perPage={PER_PAGE}
      />
    </div>
  );
  const handleNoticesSearchTypeOnChange = (searchType: NoticeSearchType) => {
    setNoticeSearchType(searchType);
    setNoticeSearch("");
  };
  const disableBanner = (id: string) => {
    setUploading(true);
    client("POST", `/banners/${id}/disable`).then((res) => {
      setUploading(false);
      if (res.error) {
        return Toast(res.message, "error");
      }
      Toast("배너가 비활성화 되었습니다", "success");
      reloadBanners();
    });
  };
  const enableBanner = (id: string) => {
    setUploading(true);
    client("POST", `/banners/${id}/enable`).then((res) => {
      setUploading(false);
      if (res.error) {
        return Toast(res.message, "error");
      }
      Toast("배너가 활성화 되었습니다", "success");
      reloadBanners();
    });
  };
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center p-5">
        <h2>배너 관리</h2>
        <div className="mt-2 flex w-full max-w-4xl flex-row items-center justify-between">
          <div className="flex space-x-2">
            <span>검색 방식</span>
            <div className="form-check">
              <input
                className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                type="checkbox"
                checked={noticeSearchType === "name"}
                onChange={(e) => handleNoticesSearchTypeOnChange("name")}
                id={` flexCheckChecked-name`}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-white"
                htmlFor={` flexCheckChecked-name`}
              >
                제목
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                type="checkbox"
                checked={noticeSearchType === "content"}
                onChange={(e) => handleNoticesSearchTypeOnChange("content")}
                id={` flexCheckChecked-content`}
              />
              <label
                className="form-check-label inline-block text-gray-800 dark:text-white"
                htmlFor={` flexCheckChecked-content`}
              >
                내용
              </label>
            </div>
          </div>
          <Input
            className="w-48"
            placeholder={"검색어"}
            onChangeHandler={setNoticeSearch}
          />
        </div>
        <div className="mt-5 flex w-full flex-col items-center justify-center space-y-2">
          {slicedNotices.map((notice, index) => (
            <>
              <div
                key={index}
                className="flex w-full max-w-4xl items-center justify-between rounded-lg bg-gray-100 px-3 py-2"
              >
                <div className="flex flex-row items-center space-x-2">
                  <div className="flex flex-col">
                    <span>{notice.title}</span>
                    <div className="flex flex-row items-center">
                      <span className="mr-2">{notice.description}</span>
                      <span className="text-sm">
                        {dayjs(notice.published_date)
                          .locale("ko")
                          .format("YYYY-MM-DD A HH:mm:ss")}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <select
                    className={clsx(
                      "inline-flex items-center rounded px-3 py-2 font-medium",
                      "focus:outline-none focus:ring-0 focus-visible:border-2 focus-visible:border-orange-500",
                      "shadow-sm w-24",
                      "transition-colors duration-75",
                      "border border-gray-300 bg-white"
                    )}
                    value={notice.show ? "show" : "hide"}
                    onChange={(e) => {
                      if (e.target.value === "show") {
                        enableBanner(notice._id);
                      } else {
                        disableBanner(notice._id);
                      }
                    }}
                  >
                    <option value="show">표시</option>
                    <option value="hide">미표시</option>
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

export default Notice;
