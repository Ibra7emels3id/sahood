import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { auth } from '../../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ModelOutBookings = ({ isOpen, onClose, FetchDateTrips }) => {
    const [formData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [user] = useAuthState(auth)
    const [OfficeName, setOfficeName] = React.useState("");
    const [userId, setUserId] = React.useState("");

    // Handle Create New Trip
    const handleCreateBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_SOME_URL}/api/out-booking`, {
                ...formData,
                uid: userId || user?.uid,
                OfficeName,
                type: "reservation",
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('تم إضافة الحجز بنجاح');
            FetchDateTrips();
            onClose();
            setFormData({
                name: '',
                busNumber: '',
                track: '',
                date: '',
                time: '',
                price: '',
                seats: '',
                ticketOfficeFees: '',
                ticketOfficeInvitedFees: '',
                NetTicketPrice: '',
                numberBags: '',
                passport: '',
                phone: '',
                typeSix: '',
                notes: '',
                description: '',
                destination: '',
                PaymentType: '',
                RecipientName: '',
                gender: '',
                BirthDate: '',
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }



    // Handle Price 
    useEffect(() => {
        const price = Number(formData.price) || 0;
        const ticketOfficeInvitedFees = Number(formData.ticketOfficeInvitedFees) || 0;
        const NetTicketPrice = price - ticketOfficeInvitedFees;
        setFormData({ ...formData, NetTicketPrice });
    }, [formData.price, formData.ticketOfficeInvitedFees]);



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
                    <div class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                        <div class="w-full max-w-5xl bg-white shadow-lg rounded-md p-8 relative">
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
                            <div class="mt-1 text-center">
                                <h4 class="text-2xl text-slate-900 font-semibold">بيانات تذكرة خارجية</h4>
                                <form onSubmit={handleCreateBook}>
                                    <div class="grid grid-cols-2 mt-6 gap-4">
                                        <div className='flex flex-col items-start ' >
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">أسم العميل</label>
                                            <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} required value={formData.name} type="text" placeholder="أسم العميل"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start ' >
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">الجنسية</label>
                                            <input onChange={(e) => setFormData({ ...formData, typeSix: e.target.value })} required value={formData?.typeSix} type="text" placeholder="الجنسية"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">رقم الهاتف</label>
                                            <input onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} required value={formData.phone || ""} type="number" placeholder="رقم الهاتف"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">رقم الجواز</label>
                                            <input onChange={(e) => setFormData({ ...formData, passport: e.target.value })} required value={formData.passport || ""} type="text" placeholder="رقم الجواز"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">عدد الشنط</label>
                                            <input onChange={(e) => setFormData({ ...formData, numberBags: Number(e.target.value) })} required value={formData.numberBags || ""} type="number" placeholder="عدد الشنط"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">تاريخ الميلاد</label>
                                            <input onChange={(e) => setFormData({ ...formData, BirthDate: e.target.value })} required value={formData.BirthDate || ""} required type="date"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">النوع</label>
                                            <select onChange={(e) => setFormData({ ...formData, gender: e.target.value })} value={formData.gender} class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option hidden>أختر النوع</option>
                                                <option value="ذكر">ذكر</option>
                                                <option value="انثى">انثى</option>
                                            </select>
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">وقت المغادرة</label>
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
                                                className="border rounded px-3 py-2 w-full"
                                            />
                                            <p className="mt-2 text-gray-600">الوقت المختار: {formData.time}</p>
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">تاريخ المغادرة</label>
                                            <input onChange={(e) => setFormData({ ...formData, date: e.target.value })} required value={formData.date || ""} type="date" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">المسار</label>
                                            <input onChange={(e) => setFormData({ ...formData, track: e.target.value })} required value={formData.track || ""} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='الرياض الي دمشق' />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">مدينة الوصول</label>
                                            <input onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required value={formData.destination || ""} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='مدينة الوصول' />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">نوع الدفع</label>
                                            <select name="PaymentType" onChange={(e) => setFormData({ ...formData, PaymentType: e.target.value })} value={formData.PaymentType} required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="">
                                                <option hidden>نوع الدفع</option>
                                                <option value="cash">كاش</option>
                                                <option value="bank">شبكة</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-3 col-span-2 gap-4">
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">أجمالي سعر التذكرة</label>
                                                <input onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} min="0" required value={formData.price || ''} class="w-full text-start px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="number" placeholder="أجمالي سعر التذكرة" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">سعر المكتب المدعو للتذكرة</label>
                                                <input onChange={(e) => {
                                                    setFormData({ ...formData, ticketOfficeInvitedFees: Number(e.target.value), })
                                                }} value={formData.ticketOfficeInvitedFees || ''} type="number" placeholder="عمولة المكتب المدعو للتذكرة"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">صافي الايراد</label>
                                                <p placeholder="صافي الايراد" class="w-full text-start px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    {formData.NetTicketPrice || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        loading ?
                                            <button disabled type="submit" class="w-full px-4 py-2 mt-6 text-white bg-blue-500 rounded-md focus:outline-none focus:bg-blue-600">
                                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                                    <svg class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                                    </svg>
                                                </span>
                                                جاري التحميل...
                                            </button>
                                            :
                                            <button type="submit" class="mt-6 px-5 py-2.5 cursor-pointer w-full rounded-md text-white text-sm font-medium outline-none bg-blue-600 hover:bg-blue-700">حفظ البيانات</button>
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

export default ModelOutBookings;
