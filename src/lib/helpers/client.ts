import axios, { AxiosError, AxiosResponse, Method } from "axios";

export const client = async (
  method: Method = "GET",
  endpoints: string,
  data?: any,
  auth?: string | null,
  headers?: any
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      data,
      headers: {
        ...headers,
        Authorization: auth ? "Bearer " + auth : "",
      },
      url: process.env.NEXT_PUBLIC_API_URL + endpoints,
      withCredentials: true,
    });
    return {
      data: response.data.data,
      error: false,
      status: 200,
      message: response.data.message,
    };
  } catch (response: any) {
    return {
      data: response.response.data.data,
      status: response.response.data.status,
      error: true,
      message: response.response.data.message,
    };
  }
};
export const swrFetcher = (endpoints: string) =>
  axios
    .get(process.env.NEXT_PUBLIC_API_URL + endpoints, { withCredentials: true })
    .then((data) => data.data.data)
    .catch((e: AxiosError) => {
      const response = e.response as any;
      throw new Error(
        response.data.message
          ? response.data.message
          : "알 수 없는 오류가 발생했습니다"
      );
    });

export interface Response<
  T extends { [key: string]: any } = { [key: string]: any }
> {
  data?: T | string | any;
  error: boolean;
  status: number;
  message: string;
}
export default client;
