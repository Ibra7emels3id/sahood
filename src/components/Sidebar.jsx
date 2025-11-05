import { Link } from "react-router";
import { auth, db } from "../Config/Firebase/ConfigFirebase";
import { toast } from "sonner";

import logo from '../assets/logo.jpg';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = () => {
    const [user, loading] = useAuthState(auth)
    const [AllUser, setUser] = useState({});



    // fetch user and if not user navigate to login
    const fetchAllUsers = async () => {
        try {
            const q = query(
                collection(db, "users"),
                where("uid", "==", user?.uid)
            );

            const querySnapshot = await getDocs(q);
            const myAccountData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUser(myAccountData);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }



    useEffect(() => {
        fetchAllUsers();
    }, [user]);



    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-4 min-w-[270px]">
            <h2 className="text-3xl font-bold mb-6">
                <img src={logo} alt="logo" className="rounded-full" />
            </h2>
            <ul className="space-y-4 w-full">
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/dashbord" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">لوحة التحكم</Link>
                </li>
                <li className="hover:text-yellow-400 w-full cursor-pointer">
                    <Link to="/trips" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">الرحلات</Link>
                </li>
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/bookings" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">الحجوزات</Link>
                </li>
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/out-bookings" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">مكتب خارجي</Link>
                </li>
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/amenities" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">قائمة الامانات</Link>
                </li>
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/expenses" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">المصروفات</Link>
                </li>
                <li className="hover:text-yellow-400 cursor-pointer">
                    <Link to="/safe" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">الخزنة</Link>
                </li>
                {
                    AllUser[0]?.role === 'admin' && (
                        <>
                            <li className="hover:text-yellow-400 cursor-pointer">
                                <Link to="/reports" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">التقارير</Link>
                            </li>
                            <li className="hover:text-yellow-400 cursor-pointer">
                                <Link to="/addNewUser" className="w-full bg-gray-800 border-b-amber-50 border-b block p-2">أضافة مستخدم</Link>
                            </li>
                        </>
                    )
                }
                <li className="hover:text-yellow-400 cursor-pointer">
                    <button onClick={async () => {
                        await auth.signOut();
                        toast.success("تم تسجيل الخروج بنجاح");
                    }} className="w-full text-start bg-gray-800 border-b-amber-50 border-b block p-2">تسجيل الخروج</button>
                </li>
            </ul>
        </div>
    )
};
export default Sidebar;