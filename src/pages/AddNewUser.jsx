import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../Config/Firebase/ConfigFirebase';
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { toast } from 'sonner';
import ModelCreateUser from './Components/ModelCreateUser';

const AddNewUser = () => {
    const [formData, setFormData] = React.useState({});
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showModel, setShowModel] = React.useState(false);

    // Handle User State Date New
    const NewDate = users.sort((a, b) => b.createdAt - a.createdAt);


    // Show Model
    const handleShowModel = () => {
        setShowModel(!showModel);
    }

    // Get Users from Firestore
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // إنشاء المستخدم في Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // ‘update Profile(displayName)
            await updateProfile(user, {
                displayName: formData.OfficeName,
            });

            // Create User in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                createdAt: new Date(),
                role: formData.role || "user",
                OfficeName: formData.OfficeName,
            });

            // Add Toast Notification Here
            toast.success("تم أضافة المستخدم بنجاح");
            fetchUsers()
            setShowModel(false);
            setLoading(false);
            handleShowModel()
        } catch (error) {
            console.error("Error:", error.code, error.message);
            toast.error("حدث خطأ ما، حاول مرة أخرى");
            setLoading(false);
        }
    };


    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);





    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Header />
                {/* Model Create User */}
                <ModelCreateUser formData={formData} setFormData={setFormData} handleRegister={handleRegister} showModel={showModel} setShowModel={setShowModel} loading={loading}  />
                <div className="Users p-8">
                    <div className="flex">
                        <h1 className="text-2xl font-bold text-slate-900 mb-6">اضافة مستخدم جديد</h1>
                        <div className="flex-1"></div>
                        <button onClick={handleShowModel} className="bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer px-6 rounded">اضافة مستخدم</button>
                    </div>
                    <div class="overflow-x-auto p-4">
                        <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead class="bg-gray-100 whitespace-nowrap">
                                <tr>
                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        الاسم
                                    </th>
                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        اسم المكتب
                                    </th>
                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        الايميل
                                    </th>
                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        نوع اليوزر
                                    </th>
                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        تاريخ التسجيل
                                    </th>
                                    {/* <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        الاجراءات
                                    </th> */}
                                </tr>
                            </thead>

                            <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                {NewDate?.map((user) => (
                                    <tr>
                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {user?.name}
                                        </td>
                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {user?.OfficeName}
                                        </td>
                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {user?.email}
                                        </td>
                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {user?.role || "User"}
                                        </td>
                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString("en-US")}
                                        </td>
                                        {/* <td class="px-4 py-4 text-sm">
                                            <button class="cursor-pointer text-blue-600 font-medium ml-4">تعديل</button>
                                            <button class="cursor-pointer text-red-600 font-medium">حذف</button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewUser;
