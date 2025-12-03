import 'react-phone-number-input/style.css';
import {useEffect, useState} from "react";
import moment from "moment";
import {useOtpPhoneNumber, useVerifyCode} from "../../api/auth/useAuth.ts";
import {formatUzPhone} from "../../utils/utils.ts";
import CommonButton from "../ui/button/AuthButton.tsx";


export default function VerifyCodeForm() {
    const form = JSON.parse(sessionStorage.getItem('form') as string)
    const otpType = JSON.parse(sessionStorage.getItem('otpType') as string);
    const {mutate} = useOtpPhoneNumber(otpType)
    const {isPending, mutate: verifyCode, isError} = useVerifyCode();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [remainingTime, setRemainingTime] = useState(3 * 60);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setError(isError);
    }, [isError]);



    const getInputElement = (index: number): HTMLInputElement | null => {
        return document.getElementById(`digit${index}-input`) as HTMLInputElement | null;
    };

    // KeyUp hodisasi
    const moveToNext = (index: number, value: string) => {
        setError(false);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Agar qiymat uzunligi 1 bo'lsa, keyingi inputga o'tadi
        if (value.length === 1) {
            if (index < 5) {
                const nextInput = getInputElement(index + 1);
                nextInput?.focus();
            } else {
                // Oxirgi inputdan keyin submit qilish
                console.log("Submit code:", newOtp.join(""));
            }
        }
    };

    const handleBackspace = (index: number, value: string) => {
        if (value === "" && index > 0) {
            const prevInput = getInputElement(index - 1);
            prevInput?.focus();
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval); // Taymer tugadi
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Komponent unmounted bo'lsa, intervalni to'xtatish
    }, [remainingTime]);

    const formatTime = (seconds: number) => {
        const duration = moment.duration(seconds, "seconds");
        const minutes = Math.floor(duration.asMinutes());
        const secs = duration.seconds();
        return `${minutes}:${secs.toString().padStart(2, "0")}`; // 2 xonali ko'rinish
    };


    return (
        <section className="flex items-center justify-center w-full">
            <div className="w-full max-w-lg animate-fadeIn">
                <div className="col-12">
                    <h1 className="text-3xl md:text-4xl text-gray-900 font-semibold text-center">Raqamni tasdiqlash</h1>
                    <p className="text-lg text-gray-900  text-center mb-4">Parol <strong
                    > {formatUzPhone(form?.phoneNumber)}</strong> raqamga yuborildi
                    </p>
                    <div className="flex justify-center">
                        <div className='flex justify-between w-full'>
                            {otp.map((digit, index) => (
                                <input
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="one-time-code"
                                    type="number"
                                    className={`otp-input border ${error ? 'border-red-500 text-red-500' : 'border-gray-300 text-black'}`}
                                    maxLength={1}
                                    id={`digit${index}-input`}
                                    value={digit}
                                    onChange={(e) => moveToNext(index, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace") {
                                            handleBackspace(index, e.currentTarget.value);
                                        }
                                    }}
                                    onInput={(e) => {
                                        // Faqat bir raqamli qiymat qoldirish
                                        const value = e.currentTarget.value;
                                        if (value.length > 1) {
                                            e.currentTarget.value = value[0]; // Faqat birinchi raqamni qoldiradi
                                        }
                                    }}
                                    key={`digit${index}-input`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-3 mb-2 justify-center">
                        <div className={'flex justify-between'}>
                            <p className={'m-0 text-xl font-light text-gray-300'}>{formatTime(remainingTime)}</p>
                            {
                                remainingTime === 0
                                &&
                                <p onClick={() => {
                                    mutate({
                                        phoneNumber: form.phoneNumber,
                                        type: otpType
                                    })
                                    setRemainingTime(180)
                                }} className="text-xl text-gray-300 font-light cursor-pointer">Qaytadan yuborish</p>
                            }

                        </div>
                    </div>
                    <div className="mt-10">
                        <CommonButton
                            type="button"
                            children={"Davom etish"}
                            variant="primary"
                            isPending={isPending}
                            onClick={() => {
                                verifyCode({
                                    phoneNumber: form.phoneNumber,
                                    type: otpType,
                                    code: otp.join(''),
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
