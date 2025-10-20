import Spinner from "./common/Spinner.tsx";

function Button({isPending}: { isPending: boolean }) {
    return (
        <button className="auth_btn-primary bt" disabled={isPending} type="submit"
                name="submit">
            {
                isPending ? <Spinner/> : "Davom Etish"
            }
        </button>);
}

export default Button;