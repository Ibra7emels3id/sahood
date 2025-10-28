import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router';
import logo from '../assets/logo.jpg';


const Bookings = ({ User, AllUsers }) => {
    const [Rvations, setReservations] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [user, loading] = useAuthState(auth)
    const [filterMonth, setFilterMonth] = React.useState(new Date().getMonth() + 1);
    const [filterOfficeName, setFilterOfficeName] = React.useState('all');
    const [aLoading, setALoading] = React.useState(false);



    // Handle Fetch Trips Data from API
    const FetchDateReservations = async () => {
        if (User) {
            if (User?.role === "admin") {
                try {
                    setALoading(true);
                    const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-reservations`);
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
                    setALoading(false);
                } finally {
                    setALoading(false);
                }
            } else {
                try {
                    setALoading(true);
                    const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/account/reservations/${user?.uid}`);
                    const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    let filteredData = data;
                    // filter By Month
                    if (filterMonth && filterMonth !== "all") {
                        filteredData = filteredData.filter(
                            (item) => new Date(item.createdAt).getMonth() + 1 === Number(filterMonth)
                        );
                    }
                    // Filter By search
                    if (search.trim() !== "") {
                        filteredData = filteredData.filter((item) =>
                            String(item?.ticketNumber || "").includes(search)
                        );
                    }
                    setReservations(filteredData);
                } catch (error) {
                    console.error(error);
                    setALoading(false);
                } finally {
                    setALoading(false);
                }
            }
        }
    }


    // Print Ticket
    const handlePrint = (id) => {
        const reservation = Rvations.find(r => r._id === id);
        if (!reservation) {
            console.error("Reservation not found");
            return;
        }

        // ✅ تنظيف الوقت وتحويله لصيغة مناسبة
        let timeString = reservation.time?.trim() || "00:00";

        // لو الوقت فيه AM/PM نحوله لـ 24 ساعة
        let date;
        if (/am|pm/i.test(timeString)) {
            date = new Date(`1970-01-01 ${timeString}`);
        } else {
            date = new Date(`1970-01-01T${timeString}:00`);
        }

        // ✅ لو التاريخ مش صالح، نرجع "غير معروف"
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
              body { font-family: Arial, sans-serif; text-align: center; }
              .ticket { border: 2px dashed #000; padding: 20px; margin: 20px; }
              h2 { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div id="ticket" style="width:800px; border:2px solid #000; padding:15px; font-family:Arial; direction:rtl; text-align:right">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <img src="${logo}" alt="logo" style="height:50px;"/>
                <p>009665678901 - 009665678901</p>
                <span>International Transport</span>
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
                <p style="font-size:16px; width:160px;">رقم المقعد: ${reservation.seat}</p>
                <p style="font-size:15px; width:170px;">المسار: ${reservation.track}</p>
                <p style="font-size:15px; width:170px;">رقم الباص: ${reservation.busNumber}</p>
                <p style="font-size:15px; width:180px;">الوقت: ${reservation.time}</p>
              </div>
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
                    <p style="font-size:16px; width:160px;">التاريخ: ${new Date(reservation.date).toLocaleDateString('ar-EG')}</p>
                    <p style="font-size:15px; width:170px;">وقت الحضور: ${arrivalTime}</p>
                    <p style="font-size:15px; width:170px;">المكتب: ${reservation.OfficeName}</p>
                    <p style="font-size:15px; width:170px;">السعر: ${reservation.price} ريال</p>
                    </div>
                <div style=" display:flex; justify-content:space-between; width:97%;">
                    <p style="margin-top:20px; font-size:18px;">ختم وتوقيع الوكيل ومصدر التذكرة</p>
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
                    <div className="flex justify-between items-center">
                        {/* <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="أبحث باستخدام رقم الرحلة" className="border border-gray-300 rounded-md px-4 w-[300px] outline-none py-2" /> */}
                    </div>
                    <div className="table w-full mt-3">
                        {/* Filter By month and OfficeName */}
                        <div className="flex justify-between items-center mb-4">
                            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="أبحث باستخدام رقم التذكرة" className="border border-gray-300 rounded-md px-4 w-[300px] outline-none py-2" />
                            <div className=" flex justify-end gap-4">
                                <select onChange={(e) => setFilterMonth(e.target.value)}
                                    value={filterMonth} className="border border-gray-300 rounded-md px-4 py-2 outline-none w-[250px]">
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
                                        <select onChange={(e) => setFilterOfficeName(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 outline-none ml-4 w-[250px]">
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
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أسم المكتب</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أسم العميل</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجواز</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المقعد</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الحجز</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الحجز</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">طباعة التذكرة</th>
                                    {User?.role === "admin" && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حذف الحجز</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Rvations?.map((reservation, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.ticketNumber}#</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.OfficeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.passport}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.seat || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.createdAt).toLocaleDateString()}</td>
                                        <td className={`${reservation.status === 'booked' ? 'text-green-500' : 'text-red-500'} px-6 py-4 whitespace-nowrap`}>{reservation.status === 'booked' ? 'محجوز' : 'ملغي'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => {
                                                handlePrint(reservation?._id)
                                            }} className="text-blue-600 cursor-pointer hover:text-blue-900">طباعة</button>
                                        </td>
                                        {
                                            User?.role === "admin" && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button onClick={() => {
                                                        // handleDelete(reservation?._id)
                                                    }} className="text-red-600 cursor-pointer hover:text-red-900">حذف</button>
                                                </td>
                                            )
                                        }
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

export default Bookings;
