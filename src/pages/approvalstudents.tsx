import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import LottieAnimaition from "@/components/LottieAnimaition";
import Layout from "@/components/layouts/Layout";
import client, { swrFetcher } from "@/lib/helpers/client";
import { Student, User } from "@/types";
import { Toast } from "@/utils/utils";
import { useState } from "react";
import useSWR from "swr";

const Students = () => {
  const [isUpdate, setIsUpdate] = useState(false);

  const { data: userData, error: userError } = useSWR<User>(
    "/auth/me",
    swrFetcher
  );
  const { data: studentsData, error: studentsError, mutate: updateStudents } = useSWR<Student[]>(
    `/web/students/approve`,
    swrFetcher
  );

  if (userError) return <Login />;
  if (!userData) return <Loading />;

  const approveStudent = async (id: string) => {
    setIsUpdate(true);
    client("POST", `/web/students/approve/${id}`)
      .then(res => {
        updateStudents()
        setIsUpdate(false);
        if (res.status === 200) {
          Toast("성공적으로 승인되었습니다.", "success");
        } else {
          Toast(`오류가 발생했습니다 : ${res.message}`, "error");
        }
      })
      .catch(err => {
        updateStudents()
        setIsUpdate(false);
        Toast(`오류가 발생했습니다 : ${err}`, "error");
      });
  };

  return (
    <>
      <Layout>
        <main className="flex flex-col items-center justify-center p-5">
          <h2>승인대기 학생목록</h2>
          <div className="mt-4 flex w-full max-w-4xl flex-col items-center justify-between overflow-auto">
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
                    승인
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
                          onClick={() =>
                            approveStudent(student._id)
                          }
                          disabled={isUpdate}
                        >
                          {isUpdate ? "승인중..." : "승인"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {studentsData && studentsData.length === 0 && (
              <div className="mt-5 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">승인대기 학생이 없습니다</h2>
              </div>
            )}
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
