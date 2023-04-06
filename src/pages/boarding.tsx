import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import LottieAnimaition from "@/components/LottieAnimaition";
import Layout from "@/components/layouts/Layout";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Student, StudentWithBusBoarding, User } from "@/types";
import { Toast } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

enum BusRoute {
  seogu = "서구",
  namgu = "남구",
  buphong = "부평",
  yeonsu = "연수",
  all = "all",
}

const Students = () => {
  const [boardingDate, setBoardingDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [boardingRoute, setBoardingRoute] = useState<BusRoute>(BusRoute.all);
  const [
    downloadStudentBoardingXlsxLoading,
    setDownloadStudentBoardingXlsxLoading,
  ] = useState<boolean>();
  const [
    downloadStudentsBoardingXlsxLoading,
    setDownloadStudentsBoardingXlsxLoading,
  ] = useState<boolean>();

  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: studentsBoardingData, error: studentsBoardingError } = useSWR<
    StudentWithBusBoarding[]
  >(
    `/web/students/borading?date=${boardingDate}`,
    swrFetcher
  );

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
          <h2>일자별 탑승기록</h2>
          <div className="mt-2 flex w-full max-w-4xl flex-row items-center justify-between">
            <div className="flex space-x-2">
              <div className="form-check">
                <input
                  type="date"
                  value={boardingDate}
                  onChange={(e) => {
                    setBoardingDate(e.target.value);
                  }}
                  className="w-48 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-center space-x-2">
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
                    노선
                  </th>
                  <th scope="col" className="mx-auto px-6 py-4 text-left">
                    탑승 시간
                  </th>
                </tr>
              </thead>
              {studentsBoardingData && (
                <tbody className="w-full bg-orange-100">
                  {studentsBoardingData.map((student, index) => (
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
                        {BusRoute[student.boarding.busId]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {dayjs(student.boarding.bordingTime).format(
                          "YYYY-MM-DD HH시 mm분"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {!studentsBoardingData && (
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
