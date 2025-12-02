import {Home, Search, Shop, Message, Profile} from "../icons";

function MobileNavigation() {
    return (
        <div className={'fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] lg:hidden'}>
            <div className={`
        mt-2 rounded-[20px]
        backdrop-blur-xs bg-white/50
        flex items-center justify-between
        cursor-pointer px-6 py-3
        border border-white/40
        shadow-[0_0_2px_rgba(255,255,255,0.8),_0_0_2px_rgba(255,255,255,0.4)]    
      `}
            >
                <Home width={24} height={24}/>
                <Search width={24} height={24}/>
                <Shop width={24} height={24}/>
                <Message width={24} height={24}/>
                <Profile width={24} height={24}/>
            </div>
        </div>
    );
}

export default MobileNavigation;