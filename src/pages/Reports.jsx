import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Reports = ({ User, AllUsers }) => {
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
    const [selectedOfficeName, setSelectedOfficeName] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [aLoading, setAloading] = useState(false);
    const [tripsData, setTripsData] = useState([]);
    const [Rvations, setRvations] = useState([]);
    const [ExpensesData, setExpensesData] = useState([]);
    const [AmenitiesData, setAmenitiesData] = useState([]);

    const FetchData = async () => {
        try {
            setAloading(true);
            const [tripsRes, reservationsRes, expensesRes, amenitiesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_SOME_URL}/api/trips`),
                axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-reservations`),
                axios.get(`${import.meta.env.VITE_SOME_URL}/api/get-expenses`),
                axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-amenities`),
            ]);

            let trips = tripsRes.data;
            let reservations = reservationsRes.data;
            let expenses = expensesRes.data;
            let amenities = amenitiesRes.data;

            // Filter by year and month
            const yearNum = Number(selectedYear);
            const monthNum = selectedMonth === 'all' ? null : Number(selectedMonth);

            const filterByDate = (arr) =>
                arr.filter((item) => {
                    const d = new Date(item.createdAt);
                    const itemYear = d.getFullYear();
                    const itemMonth = d.getMonth() + 1;
                    const matchYear = itemYear === yearNum;
                    const matchMonth = monthNum ? itemMonth === monthNum : true;
                    return matchYear && matchMonth;
                });

            trips = filterByDate(trips);
            reservations = filterByDate(reservations);
            expenses = filterByDate(expenses);
            amenities = filterByDate(amenities);

            // Filter by office name
            if (selectedOfficeName !== 'all') {
                trips = trips.filter((t) => t.uid === selectedOfficeName);
                reservations = reservations.filter((r) => r.uid === selectedOfficeName);
                expenses = expenses.filter((e) => e.uid === selectedOfficeName);
                amenities = amenities.filter((a) => a.uid === selectedOfficeName);
            }

            // Filter by type
            if (selectedType !== 'all') {
                expenses = expenses.filter((e) => e.type === selectedType);
            }

            setTripsData(trips);
            setRvations(reservations);
            setExpensesData(expenses);
            setAmenitiesData(amenities);
        } catch (error) {
            console.error(error);
            setAloading(false);
        } finally {
            setAloading(false);
        }
    };

    useEffect(() => {
        FetchData();
    }, [selectedMonth, selectedYear, selectedOfficeName, selectedType]);

    const months = [
        { value: 'all', label: 'كل الشهور' },
        { value: '1', label: 'يناير' },
        { value: '2', label: 'فبراير' },
        { value: '3', label: 'مارس' },
        { value: '4', label: 'أبريل' },
        { value: '5', label: 'مايو' },
        { value: '6', label: 'يونيو' },
        { value: '7', label: 'يوليو' },
        { value: '8', label: 'أغسطس' },
        { value: '9', label: 'سبتمبر' },
        { value: '10', label: 'أكتوبر' },
        { value: '11', label: 'نوفمبر' },
        { value: '12', label: 'ديسمبر' },
    ];

    const years = [
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' },
        { value: '2027', label: '2027' },
        { value: '2028', label: '2028' },
        { value: '2029', label: '2029' },
        { value: '2030', label: '2030' },
        { value: '2031', label: '2031' },
        { value: '2032', label: '2032' },
        { value: '2033', label: '2033' },
        { value: '2034', label: '2034' },
        { value: '2035', label: '2035' },
        { value: '2036', label: '2036' },
        { value: '2037', label: '2037' },
        { value: '2038', label: '2038' },
        { value: '2039', label: '2039' },
        { value: '2040', label: '2040' },
    ];


    // filter by type
    const types = [
        { value: 'all', label: 'كل الفواتير' },
        { value: 'purchase', label: 'مشتريات' },
        { value: 'sale', label: 'مبيعات' },
        { value: 'expense', label: 'مصروفات' },
    ];

    return (
        <div className="flex">
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
            <Sidebar />
            <div className="flex-1">
                <Header />
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">إدارة التقارير</h1>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        {/* Years */}
                        <div className="flex items-center gap-2">
                            <label>السنة:</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 w-[140px]"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Months */}
                        <div className="flex items-center gap-2">
                            <label>الشهر:</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 w-[160px]"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* المكتب */}
                        <div className="flex items-center gap-2">
                            <label>المكتب:</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 w-[180px]"
                                value={selectedOfficeName}
                                onChange={(e) => setSelectedOfficeName(e.target.value)}
                            >
                                <option value="all">كل المكاتب</option>
                                {AllUsers?.map((office) => (
                                    <option key={office.uid} value={office.uid}>
                                        {office.OfficeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* نوع الفاتورة */}
                        <div className="flex items-center gap-2">
                            <label>نوع الفاتورة:</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 w-[160px]"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {types.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* تقرير المصروفات */}
                        <div className="bg-white shadow rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">تقرير المصروفات</h2>
                            <table className="w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">أسم المكتب</th>
                                        <th className="px-4 py-2 border" >اسم الفاتورة</th>
                                        <th className="px-4 py-2 border">القيمة</th>
                                        <th className="px-4 py-2 border">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ExpensesData.map((trip, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">{trip.OfficeName}</td>
                                                <td className="px-4 py-2 border">{trip.InvoiceName}</td>
                                                <td className="px-4 py-2 border">{trip.invoiceValue}</td>
                                                <td className="px-4 py-2 border">{new Date(trip.invoiceDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    }
                                    <tr>
                                        <td className="px-4 py-2 border font-bold" colSpan="2">إجمالي المصروفات</td>
                                        <td className="px-4 py-2 border font-bold" colSpan="2">
                                            {ExpensesData.reduce((total, trip) => total + trip.invoiceValue, 0)} ر.س
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* تقرير الرحلات */}
                        <div className="bg-white shadow rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">تقرير الرحلات</h2>
                            <table className="w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">رقم الرحلة</th>
                                        <th className="px-4 py-2 border">اسم المكتب</th>
                                        <th className="px-4 py-2 border">المسار</th>
                                        <th className="px-4 py-2 border">السائق الاول</th>
                                        <th className="px-4 py-2 border">السائق الثاني</th>
                                        <th className="px-4 py-2 border">عدد المقاعد</th>
                                        <th className="px-4 py-2 border">التاريخ</th>
                                        <th className="px-4 py-2 border">الوقت</th>
                                        <th className="px-4 py-2 border">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tripsData.map((trip, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">R-{trip.busNumber}</td>
                                                <td className="px-4 py-2 border">{trip?.OfficeName}</td>
                                                <td className="px-4 py-2 border">{trip.track}</td>
                                                <td className="px-4 py-2 border">{trip.name}</td>
                                                <td className="px-4 py-2 border">{trip.name2}</td>
                                                <td className="px-4 py-2 border">{trip.seats}</td>
                                                <td className="px-4 py-2 border">{new Date(trip.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 border">{trip.time}</td>
                                                <td className={"px-4 py-2 border " + (trip.passengerSchemas?.length === trip.seats ? 'text-red-600' : 'text-green-600')}>
                                                    {
                                                        trip.passengerSchemas?.length === trip.seats
                                                            ? 'مغلقة'
                                                            : 'مفتوحة'
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* تقرير الحجوزات */}
                        <div className="bg-white shadow rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">تقرير الحجوزات</h2>
                            <table className="w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">رقم التذكرة</th>
                                        <th className="px-4 py-2 border">اسم المكتب</th>
                                        <th className="px-4 py-2 border"> الاسم</th>
                                        <th className="px-4 py-2 border">رقم المقعد</th>
                                        <th className="px-4 py-2 border">عدد الشنط</th>
                                        <th className="px-4 py-2 border">التاريخ</th>
                                        <th className="px-4 py-2 border">الوقت</th>
                                        <th className="px-4 py-2 border">السعر</th>
                                        <th className="px-4 py-2 border">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Rvations.filter((trip) => trip.type === "booked").map((trip, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">R-{trip?.ticketNumber}</td>
                                                <td className="px-4 py-2 border">{trip?.OfficeName}</td>
                                                <td className="px-4 py-2 border">{trip.name}</td>
                                                <td className="px-4 py-2 border">{trip.seat}</td>
                                                <td className="px-4 py-2 border">{trip.numberBags}</td>
                                                <td className="px-4 py-2 border">{new Date(trip.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 border">{trip.time}</td>
                                                <td className="px-4 py-2 border">{trip.NetTicketPrice} ر.س</td>
                                                <td className="px-4 py-2 border text-green-600">جاهزة</td>
                                            </tr>
                                        ))
                                    }
                                    <tr>
                                        <td className="px-4 py-2 border font-bold" colSpan="7">إجمالي الحجوزات</td>
                                        <td className="px-4 py-2 border font-bold" colSpan="2">
                                            {Rvations.filter((trip) => trip.type === "booked")?.reduce((total, trip) => total + trip.NetTicketPrice, 0)} ر.س
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* تقرير الامانات */}
                        <div className="bg-white shadow rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-3">تقرير الامانات</h2>
                            <table className="w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">#</th>
                                        <th className="px-4 py-2 border">رقم التذكرة</th>
                                        <th className="px-4 py-2 border">اسم المكتب</th>
                                        <th className="px-4 py-2 border"> الاسم</th>
                                        <th className="px-4 py-2 border">رقم المقعد</th>
                                        <th className="px-4 py-2 border">عدد الشنط</th>
                                        <th className="px-4 py-2 border">التاريخ</th>
                                        <th className="px-4 py-2 border">الوقت</th>
                                        <th className="px-4 py-2 border">الرسوم</th>
                                        <th className="px-4 py-2 border">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        AmenitiesData.filter((trip) => trip.type === "booked").map((trip, index) => (
                                            <tr key={index}>

                                                <td className="px-4 py-2 border">{index + 1}</td>
                                                <td className="px-4 py-2 border">A-{trip?.ticketNumber}</td>
                                                <td className="px-4 py-2 border">{trip?.OfficeName}</td>
                                                <td className="px-4 py-2 border">{trip.name}</td>
                                                <td className="px-4 py-2 border">{trip.seat}</td>
                                                <td className="px-4 py-2 border">{trip.numberBags}</td>
                                                <td className="px-4 py-2 border">{new Date(trip.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 border">{trip.time}</td>
                                                <td className="px-4 py-2 border">{trip.NetTicketPrice} ر.س</td>
                                                <td className="px-4 py-2 border text-green-600">جاهزة</td>
                                            </tr>
                                        ))
                                    }
                                    <tr>
                                        <td className="px-4 py-2 border font-bold" colSpan="8">إجمالي الامانات</td>
                                        <td className="px-4 py-2 border font-bold" colSpan="2">
                                            {AmenitiesData?.reduce((total, trip) => total + trip.NetTicketPrice, 0)} ر.س
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;



