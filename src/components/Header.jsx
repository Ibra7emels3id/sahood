import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Config/Firebase/ConfigFirebase";

const Header = () => {
    const [user] = useAuthState(auth);
    // console.log(user);
    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">لوحة تحكم {user?.displayName} 💖</h1>
            <button onClick={() => auth.signOut()} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
            </button>
        </div>
    );
}
export default Header;