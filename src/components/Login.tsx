import { useRouter } from "next/router";
import { useEffect } from "react";

const Login = () => {
    const router = useRouter()
    useEffect(() => {
        router.push('/login')
    })
    return (
        <></>
    )
}

export default Login;