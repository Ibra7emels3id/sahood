import axios from 'axios';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';
import { auth } from '../../Config/Firebase/ConfigFirebase';

const ModelSecretariatReservation = ({ openSecretariatModel, setOpenSecretariatModel, id, FetchDateTrips, date, time, track, busNumber, OfficeName, price }) => {
    const [formData, setFormData] = React.useState({});
    const [user] = useAuthState(auth);
    const [loading, setLoading] = React.useState(false);



    // Reserve a seat
    const HandleReserveSeat = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`${import.meta.env.VITE_SOME_URL}/api/account/reservations/secretariat/${id}`, {
                ...formData,
                date,
                time,
                track,
                busNumber,
                OfficeName,
                uid: user?.uid,
                email: user?.email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            toast.success(res.data.message);
            FetchDateTrips();
            setOpenSecretariatModel(false);
            setFormData({
                name: "",
                phone: "",
                passport: "",
                numberBags: "",
                ticketOfficeFees: "",
                ticketOfficeInvitedFees: "",
                NetTicketPrice: ""
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطاء ما، حاول مرة اخرى");
            setLoading(false);
        }
    };


    // Calculate Net Ticket Price
    useEffect(() => {
        const price = Number(formData.price) || 0;
        const ticketOfficeFees = Number(formData.ticketOfficeInvitedFees) || 0;
        const NetTicketPrice = price - ticketOfficeFees;
        setFormData({ ...formData, NetTicketPrice });
    }, [formData.price, formData.ticketOfficeInvitedFees]);


    // Show Hide Model Scroll
    useEffect(() => {
        if (openSecretariatModel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openSecretariatModel]);



    return (
        <div className={` ${openSecretariatModel ? 'block' : 'hidden'}`}>
            <div>
                <div id="modal">
                    <div class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                        <div class="w-full max-w-5xl bg-white shadow-lg rounded-md p-8 relative">
                            <svg onClick={() => setOpenSecretariatModel(false)} id="closeIcon" xmlns="http://www.w3.org/2000/svg"
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
                                <h4 class="text-2xl text-slate-900 font-semibold">بيانات الامانة</h4>
                                <form onSubmit={HandleReserveSeat}>
                                    <div class="grid grid-cols-3 mt-3 gap-4">
                                        <div className='flex flex-col items-start ' >
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">أسم المرسل</label>
                                            <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} required value={formData.name} type="text" placeholder="أسم العميل"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start ' >
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">أسم المستلم</label>
                                            <input onChange={(e) => setFormData({ ...formData, RecipientName: e.target.value })} required value={formData.RecipientName} type="text" placeholder="أسم العميل"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">رقم المرسل</label>
                                            <input onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} required value={formData.phone || ""} type="number" placeholder="رقم الهاتف"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 col-span-3 ">
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">رقم المستلم</label>
                                                <input onChange={(e) => setFormData({ ...formData, passport: e.target.value })} value={formData.passport || ""} type="text" placeholder="رقم الجواز"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">عدد الشنط</label>
                                                <input onChange={(e) => setFormData({ ...formData, numberBags: Number(e.target.value) })} required value={formData.numberBags || ""} type="number" placeholder="عدد الشنط"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className="flex w-full">
                                                <div className='flex flex-col w-full'>
                                                    <label class="text-slate-900 text-start text-sm font-medium mb-2 block">تاريخ المغادرة</label>
                                                    <div className="flex border border-gray-300 rounded-md">
                                                        <p placeholder="التاريخ" class="w-full text-start px-4 py-2 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >{new Date(date).toLocaleDateString('en-GB')}</p>
                                                        <p placeholder="التاريخ" class="w-full text-start px-4 py-2 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >{time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-3 gap-4 w-full">
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">نوع الدفع</label>
                                                <select name="PaymentType" onChange={(e) => setFormData({ ...formData, PaymentType: e.target.value })} class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="">
                                                    <option hidden>نوع الدفع</option>
                                                    <option value="cash">كاش</option>
                                                    <option value="bank">شبكة</option>
                                                </select>
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">سعر التذكرة</label>
                                                <input onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required value={formData.price || ""} type="number" placeholder="سعر التذكرة"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">رسوم السائق</label>
                                                <input onChange={(e) => {
                                                    setFormData({ ...formData, ticketOfficeInvitedFees: Number(e.target.value) })
                                                }} required value={formData.ticketOfficeInvitedFees || ""} type="number" placeholder="رسوم السائق"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                        </div>
                                        <div className="grid col-span-3 grid-cols-3 gap-4">
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">صافي سعر التذكرة</label>
                                                <input readOnly value={formData.NetTicketPrice || ""} type="number" placeholder="صافي سعر التذكرة"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">المسار</label>
                                                <input readOnly value={track} type="text"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
                                            </div>
                                            <div className='flex flex-col items-start '>
                                                <label class="text-slate-900 text-sm font-medium mb-2 block">الوجهة</label>
                                                <input onChange={(e) => setFormData({ ...formData, destination: e.target.value })} value={formData.destination} type="text"
                                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-start col-span-3'>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">ملاحظة</label>
                                            <textarea className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' name="notes" onChange={(e) => setFormData({ ...formData, notes: e.target.value })} value={formData.notes || ""} placeholder="ملاحظة" id=""></textarea>
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

export default ModelSecretariatReservation;
