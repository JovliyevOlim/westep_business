import PasswordForm from "./PasswordForm.tsx";
import {useRequireState} from "../../../hooks/UseRequireState.ts";


export default function Login() {
    useRequireState('phone')

    return (
        <>
            <PasswordForm/>
        </>
    )
}
