import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';
import ModelOutBookings from './Components/ModelOutBookings';
import logo from '../assets/logo.jpg';
import Loading from './Components/Loading';
import { toast } from 'sonner';
import ModelOutDeposits from './Components/ModelOutDeposits';

const OutBookings = ({ User }) => {
    const [isModelOpen, setIsModelOpen] = React.useState(false);
    const [isModelOpenReservation, setIsModelOpenReservation] = React.useState(false);
    const [tripsData, setTripsData] = React.useState([]);
    const [user, loading] = useAuthState(auth)
    const [aLoading, setALoading] = React.useState(false)
    const [type, setType] = React.useState('reservation');


    // Handle Show Alert Model
    const HandleShowAlertModelReservation = () => {
        setIsModelOpenReservation(!isModelOpenReservation);
    }
    const HandleShowAlertModel = () => {
        setIsModelOpen(!isModelOpen);
    }

    // Handle Fetch Trips Data from API
    const FetchDateTrips = async () => {
        if (!User) return;
        setALoading(true);
        try {
            const endpoint =
                User.role === "admin"
                    ? "/api/out-bookings"
                    : `/api/account/out-bookings/${User.uid}`;
            const { data } = await axios.get(`${import.meta.env.VITE_SOME_URL}${endpoint}`);
            const filterDataByType = data.outBookings.filter(item => item.type === type);
            setTripsData(filterDataByType);
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setALoading(false);
        }
    };


    const handlePrintBooked = (id) => {
        const reservation = tripsData.find(r => r._id === id) || tripsData.find(r => r._id === id);
        if (!reservation) {
            console.error("Reservation not found");
            return;
        }

        // 
        let timeString = reservation.time?.trim() || "00:00";

        // 
        let date;
        if (/am|pm/i.test(timeString)) {
            date = new Date(`1970-01-01 ${timeString}`);
        } else {
            date = new Date(`1970-01-01T${timeString}:00`);
        }

        // 
        let arrivalTime = "غير معروف";
        if (!isNaN(date.getTime())) {
            date.setHours(date.getHours() - 1);
            arrivalTime = date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }

        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
           <html>
             <head>
               <title>تذكرة الباص</title>
               <style>
                 body { font-family: Arial, sans-serif; text-align: center; font-size: 18px; }
                 .ticket { border: 2px dashed #000; padding: 20px; margin: 20px; }
                 h2 { margin-bottom: 10px; }
               </style>
             </head>
             <body style="font-weight: bold;">
               <div id="ticket" style="width:800px; border:2px solid #000; padding:15px; font-family:Arial; direction:rtl; text-align:right">
                 <div style="display:flex; justify-content:space-between; align-items:center;">
                   <img src="${logo}" alt="logo" style="height:50px;"/>
                   <p>00966550603044</p>
                    <span>حافلة سهود للنقل البري </span>
                 </div>
                 <hr/>
                 <h2 style="margin:20px 0;">تذكرة حجز مقعد في الحافلة</h2>
                 <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                   <p style="font-size:16px; width:160px;">الاسم: ${reservation.name || "ابراهيم السعيد"}</p>
                   <p style="font-size:15px; width:170px;">الجوال: ${reservation.phone}</p>
                   <p style="font-size:15px; width:170px;">رقم الجواز: ${reservation.passport || "-"}</p>
                   <p style="font-size:15px; width:180px;">رقم التذكرة: ${reservation.ticketNumber}</p>
                 </div>
                 <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                   <p style="font-size:15px; width:170px;">المسار: ${reservation.track}</p>
                   <p style="font-size:15px; width:170px;">بلد الوصول: ${reservation.destination}</p>
                    <p style="font-size:16px; width:160px;">التاريخ: ${new Date(reservation.date).toLocaleDateString('ar-EG')}</p>
                   <p style="font-size:15px; width:180px;">الوقت: ${reservation.time}</p>
                 </div>
                   <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                       <p style="font-size:15px; width:170px;">وقت الحضور: ${arrivalTime}</p>
                       <p style="font-size:15px; width:170px;">المكتب: ${reservation.OfficeName}</p>
                       <p style="font-size:15px; width:170px;">السعر: ${reservation.price} ريال</p>
                       </div>
                   <div style=" display:flex; justify-content:space-between; width:97%;">
                       <p style="margin-top:20px; font-size:12px;">${new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
               </div>
             </body>
           </html>
         `);

        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    const handlePrintBookedAmenities = (id) => {
        const reservation = tripsData.find(r => r._id === id) || tripsData.find(r => r._id === id);
        if (!reservation) {
            console.error("Reservation not found");
            return;
        }

        // 
        let timeString = reservation.time?.trim() || "00:00";

        // 
        let date;
        if (/am|pm/i.test(timeString)) {
            date = new Date(`1970-01-01 ${timeString}`);
        } else {
            date = new Date(`1970-01-01T${timeString}:00`);
        }

        // 
        let arrivalTime = "غير معروف";
        if (!isNaN(date.getTime())) {
            date.setHours(date.getHours() - 1);
            arrivalTime = date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }

        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
        <html>
            <head>
            <title>تذكرة الباص</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; font-size: 18px; }
                .ticket { border: 2px dashed #000; padding: 20px; margin: 20px; }
                h2 { margin-bottom: 10px; }
            </style>
            </head>
            <body style='font-family: "Cairo", sans-serif; font-weight: bold;'>
            <div id="ticket" style="width:800px; border:2px solid #000; padding:15px; font-family:Arial; direction:rtl; text-align:right">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <img src="${logo}" alt="logo" style="height:50px;"/>
                    <p>00966550603044</p>
                    <span>حافلة سهود للنقل البري </span>
                </div>
                <hr/>
                <h2 style="margin:20px 0;">تذكرة وزن زائد</h2>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                    <p style="font-size:16px; width:160px;">الاسم: ${reservation.name || "-"}</p>
                    <p style="font-size:16px; width:160px;">أسم المستلم: ${reservation.RecipientName || "-"}</p>
                    <p style="font-size:15px; width:170px;">الجوال: ${reservation.phone}</p>
                    <p style="font-size:15px; width:170px;">رقم المستلم: ${reservation.passport || "-"}</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                    <p style="font-size:15px; width:180px;">رقم التذكرة: ${reservation.ticketNumber}</p>
                    <p style="font-size:15px; width:170px;">المسار: ${reservation.track}</p>
                    <p style="font-size:15px; width:170px;">مكان الوصول : ${reservation.destination}</p>
                    <p style="font-size:15px; width:170px;">عدد الحقائب: ${reservation.numberBags}</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                    <p style="font-size:16px; width:160px;">التاريخ: ${new Date(reservation.date).toLocaleDateString('ar-EG')}</p>
                    <p style="font-size:15px; width:170px;">المكتب: ${reservation.OfficeName}</p>
                    <p style="font-size:15px; width:170px;">السعر: ${reservation.price} ريال</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <p style="font-size:15px;">محتوي الحقيبة: ${reservation?.notes}</p>
                </div>
                <div style=" display:flex; justify-content:space-between; width:97%;">
                    <p style="margin-top:20px; font-size:12px;"> تاريخ الاصدار : ${new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>
          </body>
        </html>
      `);

        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };


    // Handle Cancel Reservation
    const HandleCancelReservation = async (id) => {
        if (!id) return;
        if (confirm('هل أنت متأكد من إلغاء الحجز؟')) {
            try {
                const res = await axios.put(`${import.meta.env.VITE_SOME_URL}/api/out-booking-cancel/${user.uid}/${id}`);
                toast.success(res.data.message);
                FetchDateTrips();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Handle Delete Reservation
    const HandleDeleteReservation = async (id) => {
        if (!id) return;
        if (confirm('هل أنت متأكد من حذف الحجز؟')) {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_SOME_URL}/api/out-booking-delete/${id}/${user.uid}`);
                toast.success(res.data.message);
                FetchDateTrips();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Fetch Trips Data from API
    useEffect(() => {
        FetchDateTrips();
    }, [user, User, type]);



    // check User is login
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);




    return (
        <>
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
                        <div className="flex justify-end items-center w-full gap-4">
                            <button onClick={HandleShowAlertModelReservation} className=" cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة حجز خارجي</button>
                            <button onClick={HandleShowAlertModel} className=" cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة أمانة خارجية</button>
                        </div>
                        <div className="flex flex-col mt-8">
                            <h3 className="text-lg font-bold mb-4">قائمة حجوزات خارجية  .</h3>
                            <div className="flex gap-3 mb-3">
                                {
                                    type === 'reservation' ?
                                        <button className=' bg-amber-200 p-2 rounded w-[100px] text-white font-bold' >حجوزات</button>
                                        :
                                        <button onClick={() => {
                                            setType('reservation')
                                        }} className=' bg-amber-400 p-2 rounded w-[100px] text-white font-bold cursor-pointer' >حجوزات</button>
                                }
                                {
                                    type === 'deposits' ?
                                        <button className=' bg-amber-200 p-2 rounded w-[100px] text-white font-bold' >امانات</button>
                                        :
                                        <button onClick={() => {
                                            setType('deposits')
                                        }} className=' bg-amber-400 p-2 rounded w-[100px] text-white font-bold cursor-pointer' >امانات</button>
                                }
                            </div>
                            <div class={`overflow-x-auto mt-4 ${type === 'reservation' ? 'block' : 'hidden'}`}>
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-100 whitespace-nowrap">
                                        <tr>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                رقم الحجز
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                المكتب
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                النوع
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الاسم
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                رقم الجواز
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الجوال
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                المسار
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                التاريخ والوقت
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    {<tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                        {tripsData.map((trip, index) => (
                                            <tr>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.ticketNumber}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.OfficeName}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.type === 'reservation' ? 'حجز' : 'امانة'}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.name}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.passport}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.phone || '---'}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.track}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {new Date(trip.date).toLocaleDateString('en-GB')} <br />
                                                    {trip.time}
                                                </td>
                                                <td class={trip.status === 'booked' ? 'px-4 py-4 text-sm text-green-600 font-medium' : 'px-4 py-4 text-sm text-red-600 font-medium'}>
                                                    {trip.status === 'booked' ? 'مكتمل' : 'ملغي'}
                                                </td>
                                                <td class="px-4 py-4 h-full text-sm flex items-center justify-between">
                                                    {
                                                        trip.status === 'canceled' ? (
                                                            <button className="cursor-pointer text-blue-600 font-medium py-3">
                                                                {/* <svg width="24" height="24" fill="#5c0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#5c0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg> */}
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => {
                                                                HandleCancelReservation(trip._id)
                                                            }} class="cursor-pointer text-blue-600 font-medium py-3">
                                                                <svg width="24" height="24" fill="#5c0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#5c0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg>
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        User.role === 'admin' && (
                                                            <button onClick={() => HandleDeleteReservation(trip._id)} class="cursor-pointer text-blue-600 font-medium py-3">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                            </button>
                                                        )
                                                    }
                                                    <button onClick={() => {
                                                        handlePrintBooked(trip._id)
                                                    }} class="cursor-pointer text-blue-600 font-medium py-3">
                                                        <svg width={'24'} height={'24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.25 15.8011 15.329 15.6103 15.4697 15.4697C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z" fill="#000000"></path> <path d="M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z" fill="#000000"></path> <path d="M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z" fill="#000000"></path> </g></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    }
                                </table>
                            </div>
                            <div class={` overflow-x-auto mt-4 ${type === 'deposits' ? 'block' : 'hidden'}`}>
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-100 whitespace-nowrap">
                                        <tr>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                رقم الحجز
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                المكتب
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                النوع
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الاسم الاول
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                اسم المستلم
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الجوال
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                جوال المستلم
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                التاريخ والوقت
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    {<tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                        {tripsData.map((trip, index) => (
                                            <tr>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.ticketNumber}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.OfficeName}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.type === 'reservation' ? 'حجز' : 'امانة'}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.name}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.RecipientName}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.phone || '---'}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.passport}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {new Date(trip.date).toLocaleDateString('en-GB')} <br />
                                                    {trip.time}
                                                </td>
                                                <td class={trip.status === 'booked' ? 'px-4 py-4 text-sm text-green-600 font-medium' : 'px-4 py-4 text-sm text-red-600 font-medium'}>
                                                    {trip.status === 'booked' ? 'مكتمل' : 'ملغي'}
                                                </td>
                                                <td class="px-4 py-4 h-full text-sm flex items-center justify-between">
                                                    {
                                                        trip.status === 'canceled' ? (
                                                            <button className="cursor-pointer text-blue-600 font-medium py-3">
                                                                {/* <svg width="24" height="24" fill="#5c0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#5c0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg> */}
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => {
                                                                HandleCancelReservation(trip._id)
                                                            }} class="cursor-pointer text-blue-600 font-medium py-3">
                                                                <svg width="24" height="24" fill="#5c0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#5c0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg>
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        User.role === 'admin' && (
                                                            <button onClick={() => HandleDeleteReservation(trip._id)} class="cursor-pointer text-blue-600 font-medium py-3">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#dc0404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                            </button>
                                                        )
                                                    }
                                                    <button onClick={() => {
                                                        handlePrintBookedAmenities(trip._id)
                                                    }} class="cursor-pointer text-blue-600 font-medium py-3">
                                                        <svg width={'24'} height={'24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.25 15.8011 15.329 15.6103 15.4697 15.4697C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z" fill="#000000"></path> <path d="M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z" fill="#000000"></path> <path d="M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z" fill="#000000"></path> </g></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModelOutBookings isOpen={isModelOpenReservation} onClose={HandleShowAlertModelReservation} FetchDateTrips={FetchDateTrips} />
            <ModelOutDeposits isOpen={isModelOpen} onClose={HandleShowAlertModel} FetchDateTrips={FetchDateTrips} />
        </>
    );
}

export default OutBookings;
