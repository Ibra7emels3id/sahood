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
    const [Index, setIndex] = React.useState("IPnYXnvjytUd8cpsCIEmQu7XtQC2");
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
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [outBookings, setOutBookings] = useState([]);

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
                const [safeRes, reservationsRes, amenitiesRes, expensesRes, outBookings] = await Promise.all([
                    axios.get(`${base}/api/get-safe/${uid}`),
                    axios.get(`${base}/api/account/reservations/${uid}`),
                    axios.get(`${base}/api/account/amenities/${uid}`),
                    axios.get(`${base}/api/get-expenses/${uid}`),
                    axios.get(`${base}/api/account/out-bookings/${uid}`)
                ]);

                const sortedTransactions = safeRes.data.transactions.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setDataSafe(safeRes.data);
                setTransactions(sortedTransactions);
                setReservations(reservationsRes.data);
                setAmenities(amenitiesRes.data);
                setExpensesData(expensesRes.data);
                setOutBookings(outBookings.data.outBookings);
            } else {
                // Get Admin
                const [safeRes, reservationsRes, amenitiesRes, expensesRes, safeResAdmin, outBookings] = await Promise.all([
                    axios.get(`${base}/api/get-safe`),
                    axios.get(`${base}/api/account/reservations/${Index}`),
                    axios.get(`${base}/api/account/amenities/${Index}`),
                    axios.get(`${base}/api/get-expenses/${Index}`),
                    axios.get(`${base}/api/get-safe/${Index}`),
                    axios.get(`${base}/api/account/out-bookings/${Index}`)
                ]);

                setUser(safeRes.data);
                setDataSafeAdmin(safeRes.data.find((item) => item.uid === Index));
                setReservations(reservationsRes.data);
                setAmenities(amenitiesRes.data);
                setExpensesData(expensesRes.data);
                setSafeResAdmin(safeResAdmin.data);
                setOutBookings(outBookings.data.outBookings);
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


    // safeResAdmin
    const month = Number(selectedMonth);

    let totalMonthBalance = 0;
    let totalMonthBalanceCash = 0;
    let totalMonthBalanceBank = 0;

    // 
    User?.forEach((safe) => {

        const monthTransactions = safe.transactions.filter((t) => {
            const date = new Date(t.createdAt);
            return date.getMonth() + 1 === month;
        });

        // 
        const officeMonthBalance = monthTransactions.reduce((sum, t) => {
            if (t.type === "deposit") return sum + t.amount;
            if (t.type === "removes") return sum - t.amount;
            return sum;
        }, 0);

        // 
        const officeMonthBalanceCash = monthTransactions.reduce((sum, t) => {
            if (t.type === "deposit" && t.PaymentType === "cash") return sum + t.amount;
            if (t.type === "removes" && t.PaymentType === "cash") return sum - t.amount;
            return sum;
        }, 0);

        // 
        const officeMonthBalanceBank = monthTransactions.reduce((sum, t) => {
            if (t.type === "deposit" && t.PaymentType === "bank") return sum + t.amount;
            if (t.type === "removes" && t.PaymentType === "bank") return sum - t.amount;
            return sum;
        }, 0);

        // 
        totalMonthBalance += officeMonthBalance;
        totalMonthBalanceCash += officeMonthBalanceCash;
        totalMonthBalanceBank += officeMonthBalanceBank;
    });

    const filteredTransactionss = reservations?.filter((trip) => {
        if (trip.status !== "booked") return false;
        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        //
        if (tripMonth !== Number(selectedMonth)) return false;
        //
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        //
        return true;
    });

    const filteredTransactionsAmenities = amenities?.filter((trip) => {
        if (trip.status !== "booked") return false;

        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        //
        if (tripMonth !== Number(selectedMonth)) return false;
        //
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        //
        return true;
    });


    const filteredTransactionsOutBookings = outBookings?.filter((trip) => {
        if (trip.status !== "booked") return false;

        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        // 
        if (tripMonth !== Number(selectedMonth)) return false;

        // 
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        // 
        return true;
    });

    const filteredTransactionsExpenses = expensesData?.filter((trip) => {
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(selectedMonth);
    });

    const totalAmount = filteredTransactionss?.reduce(
        (total, trip) => total + trip.NetTicketPrice,
        0
    );

    const TotalOutBookings = filteredTransactionsOutBookings?.reduce(
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

    // handle Date User Filter By Month and Day
    const filterDataUserReservations = reservations?.filter((trip) => {
        if (trip.status !== "booked") return false;

        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        // 
        if (tripMonth !== Number(selectedMonth)) return false;

        // 
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        // 
        return true;
    });

    // Amanities
    const filterDataUserAmenities = amenities?.filter((trip) => {
        if (trip.status !== "booked") return false;

        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        // 
        if (tripMonth !== Number(selectedMonth)) return false;

        // 
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        // 
        return true;
    });

    // Out Bookings
    const filterDataUserOutBookings = outBookings?.filter((trip) => {
        if (trip.status !== "booked") return false;

        const tripDate = new Date(trip.createdAt);
        const tripMonth = tripDate.getMonth() + 1;
        const tripDay = tripDate.getDate();
        // 
        if (tripMonth !== Number(selectedMonth)) return false;

        // 
        if (selectedDay && selectedDay !== "all") {
            return tripDay === Number(selectedDay);
        }
        // 
        return true;
    });

    // Expenses
    const filteredExpenses = expensesData?.filter((exp) => {
        const expDate = new Date(exp.createdAt);
        const expMonth = expDate.getMonth() + 1;
        const expDay = expDate.getDate();

        // 
        if (expMonth !== Number(selectedMonth)) return false;

        // 
        if (selectedDay && selectedDay !== "all" && expDay !== Number(selectedDay)) {
            return false;
        }

        return true;
    });


    const totalNetPriceReservations = filterDataUserReservations?.reduce(
        (sum, trip) => sum + Number(trip.NetTicketPrice || 0),
        0
    );

    const totalNetPriceAmenities = filterDataUserAmenities?.reduce(
        (sum, trip) => sum + Number(trip.NetTicketPrice || 0),
        0
    );

    const totalNetPriceOutBookings = filterDataUserOutBookings?.reduce(
        (sum, trip) => sum + Number(trip.NetTicketPrice || 0),
        0
    );

    const totalExpenses = filteredExpenses?.reduce(
        (sum, exp) => sum + Number(exp.totalExpenses || 0),
        0
    );

    const totalCashExpenses = filteredExpenses
        ?.filter((exp) => exp.PaymentType === "cash")
        .reduce((sum, exp) => sum + Number(exp.totalExpenses || 0), 0);

    const totalBankExpenses = filteredExpenses
        ?.filter((exp) => exp.PaymentType === "bank")
        .reduce((sum, exp) => sum + Number(exp.totalExpenses || 0), 0);


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
                  <p>0550603044</p>
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
                <div class="line">${Data?.amount} ريال</div>
              </div>
    
              <div class="info">
                <span>نقداً / شيك رقم:</span>
                <div class="line"></div>
                <span>على بنك:</span>
                <div class="line"></div>
              </div>
    
              <div class="info">
                <span>ملاحظة:</span>
                <div class="line">${Data?.description}</div>
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
                    <div className="flex gap-4">
                        {
                            UserId?.role === 'admin' && (
                                <select onChange={(e) => {
                                    setIndex(e.target.value)
                                }} name="offices" value={Index} id="offices" className=' bg-white rounded p-2 w-1/5 mt-5 border border-gray-300 focus:outline-none'>
                                    {AllUsers?.map((user, index) => (
                                        <option key={index} value={user.uid}>{user?.OfficeName}</option>
                                    ))}
                                </select>
                            )}
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className=' bg-white rounded p-2 w-1/5 mt-5 border border-gray-300 focus:outline-none'
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('ar-EG', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                        {/* day */}
                        <select
                            id="day"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className=' bg-white rounded p-2 w-1/5 mt-5 border border-gray-300 focus:outline-none'
                        >
                            <option value="all">كل الايام</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        {UserId?.role === 'admin' ? (
                            <>
                                <div className=" balance mt-10 grid grid-cols-4 gap-4">
                                    <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'>اجمالي الايرادات الكلية</span> <br />
                                            <span className='text-xs font-bold text-red-400 mt-3 block'>حجوزات + أمانات + سند قبض - سند صرف - مصروفات</span>
                                        </h3>
                                        <h3 className={`${totalMonthBalance < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold mt-2`}>
                                            {totalMonthBalance} ر . س
                                        </h3>
                                        <div className="flex justify-between align-center mt-2">
                                            {/* <p className={`${totalMonthBalanceBank < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                <span className='text-black'>بنك:</span> {totalMonthBalanceBank} ر . س
                                            </p>
                                            <p className={`${totalMonthBalanceCash < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                <span className='text-black'>نقدي:</span> {totalMonthBalanceCash} ر . س
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> أجمالي خزنة {dataSafeAdmin?.name}</span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>أجمالي رصيد الخزنة الكلي</span>
                                        </h3>
                                        <p className={`${safeResAdmin.balance < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold`}>
                                            {safeResAdmin.balance} ر . س
                                        </p>
                                        <div className="flex justify-between align-center mt-2">
                                            <p className={`${safeResAdmin.bank < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                <span className='text-black'>بنك:</span> {safeResAdmin.bank} ر . س
                                            </p>
                                            <p className={`${safeResAdmin.cash < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                <span className='text-black'>كاش:</span> {safeResAdmin.cash} ر . س
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> أيراد {dataSafeAdmin?.name} </span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>الحجوزات + الامانات + مكتب خارجي</span>
                                        </h3>
                                        <h3 className="text-2xl font-bold">
                                            {totalAmountAmenities + totalAmount + TotalOutBookings} ر . س
                                        </h3>
                                        <div className="flex justify-between align-center mt-3">
                                            <p className={`${totalAmount < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                {totalAmount} ر . س
                                            </p>
                                            <p className={`${totalAmountAmenities < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                {totalAmountAmenities} ر . س
                                            </p>
                                            <p className={`${TotalOutBookings < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                {TotalOutBookings} ر . س
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                        <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> مصروفات {dataSafeAdmin?.name} </span> <br />
                                            <span className='text-xs font-bold text-red-400 my-4 block'>جميع معاملات المصروفات</span>
                                        </h3>
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
                                        className="w-1/4 p-2 bg-white  border border-gray-300"
                                    />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
                                        className="w-1/4 p-2 border bg-white border-gray-300"
                                    />
                                    <select
                                        className="w-1/4 p-2 border bg-white border-gray-300"
                                        value={filterType}
                                        onChange={e => setFilterType(e.target.value)}
                                    >
                                        <option value="all">الكل</option>
                                        <option value="deposit">وارد</option>
                                        <option value="removes">صادر</option>
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
                                                        نوع المعاملة
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
                                                {filteredTransactionsAdmin?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((trip, index) => (
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
                                                            {trip?.PaymentType === "cash" ? "نقدي" : "بنك"}
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
                            : (
                                <>
                                    <div className=" balance mt-10 grid grid-cols-3 gap-4">
                                        <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                            <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> أجمالي الخزنة {dataSafeAdmin?.name}</span> <br />
                                                <span className='text-xs font-bold text-red-400 my-4 block'>أجمالي رصيد الخزنة الكلي</span>
                                            </h3>
                                            <p className={`${dataSafe.balance < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold`}>
                                                {dataSafe.balance} ر . س
                                            </p>
                                            <div className="flex justify-between align-center mt-4">
                                                <p className={`${dataSafe.bank < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    <span className='text-black'>بنك:</span> {dataSafe.bank} ر . س
                                                </p>
                                                <p className={`${dataSafe.cash < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    <span className='text-black'>كاش:</span> {dataSafe.cash} ر . س
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                            <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> أجمالي الايراد خلال الشهر</span> <br />
                                                <span className='text-xs font-bold text-red-400 my-4 block'>حجوزات + أمانات + مكتب جارجي</span>
                                            </h3>
                                            <p className={`${totalNetPriceReservations + totalNetPriceAmenities + totalNetPriceOutBookings < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold`}>
                                                {totalNetPriceReservations + totalNetPriceAmenities + totalNetPriceOutBookings} ر . س
                                            </p>
                                            <div className="flex justify-between align-center mt-4">
                                                <p className={`${totalNetPriceReservations < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    {totalNetPriceReservations} ر . س
                                                </p>
                                                <p className={`${totalNetPriceAmenities < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    {totalNetPriceAmenities} ر . س
                                                </p>
                                                <p className={`${totalNetPriceOutBookings < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    {totalNetPriceOutBookings} ر . س
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col bg-white rounded-md shadow p-5 border border-gray-300">
                                            <h3 className="text-1xl font-bold"><span className='text-lg font-bold text-gray-600'> أجمالي المصروفات {dataSafeAdmin?.name}</span> <br />
                                                <span className='text-xs font-bold text-red-400 my-4 block'>أجمالي المصروفات المالية</span>
                                            </h3>
                                            <p className={`${totalExpenses < 0 ? 'text-red-600' : 'text-green-600'} text-2xl font-bold`}>
                                                {totalExpenses} ر . س
                                            </p>
                                            <div className="flex justify-between align-center mt-4">
                                                <p className={`${totalBankExpenses < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    <span className='text-black'>بنك:</span> {totalBankExpenses} ر . س
                                                </p>
                                                <p className={`${totalCashExpenses < 0 ? 'text-red-600' : 'text-green-600'} text-sm font-bold`}>
                                                    <span className='text-black'>كاش:</span> {totalCashExpenses} ر . س
                                                </p>
                                            </div>
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
                                            className="w-1/4 p-2 border border-gray-300 bg-white"
                                        />
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={e => setToDate(e.target.value)}
                                            className="w-1/4 p-2 border border-gray-300 bg-white"
                                        />
                                        <select
                                            className="w-1/4 p-2 border border-gray-300 bg-white"
                                            value={filterType}
                                            onChange={e => setFilterType(e.target.value)}
                                        >
                                            <option value="all">الكل</option>
                                            <option value="deposit">وارد</option>
                                            <option value="removes">صادر</option>
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
