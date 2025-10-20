import NewPassword from "../../../ui/components/NewPassordUi.tsx";
import {useRegister} from "../../../api/auth/useAuth.ts";

function Index() {

    const {mutate,isPending} = useRegister()

    return (
        <>
            <NewPassword mutate={mutate} isPending={isPending}/>
        </>
    );
}

export default Index;