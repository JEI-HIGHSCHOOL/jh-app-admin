import React, {
  CSSProperties,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";

import { validateEmail, validatePhone } from "../lib/helpers/validate";


const Input: React.FC<InputProps> = ({
  defaultValue,
  onChangeHandler,
  className,
  placeholder,
  type,
  style,
  max,
  disable,
}) => {
  const [value, setValue] = useState<string | undefined>(
    defaultValue ? defaultValue : undefined
  );
  const [error, setError] = useState<string>();
  useEffect(() => {
    onChangeHandler(value);
  }, [value]);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (!value) return;
    if (type === "email") {
      if (!validateEmail(value)) setError("이메일을 확인해주세요");
      else setError("");
    } else if (type == "phone") {
      if (!validatePhone(value)) setError("휴대폰 번호를 확인해주세요");
      else setError("");
    }
  }, [value]);
  const getValue = () => {
    if (type == "phone")
      return value
        ?.replace(/[^0-9]/g, "")
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
        .replace(/(-{1,2})$/g, "");
    return value;
  };
  return (
    <>
      <div className={`${className} flex flex-col`}>
        <input
          type={type}
          disabled={disable}
          value={getValue()}
          placeholder={placeholder}
          onChange={e => {
            if (type === "number") {
              if (isNaN(Number(e.target.value)) || Number(e.target.value) < 0) return;
              if(max && Number(e.target.value) > max) return
              setValue(e.target.value);
            }
            setValue(e.target.value)
          }}
          max={max ? max : undefined}
          className={`${className} border py-2 px-2 rounded-lg focus:outline-none focus:ring-1 disabled:opacity-75 ${
            error
              ? "focus:border-red-500 focus:ring-red-500"
              : "focus:border-[#E3611D] focus:ring-[#E3611D]"
          }`}
          style={style}
        />
        {error ? (
          <span className="text-sm ml-2 text-red-500">{error}</span>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

interface InputProps {
  placeholder: string;
  onChangeHandler: (value?: string) => void;
  defaultValue?: string;
  disable?: boolean;
  className?: string;
  max?: number;
  type?: HTMLInputTypeAttribute;
  style?: CSSProperties;
}
export default Input;