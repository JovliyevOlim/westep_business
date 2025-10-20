import NewPassword from "../../../ui/components/NewPassordUi.tsx";
import {useRegister} from "../../../api/auth/useAuth.ts";
import {useRequireState} from "../../../hooks/UseRequireState.ts";

function Index() {
    useRequireState('phone')

    const {mutate,isPending} = useRegister()

    return (
        <>
            <NewPassword mutate={mutate} isPending={isPending}/>
        </>
    );
}

export default Index;