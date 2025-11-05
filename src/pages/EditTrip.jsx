import React, { use } from 'react';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

const EditTrip = () => {
    const { id } = useParams();
    const [tripsData, setTripsData] = React.useState({});
    const [user, loading] = useAuthState(auth)
    const [aLoading, setALoading] = React.useState(false)
    const naveget = useNavigate();


    // Get Trip By Id
    const FetchDateTrips = async () => {
        setALoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/trips/${id}`);
            setTripsData(data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setALoading(false);
        }
    };


    // Update Trip By Id
    const HandleUpdateTrip = async (e) => {
        e.preventDefault();
        setALoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_SOME_URL}/api/trips/edit/${id}`, tripsData);    
            toast.success(res.data.message);
            naveget('/trips');
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setALoading(false);
        }
    };


    // Get Trip By Id
    React.useEffect(() => {
        FetchDateTrips();
    }, [id]);


    // check User is login
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);


    return (
        <div className="flex">
            <Sidebar />
            {aLoading && (
                <div className="bg-white/5 fixed inset-0  backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
                    <div className='fixed inset-0 flex items-center justify-center bg-[#00000038] bg-opacity-50'>
                        <div class="flex flex-row gap-2">
                            <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                            <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                            <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-1">
                <Header />
                <div className="p-6 flex-col">
                    <div className="flex justify-between items-center w-full">
                        <h4 className="text-2xl font-bold">تعديل الرحلة</h4>
                    </div>
                    <div className="flex flex-col mt-8">
                        <form action="">
                            <div className=" flex-col gap-4 grid grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="title">رقم الحافلة</label>
                                    <input
                                        type="text"
                                        value={tripsData.busNumber}
                                        onChange={(e) => setTripsData({ ...tripsData, busNumber: e.target.value })}
                                        placeholder="رقم الحافلة"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="description">أسم المكتب</label>
                                    <input
                                        type="text"
                                        name="OfficeName"
                                        id="OfficeName"
                                        disabled
                                        defaultValue={tripsData.OfficeName}
                                        onChange={(e) => setTripsData({ ...tripsData, OfficeName: e.target.value })}
                                        placeholder="اسم المكتب"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="price">أسم السائق الاول</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={tripsData?.name}
                                        onChange={(e) => setTripsData({ ...tripsData, name: e.target.value })}
                                        placeholder="اسم السائق الاول"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">أسم السائق الثاني</label>
                                    <input
                                        type="text"
                                        name="name2"
                                        id="name2"
                                        value={tripsData.name2}
                                        onChange={(e) => setTripsData({ ...tripsData, name2: e.target.value })}
                                        placeholder="أسم السائق الثاني"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">تاريخ الرحلة</label>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={tripsData?.date
                                            ? new Date(tripsData.date).toISOString().split("T")[0]
                                            : ""
                                        }
                                        onChange={(e) => setTripsData({ ...tripsData, date: e.target.value })}
                                        placeholder="تاريخ انطلاق الرحلة"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">وقت الرحلة</label>
                                    <div className="flex justify-between px-2 border border-gray-300 rounded">
                                        <input
                                            type="time"
                                            value={setTripsData.time24 || ""}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":");
                                                const hourNum = parseInt(hours);
                                                const ampm = hourNum >= 12 ? "PM" : "AM";
                                                const hour12 = hourNum % 12 || 12;
                                                const formatted = `${hour12}:${minutes} ${ampm}`;
                                                setTripsData({
                                                    ...tripsData,
                                                    time24: e.target.value,
                                                    time: formatted,
                                                });
                                            }}
                                            className="border-none rounded px-3 py-2"
                                        />
                                        <p className="mt-2 text-gray-600">الوقت المختار: {tripsData.time}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">مسار الرحلة</label>
                                    <input
                                        type="text"
                                        name="track"
                                        id="track"
                                        value={tripsData?.track}
                                        onChange={(e) => setTripsData({ ...tripsData, track: e.target.value })}
                                        placeholder="مسار الرحلة"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">عدد المقاعد</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        id="seats"
                                        value={tripsData?.seats}
                                        onChange={(e) => setTripsData({ ...tripsData, seats: e.target.value })}
                                        placeholder="عدد المقاعد"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">عدد المقاعد المحجوزة</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        id="seats"
                                        disabled
                                        value={tripsData?.passengerSchemas?.length}
                                        placeholder="عدد المقاعد"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image">عدد الامانت المحجوزة</label>
                                    <input
                                        type="number"
                                        name="seats"
                                        id="seats"
                                        disabled
                                        value={tripsData?.passengerSchemas?.length}
                                        placeholder="عدد الامانات"
                                        className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600"
                                    />
                                </div>
                                <div className="btn col-span-2 mt-4">
                                    <button onClick={HandleUpdateTrip} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer">تعديل</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditTrip;
