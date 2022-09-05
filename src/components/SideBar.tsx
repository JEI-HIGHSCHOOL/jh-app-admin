import { User } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { SideBarItems } from "../utils/Constants";

import { checkUserFlag } from "@/utils/utils";
interface SideBarProps {
  user: User;
}
const SideBar: React.FC<SideBarProps> = ({ user }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [openManage, setOpenMange] = useState(true);
  const [openAlert, setOpenAlert] = useState(true);
  return (
    <>
      <aside
        className={`fixed left-0 z-[5] h-full w-full overflow-y-auto border-r bg-white p-5 lg:visible lg:w-[300px] lg:min-w-[300px] lg:transform-none ${
          isOpen ? "scale-x-100" : "scale-x-0"
        }`}
        style={{
          marginTop: "58px",
          fontFamily: "Noto Sans KR",
          transition: "transform 0.3s",
          transformOrigin: "left",
        }}
      >
        <ul className="mt-3 space-y-1">
          {SideBarItems.filter((item) => {
            return item.category === "none";
          }).map((item, index) => (
            <>
              <Link key={item.path} href={`/${item.path}`}>
                <a
                  key={index}
                  className={`${
                    item.path === router.pathname ? "bg-gray-100" : ""
                  } flex h-[45px] min-h-[45px] w-full flex-row items-center justify-between rounded-xl px-5 py-1.5`}
                >
                  <div
                    className={`flex items-center ${
                      item.path === router.pathname
                        ? "opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      transition: "all 0.3s",
                    }}
                  >
                    <i
                      className={
                        item.icon +
                        " m-auto mr-3 flex h-5 w-5 items-center justify-center text-lg"
                      }
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </a>
              </Link>
            </>
          ))}
          {checkUserFlag(user.flags, "admin") && (
            <div>
              <button
                className="my-2 flex w-full items-center justify-between px-3"
                onClick={() => {
                  if (openManage) setOpenMange(false);
                  else setOpenMange(true);
                }}
              >
                <span className="text-sm font-bold ">관리</span>
                <i
                  className={`fas fa-caret-up ${
                    openManage ? "rotate-180" : ""
                  }`}
                  style={{
                    transition: "all 0.3s",
                  }}
                />
              </button>
              <div
                className="space-y-1"
                style={{
                  transition: "all 0.3s",
                  transform: openManage ? "scaleY(1)" : "scaleY(0)",
                  height: openManage ? "100%" : "0px",
                  transformOrigin: "top",
                }}
              >
                {SideBarItems.filter((item) => {
                  return item.category === "manage";
                }).map((item, index) => (
                  <>
                    <Link key={item.path} href={`/${item.path}`}>
                      <a
                        key={index}
                        className={`${
                          router.asPath === item.path ? "bg-gray-100" : ""
                        } flex h-[45px] min-h-[45px] w-full flex-row items-center justify-between rounded-xl px-5 py-1.5`}
                      >
                        <div
                          className={`flex items-center ${
                            router.asPath === item.path
                              ? "opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
                          style={{
                            transition: "all 0.3s",
                          }}
                        >
                          <i
                            className={
                              item.icon +
                              " m-auto mr-3 flex h-5 w-5 items-center justify-center text-lg"
                            }
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      </a>
                    </Link>
                  </>
                ))}
              </div>
            </div>
          )}

          <div>
            <button
              className="my-2 flex w-full items-center justify-between px-3"
              onClick={() => {
                if (openAlert) setOpenAlert(false);
                else setOpenAlert(true);
              }}
            >
              <span className="text-sm font-bold ">앱 관리</span>
              <i
                className={`fas fa-caret-up ${openAlert ? "rotate-180" : ""}`}
                style={{
                  transition: "all 0.3s",
                }}
              />
            </button>
            <div
              className="space-y-1"
              style={{
                transition: "all 0.3s",
                transform: openAlert ? "scaleY(1)" : "scaleY(0)",
                height: openAlert ? "100%" : "0px",
                transformOrigin: "top",
              }}
            >
              {SideBarItems.filter((item) => {
                return item.category === "alert";
              }).map((item, index) => (
                <>
                  <Link key={item.path} href={item.path}>
                    <a
                      key={index}
                      className={`${
                        router.pathname.startsWith(item.path) ? "bg-gray-100" : ""
                      } flex h-[45px] min-h-[45px] w-full flex-row items-center justify-between rounded-xl px-5 py-1.5`}
                    >
                      <div
                        className={`flex items-center ${
                          router.pathname.startsWith(item.path)
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        style={{
                          transition: "all 0.3s",
                        }}
                      >
                        <i
                          className={
                            item.icon +
                            " m-auto mr-3 flex h-5 w-5 items-center justify-center text-lg"
                          }
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    </a>
                  </Link>
                </>
              ))}
            </div>
          </div>
        </ul>
      </aside>
      <div className="fixed bottom-0 left-0 z-20 ml-4 mb-5 lg:hidden">
        <button
          className="flex h-[38px] w-full w-[38px] items-center justify-center bg-white p-2 shadow-[0_13px_135px_2px_rgba(0,0,0,0.6)] transition duration-200"
          style={{
            borderRadius: "40%",
          }}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else setIsOpen(true);
          }}
        >
          <i
            className={`fas fa-arrow-right text-xl ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{
              transition: "all 0.3s",
            }}
          />
        </button>
      </div>
    </>
  );
};

export default SideBar;
