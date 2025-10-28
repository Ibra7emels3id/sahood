import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { auth } from '../../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Model = ({ isOpen, onClose, FetchDateTrips }) => {
    const [formData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [user] = useAuthState(auth)
    const [OfficeName, setOfficeName] = React.useState("");
    const [userId, setUserId] = React.useState("");

    // Handle Create New Trip
    const handleCreateTrip = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_SOME_URL}/api/trips`, {
                ...formData,
                uid: userId || user?.uid,
                OfficeName,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('تم إضافة الرحلة بنجاح');
            FetchDateTrips();
            onClose();
            setFormData({
                name: '',
                name2: '',
                busNumber: '',
                track: '',
                date: '',
                time: '',
                price: '',
                seats: ''
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }




    // Handle Hide scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

    }, [isOpen]);

    // Fetch My Account
    useEffect(() => {
        setOfficeName(user?.displayName);
        setUserId(user?.uid);
    }, [user, user?.uid, user?.displayName]);


    return (
        <div className={` ${isOpen ? 'block' : 'hidden'}`}>
            <div>
                <div id="modal">
                    <div
                        class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                        <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-8 relative">
                            <svg onClick={onClose} id="closeIcon" xmlns="http://www.w3.org/2000/svg"
                                class="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-800 hover:fill-red-500 float-right"
                                viewBox="0 0 320.591 320.591">
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"></path>
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"></path>
                            </svg>
                            <div class="mt-4 text-center">
                                <h4 class="text-2xl text-slate-900 font-bold">أدخل بيانات الرحلة الجديدة</h4>
                                <form onSubmit={handleCreateTrip}>
                                    <div class="mt-6 flex flex-col gap-4">
                                        <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} required value={formData.name} name='name' type="text" placeholder="اسم السائق"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <input onChange={(e) => setFormData({ ...formData, name2: e.target.value })} required value={formData.name2} name='name2' type="text" placeholder="اسم السائق الثاني"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <input onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })} required value={formData.busNumber} name='busNumber' type="text" placeholder="رقم السيارة"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <input onChange={(e) => setFormData({ ...formData, track: e.target.value })} required value={formData.track} name='track' type="text" placeholder="المسار"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <input onChange={(e) => setFormData({ ...formData, date: e.target.value })} required value={formData.date} name='date' type="date" placeholder="التاريخ"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                                        {/* <input onChange={(e) => setFormData({ ...formData, time: e.target.value })} required value={formData.time} name='time' type="time" placeholder="وقت المغادرة"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                             */}
                                        <input
                                            type="time"
                                            value={formData.time24 || ""}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":");
                                                const hourNum = parseInt(hours);
                                                const ampm = hourNum >= 12 ? "PM" : "AM";
                                                const hour12 = hourNum % 12 || 12;
                                                const formatted = `${hour12}:${minutes} ${ampm}`;
                                                setFormData({
                                                    ...formData,
                                                    time24: e.target.value,
                                                    time: formatted,
                                                });
                                            }}
                                            className="border rounded px-3 py-2"
                                        />
                                        <p className="mt-2 text-gray-600">الوقت المختار: {formData.time}</p>

                                        <input onChange={(e) => setFormData({ ...formData, seats: e.target.value })} required value={formData.seats} name='seats' type="number" placeholder="عدد المقاعد"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    {
                                        loading ? (
                                            <button disabled type="button"
                                                class="mt-6 w-full px-4 py-2 rounded-lg text-white text-sm font-medium border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600">تحميل ...</button>
                                        ) : (
                                            <button type="submit" class="mt-6 px-5 py-2.5 cursor-pointer w-full rounded-md text-white text-sm font-medium outline-none bg-blue-600 hover:bg-blue-700">حفظ البيانات</button>
                                        )
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Model;
