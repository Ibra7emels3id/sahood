import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Config/Firebase/ConfigFirebase";

const Header = () => {
    const [user] = useAuthState(auth);
    // console.log(user);
    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">لوحة تحكم {user?.displayName} 💖</h1>
            <button onClick={() => auth.signOut()} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">تسجيل خروج</button>
        </div>
    );
}
export default Header;