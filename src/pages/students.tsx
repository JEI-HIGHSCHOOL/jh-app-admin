import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import LottieAnimaition from "@/components/LottieAnimaition";
import Layout from "@/components/layouts/Layout";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Student, User } from "@/types";
import { Toast } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

type MemberSearchType = "name" | "phone";

const Students = () => {
  const router = useRouter();
  const [memberSearchType, setMemberSearchType] =
    useState<MemberSearchType>("name");
  const [memberSearch, setMemberSearch] = useState<string>();
  const [
    downloadStudentBoardingXlsxLoading,
    setDownloadStudentBoardingXlsxLoading,
  ] = useState<boolean>();

  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: studentsData, error: studentsError } = useSWR<Student[]>(
    `/web/students?${
      memberSearch ? `${memberSearchType}=${memberSearch}` : ""
    }`,
    swrFetcher
  );

  const handleMemberSearchTypeOnChange = (type: MemberSearchType) => {
    setMemberSearchType(type);
  };

  const downloadStudentBoardingXlsx = async (id: string) => {
    setDownloadStudentBoardingXlsxLoading(true);
    axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/web/students/borading/xlsx/${id}`,
      method: "GET",
      responseType: "blob",
      withCredentials: true
    })
      .then(response => {
        setDownloadStudentBoardingXlsxLoading(false);
        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        console.log(response.headers['filename'])
        link.setAttribute(
          "download",
          `${
            response.headers['filename'] ? decodeURIComponent(response.headers['filename']) : "탑승기록"
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
                  onChange={e => handleMemberSearchTypeOnChange("name")}
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
                  onChange={e => handleMemberSearchTypeOnChange("phone")}
                  id={` flexCheckChecked-phone`}
                />
                <label
                  className="form-check-label inline-block text-gray-800 dark:text-white"
                  htmlFor={` flexCheckChecked-phone`}
                >
                  전화번호
                </label>
              </div>
            </div>
            <Input
              className="w-48"
              placeholder={"검색어"}
              onChangeHandler={setMemberSearch}
            />
          </div>
          <div className="mt-2 flex w-full max-w-4xl flex-col items-center justify-between overflow-auto">
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
                    탑승기록
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
    </>
  );
};

export default Students;
