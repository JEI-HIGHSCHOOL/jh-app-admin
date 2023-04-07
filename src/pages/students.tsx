import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import LottieAnimaition from "@/components/LottieAnimaition";
import Modal from "@/components/Modal";
import Button from "@/components/buttons/Button";
import Layout from "@/components/layouts/Layout";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Student, User } from "@/types";
import { Toast } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";

enum BusRoute {
  seogu = "서구",
  namgu = "남구",
  buphong = "부평",
  yeonsu = "연수",
}

type MemberSearchType = "name" | "phone" | "route";

const Students = () => {
  const [memberSearchType, setMemberSearchType] =
    useState<MemberSearchType>("name");
  const [memberSearch, setMemberSearch] = useState<string>();
  const [
    downloadStudentBoardingXlsxLoading,
    setDownloadStudentBoardingXlsxLoading,
  ] = useState<boolean>();
  const [editStudentLoading, setEditStudentLoading] = useState<boolean>();
  const [deleteStudentLoading, setDeleteStudentLoading] = useState<boolean>();
  const [
    downloadStudentsBoardingXlsxLoading,
    setDownloadStudentsBoardingXlsxLoading,
  ] = useState<boolean>();
  const [editStudentModal, setEditStudentModal] = useState<boolean>(false);
  const [selectEditStudent, setSelectEditStudent] = useState<
    Student | undefined
  >();
  const [editStudnet, setEditStudnet] = useState<Student>();

  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: studentsData, error: studentsError, mutate: reloadStudent } = useSWR<Student[]>(
    `/web/students?${
      memberSearch ? `${memberSearchType}=${memberSearch}` : ""
    }`,
    swrFetcher
  );

  const handleMemberSearchTypeOnChange = (type: MemberSearchType) => {
    setMemberSearchType(type);
  };

  const handleDeleteStudent = async (id: string) => {
    const isDelete = confirm("정말 삭제하시겠습니까?");
    if (!isDelete) return;
    setDeleteStudentLoading(true);
    try {
      await client("DELETE", `/web/students/${id}`);
      Toast("학생을 삭제했습니다", "success");
    } catch (e: any) {
      Toast(e.response?.data.message, "error");
    } finally {
      reloadStudent();
      setDeleteStudentLoading(false);
      setEditStudentModal(false);
    }
  };

  const handleEditStudent = async (id: string) => {
    setEditStudentLoading(true);
    try {
      await client("PUT", `/web/students/${id}`, editStudnet);
      Toast("학생을 수정했습니다", "success");
    } catch (e: any) {
      Toast(e.response?.data.message, "error");
    } finally {
      reloadStudent();
      setEditStudentLoading(false);
      setEditStudentModal(false);
    }
  };

  const downloadStudentBoardingXlsx = async (id: string) => {
    setDownloadStudentBoardingXlsxLoading(true);
    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/web/students/borading/xlsx/${id}`,
      method: "GET",
      responseType: "blob",
      withCredentials: true,
    })
      .then((response) => {
        setDownloadStudentBoardingXlsxLoading(false);
        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        console.log(response.headers["filename"]);
        link.setAttribute(
          "download",
          `${
            response.headers["filename"]
              ? decodeURIComponent(response.headers["filename"])
              : "탑승기록"
          }`
        );
        link.style.cssText = "display:none";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        Toast("탑승기록이 다운로드 중 입니다", "success");
      })
      .catch((e: AxiosError) => {
        setDownloadStudentBoardingXlsxLoading(false);
        const message: {
          message?: string;
        } = e.response?.data as any;
        Toast(
          `탑승기록 다운로드에 실패했습니다 : ${
            message ? message.message : "알 수 없는 오류가 발생했습니다"
          }`,
          "error"
        );
      });
  };

  const downloadStudentsBoardingXlsx = async () => {
    setDownloadStudentsBoardingXlsxLoading(true);
    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/web/students/borading/xlsx`,
      method: "GET",
      responseType: "blob",
      withCredentials: true,
    })
      .then((response) => {
        setDownloadStudentsBoardingXlsxLoading(false);
        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        console.log(response.headers["filename"]);
        link.setAttribute(
          "download",
          `${
            response.headers["filename"]
              ? decodeURIComponent(response.headers["filename"])
              : "탑승기록"
          }`
        );
        link.style.cssText = "display:none";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        Toast("탑승기록이 다운로드 중 입니다", "success");
      })
      .catch((e: AxiosError) => {
        setDownloadStudentsBoardingXlsxLoading(false);
        const message: {
          message?: string;
        } = e.response?.data as any;
        console.log(message);
        Toast(
          `탑승기록 다운로드에 실패했습니다 : ${
            message ? message.message : "알 수 없는 오류가 발생했습니다"
          }`,
          "error"
        );
      });
  };

  if (userError) return <Login />;
  if (!userData) return <Loading />;
  return (
    <>
      <Layout>
        <main className="flex flex-col items-center justify-center p-5">
          <h2>학생목록</h2>
          <div className="mt-2 flex w-full max-w-4xl flex-row items-center justify-between">
            <div className="flex space-x-2">
              <span>검색 방식</span>
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
              <div className="form-check">
                <input
                  className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                  type="checkbox"
                  checked={memberSearchType === "phone"}
                  onChange={(e) => handleMemberSearchTypeOnChange("phone")}
                  id={` flexCheckChecked-phone`}
                />
                <label
                  className="form-check-label inline-block text-gray-800 dark:text-white"
                  htmlFor={` flexCheckChecked-phone`}
                >
                  전화번호
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none dark:text-white"
                  type="checkbox"
                  checked={memberSearchType === "route"}
                  onChange={(e) => handleMemberSearchTypeOnChange("route")}
                  id={` flexCheckChecked-route`}
                />
                <label
                  className="form-check-label inline-block text-gray-800 dark:text-white"
                  htmlFor={` flexCheckChecked-route`}
                >
                  노선
                </label>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center space-x-2">
              {memberSearchType === "route" ? (
                <>
                  <div className="flex flex-row items-center">
                    <select
                      onChange={(e) => {
                        if (e.target.value == "all") {
                          return setMemberSearch("");
                        }
                        setMemberSearch(e.target.value);
                      }}
                      className="w-28 rounded-md"
                    >
                      <option value="all">전체</option>
                      <option value="seogu">서구</option>
                      <option value="namgu">남구</option>
                      <option value="yeonsu">연수구</option>
                      <option value="buphong">부평</option>
                    </select>
                  </div>
                </>
              ) : (
                <Input
                  className="w-48"
                  placeholder={"검색어"}
                  onChangeHandler={setMemberSearch}
                />
              )}
              <button
                className="rounded bg-orange-500 py-2 px-4 font-bold text-white hover:bg-orange-600"
                onClick={() => {
                  downloadStudentsBoardingXlsx();
                }}
                disabled={downloadStudentsBoardingXlsxLoading}
              >
                {downloadStudentsBoardingXlsxLoading ? (
                  <i className="fas fa-spinner fa-spin mr-2" />
                ) : (
                  <>
                    <i className="fas fa-file-excel mr-2" />
                    전체 탑승기록 다운로드
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-center justify-between overflow-auto">
            <table className="min-w-full ">
              <thead className="w-full rounded border-b bg-orange-500">
                <tr className="font-bold text-white">
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    이름
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    전화번호
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    과
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    학년
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    반
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    번호
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    노선
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    탑승기록
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    수정
                  </th>
                </tr>
              </thead>
              {studentsData && (
                <tbody className="w-full bg-orange-100">
                  {studentsData.map((student, index) => (
                    <tr className="border-b" key={index}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.department}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.grade}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.class}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {student.number}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {BusRoute[student.route]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        <button
                          className="rounded bg-orange-500 py-2 px-4 font-bold text-white hover:bg-orange-600"
                          onClick={() => {
                            downloadStudentBoardingXlsx(student._id);
                          }}
                          disabled={downloadStudentBoardingXlsxLoading}
                        >
                          {downloadStudentBoardingXlsxLoading ? (
                            <i className="fas fa-spinner fa-spin mr-2" />
                          ) : (
                            <>
                              <i className="fas fa-file-excel mr-2" />
                              탑승기록 다운로드
                            </>
                          )}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        <button
                          className="rounded bg-orange-500 py-2 px-4 font-bold text-white hover:bg-orange-600"
                          onClick={() => {
                            setSelectEditStudent(student);
                            setEditStudnet(student);
                            setEditStudentModal(true);
                          }}
                          disabled={editStudentLoading}
                        >
                          {editStudentLoading ? (
                            <i className="fas fa-spinner fa-spin mr-2" />
                          ) : (
                            <>수정</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {!studentsData && (
              <>
                <LottieAnimaition
                  animation={require("../animation/loading.json")}
                  className="h-40 w-40"
                />
              </>
            )}
          </div>
        </main>
      </Layout>

      <Modal
        title={selectEditStudent?.name + " 정보수정"}
        button={
          <>
            <Button
              onClick={() => {
                handleDeleteStudent(selectEditStudent._id);
              }}
              isLoading={deleteStudentLoading}
              className="mr-2 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-600"
            >
              삭제
            </Button>
            <Button
              onClick={() => {
                handleEditStudent(selectEditStudent._id);
              }}
              className="rounded bg-orange-500 py-2 px-4 font-bold text-white hover:bg-orange-600"
            >
              수정
            </Button>
          </>
        }
        isOpen={editStudentModal}
        callbackOpen={setEditStudentModal}
      >
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">이름</label>
          <Input
            defaultValue={editStudnet?.name}
            onChangeHandler={(e) => {
              setEditStudnet({ ...editStudnet, name: e });
            }}
            placeholder="이름"
          />
        </div>
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">전화번호</label>
          <Input
            defaultValue={editStudnet?.phone}
            onChangeHandler={(e) => {
              setEditStudnet({ ...editStudnet, phone: e });
            }}
            placeholder="전화번호"
          />
        </div>

        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">노선</label>
          <select
            className="rounded-lg border py-2 px-2 focus:border-[#E3611D] focus:outline-none focus:ring-1 focus:ring-[#E3611D] disabled:opacity-75"
            onChange={(e) => {
              setEditStudnet({
                ...editStudnet,
                route: e.target.value,
              });
            }}
            value={editStudnet?.route}
          >
            <option value="seogu">서구노선</option>
            <option value="namgu">남구노선</option>
            <option value="yeonsu">연수노선</option>
            <option value="buphong">계양부평노선</option>
          </select>
        </div>
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">학과</label>
          <select
            onChange={(e) => {
              setEditStudnet({
                ...editStudnet,
                department: e.target.value,
              });
            }}
            value={editStudnet?.department}
            className="rounded-lg border py-2 px-2 focus:border-[#E3611D] focus:outline-none focus:ring-1 focus:ring-[#E3611D] disabled:opacity-75"
          >
            <option value="스마트통신과">스마트통신과</option>
            <option value="스마트전자과">스마트전자과</option>
            <option value="스마트전기과">스마트전기과</option>
            <option value="스마트반도체과">스마트반도체과</option>
            <option value="스마트건축과">스마트건축과</option>
            <option value="AI로봇과">AI로봇과</option>
          </select>
        </div>
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">학년</label>
          <Input
            defaultValue={editStudnet?.grade}
            onChangeHandler={(e) => {
              setEditStudnet({ ...editStudnet, grade: e });
            }}
            placeholder="학년"
          />
        </div>
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">반</label>
          <Input
            defaultValue={editStudnet?.class}
            onChangeHandler={(e) => {
              setEditStudnet({ ...editStudnet, class: e });
            }}
            placeholder="반"
          />
        </div>
        <div className="mb-2 flex w-full flex-col">
          <label className="mb-1 font-bold">번호</label>
          <Input
            defaultValue={editStudnet?.number}
            onChangeHandler={(e) => {
              setEditStudnet({ ...editStudnet, number: e });
            }}
            placeholder="번호"
          />
        </div>
      </Modal>
    </>
  );
};

export default Students;
