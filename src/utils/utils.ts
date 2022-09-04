import { toast } from "react-toastify";
type ToastProps = 'error' | 'success' | 'info' | 'warning';
enum UserFlags {
  general = 0 << 0,
  student = 1 << 1,
  freshman = 1 << 2,
  teacher = 1 << 3,
  admin = 1 << 5,
}

export function checkUserFlag(
  base: number,
  required: number | keyof typeof UserFlags
): boolean {
  return checkFlag(
    base,
    typeof required === "number" ? required : UserFlags[required]
  );
}

function checkFlag(base: number, required: number) {
  return (base & required) === required;
}

export function Toast(message: string, type: ToastProps = 'info') {
  return toast[type](message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}