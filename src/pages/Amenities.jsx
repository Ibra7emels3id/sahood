import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router';
import logo from '../assets/logo.jpg';

const Amenities = ({ User, AllUsers }) => {
    const [Rvations, setReservations] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [user, loading] = useAuthState(auth)
    const [filterMonth, setFilterMonth] = React.useState(new Date().getMonth() + 1);
    const [filterOfficeName, setFilterOfficeName] = React.useState('all');
    const [aLoading, setaLoading] = React.useState(false);


    // Handle Fetch Trips Data from API
    const FetchDateReservations = async () => {
        if (User) {
            if (User?.role === "admin") {
                try {
                    setaLoading(true);
                    const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-amenities`);
                    let DataSort = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    let data = [];
                    // filter By Month
                    if (!filterMonth || filterMonth === "all") {
                        // All month
                        data = DataSort;
                    } else {
                        // filter By month Now
                        data = DataSort.filter(
                            (item) => new Date(item.createdAt).getMonth() + 1 === Number(filterMonth)
                        );
                    }
                    // filter By OfficeName
                    if (filterOfficeName && filterOfficeName !== "all") {
                        data = data.filter(
                            (item) => item.uid === filterOfficeName
                        );
                    }
                    // filter By search
                    let filteredData;
                    if (search === "") {
                        filteredData = data;
                    } else {
                        filteredData = data.filter((item) =>
                            String(item?.ticketNumber || "").includes(search)
                        );
                    }
                    setReservations(filteredData);
                } catch (error) {
                    console.error(error);
                    setaLoading(false);
                } finally {
                    setaLoading(false);
                }
            } else {
                try {
                    setaLoading(true);
                    const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/account/amenities/${user?.uid}`);
                    const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    let filteredData = data;
                    // Filter By Month
                    if (filterMonth && filterMonth !== "all") {
                        filteredData = filteredData.filter(
                            (item) => new Date(item.createdAt).getMonth() + 1 === Number(filterMonth)
                        );
                    }
                    // Filter By Search
                    if (search.trim() !== "") {
                        filteredData = filteredData.filter((item) =>
                            String(item?.ticketNumber || "").includes(search)
                        );
                    }
                    setReservations(filteredData);
                    setaLoading(false);
                } catch (error) {
                    console.error(error);
                    setaLoading(false);
                } finally {
                    setaLoading(false);
                }
            }
        }
    }


    // Handle Print
    const handlePrintAmenit = (id) => {
            const reservation = Rvations.find(r => r._id === id) || Rvations.find(r => r._id === id);
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
                <p>0535399886 - 0550603044</p>
                <span>حافلة سهود للنقل البري </span>
              </div>
              <hr/>
              <h2 style="margin:20px 0;">تذكرة وزن زائد</h2>
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
              <p style="font-size:15px; width:180px;">رقم التذكرة: ${reservation.ticketNumber}</p>
              <p style="font-size:16px; width:160px;">أسم المرسل: ${reservation.name || "-"}</p>
              <p style="font-size:15px; width:180px;">اسم المستلم: ${reservation.RecipientName}</p>
                <p style="font-size:15px; width:170px;">رقم المرسل: ${reservation.phone}</p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                <p style="font-size:15px; width:170px;">رقم المستلم: ${reservation.passport || "-"}</p>
                <p style="font-size:15px; width:170px;">المسار: ${reservation.track || "-"}</p>
                <p style="font-size:15px; width:170px;">الوجهة: ${reservation.destination || "-"}</p>
                <p style="font-size:15px; width:170px;">السعر: ${reservation.price || "-"} ريال</p>
              </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                    <p style="font-size:16px; width:160px;">التاريخ: ${new Date(reservation.date).toLocaleDateString('ar-EG')}</p>
                    <p style="font-size:15px; width:180px;">الوقت: ${reservation.time}</p>
                    <p style="font-size:15px; width:170px;">وقت الحضور: ${arrivalTime}</p>
                    <p style="font-size:15px; width:170px;">المكتب: ${reservation.OfficeName}</p>
                    </div>
                <div style=" display:flex; justify-content:space-between; width:97%;">
                    <p style="font-size:12px;">رقم الباص: ${reservation.busNumber}</p>
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


    // Fetch Trips Data from API
    useEffect(() => {
        FetchDateReservations()
    }, [User?.role, search, filterMonth, filterOfficeName]);


    // Check Login 
    useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);


    return (    
        <div className="flex">
            {loading && (
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
            <Sidebar />
            <div className="flex-1">
                <Header />
                <div className="p-6 flex-col">
                    <div className="table w-full mt-3">
                        {/* Filter By month and OfficeName */}
                        <div className="flex justify-between items-center mb-4">
                            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="أبحث باستخدام رقم التذكرة" className="border bg-white border-gray-300 rounded-md px-4 w-[300px] outline-none py-2" />
                            <div className=" flex justify-end gap-4">
                                <select onChange={(e) => setFilterMonth(e.target.value)}
                                    value={filterMonth} className="border bg-white border-gray-300 rounded-md px-4 py-2 outline-none w-[250px]">
                                    <option value="all">كل الشهور</option>
                                    <option value="1">يناير</option>
                                    <option value="2">فبراير</option>
                                    <option value="3">مارس</option>
                                    <option value="4">ابريل</option>
                                    <option value="5">مايو</option>
                                    <option value="6">يونيو</option>
                                    <option value="7">يوليو</option>
                                    <option value="8">اغسطس</option>
                                    <option value="9">سبتمبر</option>
                                    <option value="10">اكتوبر</option>
                                    <option value="11">نوفمبر</option>
                                    <option value="12">ديسمبر</option>
                                </select>
                                {
                                    User?.role === "admin" && (
                                        <select onChange={(e) => setFilterOfficeName(e.target.value)} className="border bg-white border-gray-300 rounded-md px-4 py-2 outline-none ml-4 w-[250px]">
                                            {User?.role === "admin" ? (
                                                <>
                                                    <option value="all">كل المكاتب</option>
                                                    {AllUsers?.map((office) => (
                                                        <option key={office.uid} value={office.uid}>
                                                            {office.OfficeName}
                                                        </option>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <option value={User?.officeName}>{User?.officeName}</option>
                                                </>
                                            )}
                                        </select>
                                    )
                                }
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-100 whitespace-nowrap">
                                <tr>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        رقم الرحلة
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        رقم التذكرة
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        أسم المكتب
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        السائق
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        المسار
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        التاريخ
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        السعر
                                    </th>
                                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                {Rvations.map((trip, index) => (
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {trip.busNumber}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {trip.ticketNumber}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {trip.OfficeName}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {trip.name}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {trip.track}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(trip.date).toLocaleDateString('en-GB')} <br />
                                            {trip.time}PM
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                                            {trip.NetTicketPrice} ر.س
                                        </td>
                                        <td className={trip.status === "booked" ? "px-4 py-4 text-sm text-green-600 font-medium" : "px-4 py-4 text-sm text-red-600 font-medium"}>
                                            {trip.status === "booked" ? "محجوز" : "غير محجوز"}
                                        </td>
                                        <td className="px-4 flex items-center justify-center py-4 text-sm">
                                            <button onClick={() => handlePrintAmenit(trip._id)} type='button' className="cursor-pointer text-blue-600 font-medium flex item-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                                </svg>
                                            </button>
                                        </td>
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

export default Amenities;
