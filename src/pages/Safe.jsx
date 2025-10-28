import React, { use } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';
import ModelReceiptVoucher from './Components/ModelReceiptVoucher';
import ModelBillExchange from './Components/ModelBillExchange';
import { useState } from 'react';
import logo from '../assets/logo.jpg';

const Safe = ({ UserId, AllUsers }) => {
    const [dataSafe, setDataSafe] = React.useState([]);
    const [User, setUser] = React.useState([]);
    const [transactions, setTransactions] = React.useState([]);
    const [Index, setIndex] = React.useState("8YneRJ21iSYbs2puM39vnaKTqtP2");
    const [user, loading] = useAuthState(auth);
    const [reservations, setReservations] = React.useState([]);
    const [amenities, setAmenities] = React.useState([]);
    const [expensesData, setExpensesData] = React.useState([]);
    const [showModelReceiptVoucher, setShowModelReceiptVoucher] = React.useState(false);
    const [showModelBillExchange, setShowModelBillExchange] = React.useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [dataSafeAdmin, setDataSafeAdmin] = useState([]);
    const [filteredTransactionsAdmin, setFilteredAdminTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [aLoading, setALoading] = useState(false);
    const [safeResAdmin, setSafeResAdmin] = useState({});


    // Handle Show Model Receipt Voucher
    const HandleShowModelReceiptVoucher = () => {
        setShowModelReceiptVoucher(!showModelReceiptVoucher);
    }

    // Handle Show Model Bill Exchange
    const HandleShowModelBillExchange = () => {
        setShowModelBillExchange(!showModelBillExchange);
    }


    // Handle Get Data Safe
    const FetchDataSafe = async () => {
        if (!UserId) return;

        const base = import.meta.env.VITE_SOME_URL;
        const uid = UserId?.uid;

        try {
            setALoading(true);
            if (UserId?.role === "user") {
                // Get User
                const [safeRes, reservationsRes, amenitiesRes, expensesRes] = await Promise.all([
                    axios.get(`${base}/api/get-safe/${uid}`),
                    axios.get(`${base}/api/account/reservations/${uid}`),
                    axios.get(`${base}/api/account/amenities/${uid}`),
                    axios.get(`${base}/api/get-expenses/${uid}`)
                ]);

                const sortedTransactions = safeRes.data.transactions.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setDataSafe(safeRes.data);
                setTransactions(sortedTransactions);
                setReservations(reservationsRes.data);
                setAmenities(amenitiesRes.data);
                setExpensesData(expensesRes.data);
            } else {
                // Get Admin
                const [safeRes, reservationsRes, amenitiesRes, expensesRes , safeResAdmin] = await Promise.all([
                    axios.get(`${base}/api/get-safe`),
                    axios.get(`${base}/api/account/reservations/${Index}`),
                    axios.get(`${base}/api/account/amenities/${Index}`),
                    axios.get(`${base}/api/get-expenses/${Index}`),
                    axios.get(`${base}/api/get-safe/${Index}`)
                ]);

                setUser(safeRes.data);
                setDataSafeAdmin(safeRes.data.find((item) => item.uid === Index));
                setReservations(reservationsRes.data);
                setAmenities(amenitiesRes.data);
                setExpensesData(expensesRes.data);
                setSafeResAdmin(safeResAdmin.data);
            }
            setALoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setALoading(false);
        }
    };



    // Set Current Month on Load
    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];
        setFromDate(firstDay);
        setToDate(lastDay);
    }, []);



    // filter User By Month
    useEffect(() => {
        let filtered = transactions;
        let filterTypeAdmin = dataSafeAdmin?.transactions;

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            filtered = filtered.filter(t => {
                const date = new Date(t.createdAt);
                return date >= from && date <= to;
            });
            filterTypeAdmin = filterTypeAdmin?.filter(t => {
                const date = new Date(t.createdAt);
                return date >= from && date <= to;
            });
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
            filterTypeAdmin = filterTypeAdmin?.filter(t => t.type === filterType);
        }

        setFilteredTransactions(filtered);
        setFilteredAdminTransactions(filterTypeAdmin);
    }, [transactions, dataSafeAdmin?.transactions, fromDate, toDate, filterType]);


    // Filter By Month 
    const TotalProfit = User?.filter((trip) => {
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(selectedMonth);
    });

    const filteredTransactionss = reservations?.filter((trip) => {
        if (trip.status !== "booked") return false;
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(selectedMonth);
    });

    const filteredTransactionsAmenities = amenities?.filter((trip) => {
        if (trip.status !== "booked") return false;
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(selectedMonth);
    });

    const filteredTransactionsExpenses = expensesData?.filter((trip) => {
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(selectedMonth);
    });

    // Filter By Month
    const totalBalance = TotalProfit?.reduce(
        (total, trip) => total + trip.balance,
        0
    );

    const totalAmount = filteredTransactionss?.reduce(
        (total, trip) => total + trip.NetTicketPrice,
        0
    );

    const totalAmountAmenities = filteredTransactionsAmenities?.reduce(
        (total, trip) => total + trip.NetTicketPrice,
        0
    );

    const totalAmountExpenses = filteredTransactionsExpenses?.reduce(
        (total, trip) => total + trip.totalExpenses,
        0
    );

    // Handle Print 
    const handlePrint = (Data) => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>${Data?.ProcessName}</title>
            <style> 
              body { 
                font-family: "Arial", sans-serif;
                padding: 30px;
                background-color: #fff;
                color: #000;
              }
              .receipt {
                border: 2px solid #000;
                padding: 20px 30px;
                width: 750px;
                margin: auto;
                position: relative;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
              }
              .title {
                border: 2px solid #000;
                padding: 4px 20px;
                font-weight: bold;
              }
              .info {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                font-size: 16px;
              }
              .line {
                border-bottom: 1px dotted #000;
                flex: 1;
                margin: 0 5px;
                text-align: center;
              }
              .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                font-size: 14px;
              }
              .footer div {
                text-align: center;
                width: 30%;
              }
              .bottom-text {
                text-align: center;
                margin-top: 30px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div>
                  <img src="${logo}" alt="logo" style="height:50px;"/>
                  <p style="margin:0;">سوريا - دبي - الأردن - اليمن</p>
                </div>
                <div class="title">${Data?.ProcessName}</div>
                <div style="text-align:left;">
                  <p>0550603044 - 0535399886</p>
                </div>
              </div>
    
              <div class="info">
                <span>التاريخ:</span>
                <div class="line">${new Date(Data?.date).toLocaleDateString()}</div>
                <span>الرقم:</span>
                <div class="line">${Data?.phone || " "}</div>
              </div>
    
              <div class="info">
                <span>اصرفوا إلى السيد / السيدة:</span>
                <div class="line">${Data?.PersonName}</div>
              </div>
    
              <div class="info">
                <span>مبلغ وقدره:</span>
                <div class="line">${Data?.amount}</div>
              </div>
    
              <div class="info">
                <span>نقداً / شيك رقم:</span>
                <div class="line"></div>
                <span>على بنك:</span>
                <div class="line"></div>
              </div>
    
              <div class="info">
                <span>وذلك قيمة:</span>
                <div class="line">${Data?.amount}</div>
              </div>
    
              <div class="footer">
                <div>المدير</div>
                <div>المستلم</div>
                <div>أمين الصندوق</div>
              </div>
    
              <div class="bottom-text">
                الرياض - حي العزيزية - مقابل هايبر نستو
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




    // Fetch 
    useEffect(() => {
        FetchDataSafe();
    }, [UserId?.role, UserId, Index]);


    // Check Login
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);




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
                <div className="p-6 flex-col">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-bold">اجمالي المعاملات المالية</h1>
                        <div className="flex gap-2">
                            <button onClick={() => HandleShowModelReceiptVoucher()} className=" cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">أضافة سند قبض</button>
                            <button onClick={() => HandleShowModelBillExchange()} className=" cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">أضافة سند صرف</button>
                        </div>
                    </div>
                    {
                        UserId?.role === 'admin' && (
                            <div className="flex">
                                <select onChange={(e) => {
                                    setIndex(e.target.value)
                                }} name="offices" id="offices" className='p-2 w-1/5 mt-5 border border-gray-300 focus:outline-none'>
                                    {AllUsers.filter((it) => it.role === 'user')?.map((user, index) => (
                                        <option key={user.uid} value={user.uid}>{user?.OfficeName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    <div className="flex flex-col">
                        {UserId?.role === 'admin' ? (
                            <>
                                <div className=" balance mt-10 grid grid-cols-4 gap-4">
                                    <div className="flex flex-col shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-xl font-bold text-gray-600'>اجمالي الايرادات</span> <br />
                                            <span className='text-xs font-bold text-red-400 mt-3 block'>حجوزات + أمانات + سند قبض - سند صرف - مصروفات</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <label htmlFor="month" className="font-semibold">اختر الشهر:</label>
                                            <select
                                                id="month"
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('ar-EG', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <h3 className="text-2xl font-bold">
                                            {totalBalance} ر . س
                                        </h3>
                                    </div>
                                    <div className="flex flex-col shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-xl font-bold text-gray-600'> أيراد {dataSafeAdmin?.name} </span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>أجمالي الايردات</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4 h-8">
                                            <p className='font-semibold text-2xl'>رصيد الخزنة</p>
                                            {/* <label htmlFor="month" className="font-semibold">اختر الشهر:</label>
                                            <select
                                                id="month"
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('ar-EG', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select> */}
                                        </div>
                                        <h3 className={`${safeResAdmin?.balance < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold`}>
                                            {safeResAdmin?.balance} ر . س
                                        </h3>
                                    </div>
                                    <div className="flex flex-col shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-xl font-bold text-gray-600'> أيراد {dataSafeAdmin?.name} </span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>الحجوزات + الامانات</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <label htmlFor="month" className="font-semibold">اختر الشهر:</label>
                                            <select
                                                id="month"
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('ar-EG', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <h3 className="text-2xl font-bold">
                                            {totalAmountAmenities + totalAmount} ر . س
                                        </h3>
                                    </div>
                                    <div className="flex flex-col shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-xl font-bold text-gray-600'> مصروفات {dataSafeAdmin?.name} </span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>جميع معاملات المصروفات</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <label htmlFor="month" className="font-semibold">اختر الشهر:</label>
                                            <select
                                                id="month"
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="border px-2 py-1 rounded"
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {new Date(0, i).toLocaleString('ar-EG', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <h3 className="text-2xl font-bold">
                                            {totalAmountExpenses} ر . س
                                        </h3>
                                    </div>

                                </div>
                                <div className="flex flex-col mt-8">
                                    <h3 className="text-lg font-bold mb-4">جميع المعاملات المالية.</h3>
                                </div>
                                {/* FIlter By Month */}
                                <div className="flex gap-3">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={e => setFromDate(e.target.value)}
                                        className="w-1/4 p-2 border border-gray-300"
                                    />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
                                        className="w-1/4 p-2 border border-gray-300"
                                    />
                                    <select
                                        className="w-1/4 p-2 border border-gray-300"
                                        value={filterType}
                                        onChange={e => setFilterType(e.target.value)}
                                    >
                                        <option value="all">الكل</option>
                                        <option value="deposit">وارد</option>
                                        <option value="withdrawal">صادر</option>
                                    </select>
                                </div>

                                <div className="flex w-full mt-4">
                                    <div className="table w-full">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-100 whitespace-nowrap">
                                                <tr>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        #
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        اسم المكتب
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        أسم المعاملة
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        القيمة
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        نص الرسالة
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        المسار
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        التاريخ
                                                    </th>
                                                    <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                        الإجراءات
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                                {filteredTransactionsAdmin?.map((trip, index) => (
                                                    <tr>
                                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                            {trip?.OfficeName}
                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                            {trip?.ProcessName} <br />
                                                            {trip?.PersonName && `الي ${trip?.PersonName}`}

                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                            {trip?.amount} ر . س
                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                            {trip?.description}
                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                            {trip?.type === "deposit" ? "وارد" : "صادر"}
                                                        </td>
                                                        <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                            {new Date(trip?.createdAt).toLocaleDateString('en-GB')} <br />
                                                        </td>
                                                        <td class="px-4 py-4 text-sm">
                                                            <button onClick={() => handlePrint(trip)} class="cursor-pointer text-blue-600 font-medium mr-4">
                                                                أظهار
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className=" balance mt-10 grid grid-cols-4 gap-4">
                                        <div className="flex flex-col shadow p-10">
                                            <h1 className="text-2xl font-bold">الرصيد الحالي</h1>
                                            <h1 className={dataSafe.balance > 0 ? "text-2xl font-bold text-green-600" : "text-2xl font-bold text-red-600"}>{dataSafe.balance} ر . س</h1>
                                        </div>
                                        <div className="flex flex-col shadow p-10">
                                            <h1 className="text-2xl font-bold">أيراد الحجوزات</h1>
                                            <h1 className="text-2xl font-bold">
                                                {reservations?.filter((trip) => trip.status === "booked").reduce((total, trip) => total + trip.NetTicketPrice, 0)} ر . س
                                            </h1>
                                        </div>
                                        <div className="flex flex-col shadow p-10">
                                            <h3 className="text-2xl font-bold">أيراد الامانات</h3>
                                            <h1 className="text-2xl font-bold">{amenities?.filter((trip) => trip.status === "booked").reduce((total, trip) => total + trip.NetTicketPrice, 0)} ر . س</h1>
                                        </div>
                                        <div className="flex flex-col shadow p-10">
                                            <h2 className="text-2xl font-bold">المصروفات</h2>
                                            <h3 className="text-2xl font-bold">{expensesData?.reduce((total, trip) => total + trip.totalExpenses, 0)} ر . س</h3>
                                            <p className='text-sm text-red-500  font-bold mt-2'>{expensesData?.reduce((total, trip) => total + trip.invoiceValue, 0)} ر . س <span className="text-red-500 m-2">بدون ضريبة</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-8">
                                        <h3 className="text-lg font-bold mb-4">جميع المعاملات المالية.</h3>
                                    </div>
                                    {/* FIlter By Month */}
                                    <div className="flex gap-3">
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={e => setFromDate(e.target.value)}
                                            className="w-1/4 p-2 border border-gray-300"
                                        />
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={e => setToDate(e.target.value)}
                                            className="w-1/4 p-2 border border-gray-300"
                                        />
                                        <select
                                            className="w-1/4 p-2 border border-gray-300"
                                            value={filterType}
                                            onChange={e => setFilterType(e.target.value)}
                                        >
                                            <option value="all">الكل</option>
                                            <option value="deposit">وارد</option>
                                            <option value="withdrawal">صادر</option>
                                        </select>
                                    </div>

                                    <div className="flex w-full mt-2">
                                        <div className="table w-full">
                                            <table class="min-w-full divide-y divide-gray-200">
                                                <thead class="bg-gray-100 whitespace-nowrap">
                                                    <tr>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            #
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            اسم المكتب
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            أسم المعاملة
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            القيمة
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            نص الرسالة
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            المسار
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            التاريخ
                                                        </th>
                                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                            الإجراءات
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                                    {filteredTransactions?.map((trip, index) => (
                                                        <tr>
                                                            <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                                {trip?.OfficeName}
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                                {trip?.ProcessName} <br />
                                                                {trip?.PersonName && `الي ${trip?.PersonName}`}
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                                {trip?.amount} ر . س
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                                {trip?.description}
                                                            </td>
                                                            <td class={trip?.type === "deposit" ? "px-4 py-4 text-sm text-green-600 font-medium" : "px-4 py-4 text-sm text-red-600 font-medium"}>
                                                                {trip?.type === "deposit" ? "وارد" : "صادر"}
                                                            </td>
                                                            <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                                {new Date(trip?.createdAt).toLocaleDateString('en-GB')} <br />
                                                            </td>
                                                            <td class="px-4 py-4 text-sm">
                                                                <button onClick={() => handlePrint(trip)} class="cursor-pointer text-blue-600 font-medium mr-4">
                                                                    أظهار
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
            <ModelReceiptVoucher showModelReceiptVoucher={showModelReceiptVoucher} setShowModelReceiptVoucher={setShowModelReceiptVoucher} FetchDataSafe={FetchDataSafe} />
            <ModelBillExchange showModelBillExchange={showModelBillExchange} setShowModelBillExchange={setShowModelBillExchange} FetchDataSafe={FetchDataSafe} />
        </div>
    );
}

export default Safe;
