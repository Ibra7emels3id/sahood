import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ModelExpenses from './Components/ModelExpenses';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';
import logo from '../assets/logo.jpg';


const Expenses = ({ AllUsers, User }) => {
    const [showModelExpenses, setShowModelExpenses] = React.useState(false);
    const [expensesData, setExpensesData] = React.useState([]);
    const [selectedMonth, setSelectedMonth] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("");
    const [AllReservations, setAllReservations] = React.useState([]);
    const [selectedOfficeName, setSelectedOfficeName] = React.useState("");
    const [user, loading] = useAuthState(auth);
    const [AllAmenities, setAllAmenities] = React.useState([]);
    const [aLoading, setALoading] = React.useState(false);



    // Fetch Data Expenses
    const FetchDateExpenses = async () => {
        if (User?.role === 'user') {
            try {
                setALoading(true);
                const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/get-expenses/${user?.uid}`);
                const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setExpensesData(data);
            } catch (error) {
                console.error(error);
                setALoading(false)
            } finally {
                setALoading(false)
            }
        } else {
            try {
                setALoading(true)
                const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/get-expenses`);
                const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setExpensesData(data);
                setALoading(false)
            } catch (error) {
                console.error(error);
                setALoading(false)
            } finally {
                setALoading(false)
            }
        }
    };

    const FetchAllReservations = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-reservations`);
            setAllReservations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const FetchAllAmenities = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/all-amenities`);
            setAllAmenities(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Set Current Month on Load
    React.useEffect(() => {
        const currentMonth = new Date().getMonth() + 1;
        setSelectedMonth(currentMonth.toString());
    }, []);


    React.useEffect(() => {
        FetchDateExpenses()
        FetchAllReservations();
        FetchAllAmenities();
    }, []);

    // Filtered Data for Expenses
    const filteredExpenses = expensesData.filter((expense) => {
        const expenseMonth = new Date(expense.createdAt).getMonth() + 1;
        const matchesMonth = selectedMonth ? expenseMonth === Number(selectedMonth) : true;
        const matchesType = selectedType ? expense.InvoiceName === selectedType : true;
        const matchesOffice = selectedOfficeName ? expense.OfficeName === selectedOfficeName : true;
        return matchesMonth && matchesType && matchesOffice;
    });

    // Handle Print Expenses
    const HandlePrintExpenses = (id) => {
        const expenseToPrint = expensesData.find(expense => expense._id === id);
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        if (expenseToPrint) {
            printWindow.document.write(`
                    <html dir="rtl" lang="ar">
                      <head>
                        <title>${expenseToPrint?.InvoiceName}</title>
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
                            <div class="title">${expenseToPrint?.InvoiceName}</div>
                            <div style="text-align:left;">
                              <p>0550603044</p>
                            </div>
                          </div>
                            <div class="info">
                            <span> اصرفوا إلى السيد / السيدة / شئ اخر</span>
                            <div class="line">${expenseToPrint?.nots}</div>
                          </div>
            
                          <div class="info">
                            <span>التاريخ:</span>
                            <div class="line">${new Date(expenseToPrint?.invoiceDate).toLocaleDateString()}</div>
                            <span>الرقم:</span>
                            <div class="line">${expenseToPrint?.phone || " "}</div>
                          </div>
                
                          <div class="info">
                            <span>مبلغ وقدره قبل الضريبة:</span>
                            <div class="line">${expenseToPrint?.invoiceValue} ريال</div>
                            <span>مبلغ وقدره بعد الضريبة:</span>
                            <div class="line">${expenseToPrint?.totalExpenses} ريال</div>
                          </div>
                
                          <div class="info">
                            <span>نقداً / بنك :</span>
                            <div class="line">${expenseToPrint.PaymentType === 'cash' ? 'نقدي' : 'بنك'}</div>
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

        }
        expenseToPrint.document.close();
        expenseToPrint.onload = () => {
            expenseToPrint.focus();
            expenseToPrint.print();
        };
    };

    // Handle Show Model Expenses
    const HandleShowModelExpenses = () => {
        setShowModelExpenses(!showModelExpenses);
    };

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
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">إدارة المصروفات</h1>
                        <p>هنا يمكنك إدارة المصروفات والإيرادات الخاصة بالشركة.</p>
                    </div>
                    <div className="my-4">
                        <button
                            onClick={HandleShowModelExpenses}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                        >
                            إضافة مصروف جديد
                        </button>
                    </div>
                </div>

                {/* Filter By Date and Select */}
                <div className="flex p-6 gap-7 flex-wrap">
                    {/* الشهر */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="month" className="font-medium">اختر الشهر:</label>
                        <select
                            id="month"
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 w-[200px]"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">كل الشهور</option>
                            <option value="1">يناير</option>
                            <option value="2">فبراير</option>
                            <option value="3">مارس</option>
                            <option value="4">أبريل</option>
                            <option value="5">مايو</option>
                            <option value="6">يونيو</option>
                            <option value="7">يوليو</option>
                            <option value="8">أغسطس</option>
                            <option value="9">سبتمبر</option>
                            <option value="10">أكتوبر</option>
                            <option value="11">نوفمبر</option>
                            <option value="12">ديسمبر</option>
                        </select>
                    </div>

                    {/* نوع الفاتورة */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="NameExpense" className="font-medium">اختر نوع الفاتورة:</label>
                        <select
                            id="NameExpense"
                            className="border bg-white border-gray-300 rounded-lg px-3 py-2 w-[200px]"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">كل الأنواع</option>
                            <option value="مصروفات ضيافة">مصروفات ضيافة</option>
                            <option value="مستلزمات المكتب">مستلزمات المكتب</option>
                            <option value="هاتف وانترنت">هاتف وانترنت</option>
                            <option value="صيانة وإصلاحات">صيانة وإصلاحات</option>
                            <option value="عمولة سائق">عمولة سائق</option>
                            <option value="عمولة مكتب">عمولة مكتب</option>
                            <option value="نظافة">نظافة</option>
                            <option value="كهرباء ومياه">كهرباء ومياه</option>
                            <option value="إيجار">إيجار</option>
                            <option value="رواتب">رواتب</option>
                            <option value="مصروفات أخرى">مصروفات أخرى</option>
                        </select>
                    </div>
                    {/* المكتب */}
                    {
                        User?.role === 'admin' && (
                            <div className="flex items-center gap-2">
                                <label htmlFor="OfficeName" className="font-medium">اختر المكتب:</label>
                                <select
                                    id="OfficeName"
                                    className="border bg-white border-gray-300 rounded-lg px-3 py-2 w-[200px]"
                                    value={selectedOfficeName}
                                    onChange={(e) => setSelectedOfficeName(e.target.value)}
                                >
                                    <option value="">كل المكاتب</option>
                                    {AllUsers.map((user) => (
                                        <option key={user.uid} value={user.OfficeName}>
                                            {user.OfficeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                </div>
                {/* Table */}
                <div className='p-6 '>
                    <div className="overflow-x-auto">
                        <table className="table-auto bg-white w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border border-gray-200">اسم المصروف</th>
                                    <th className="px-4 py-2 border border-gray-200">عن الفاتورة</th>
                                    <th className="px-4 py-2 border border-gray-200">اسم المكتب</th>
                                    <th className="px-4 py-2 border border-gray-200">نوع الدفع</th>
                                    <th className="px-4 py-2 border border-gray-200">قيمة المصروف</th>
                                    <th className="px-4 py-2 border border-gray-200">تاريخ المصروف</th>
                                    <th className="px-4 py-2 border border-gray-200">طباعة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense._id}>
                                        <td className="px-4 py-2 border border-gray-200">{expense.InvoiceName}</td>
                                        <td className="px-4 py-2 border border-gray-200">{expense?.nots}</td>
                                        <td className="px-4 py-2 border border-gray-200">{expense.OfficeName}</td>
                                        <td className="px-4 py-2 border border-gray-200">{expense.PaymentType === 'cash' ? 'نقدي' : 'بنك'}</td>
                                        <td className="px-4 py-2 border border-gray-200">
                                            {expense.invoiceValue}ر.س  بدون ضريبة  <br />
                                            <span className='text-sm text-gray-500'>{expense?.totalExpenses} ر.س  مع الضريبة </span>
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200">{expense.invoiceDate}</td>
                                        <td className="px-4 py-2 border border-gray-200 flex items-center justify-center">
                                            <button onClick={() => (
                                                HandlePrintExpenses(expense._id)
                                            )} className=" text-violet-800 bg-violet-100 cursor-pointer hover:bg-violet-200 font-bold py-2 px-4 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">إجمالي المصروفات</td>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">
                                        {filteredExpenses.reduce((sum, exp) => sum + Number(exp.invoiceValue || 0), 0)} ر.س
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">الضريبة</td>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">
                                        {(
                                            filteredExpenses.reduce((sum, exp) => sum + Number(exp.totalExpenses || 0), 0) * 0.15
                                        ).toFixed(2)}{" "}
                                        ر.س
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">إجمالي المصروف + الضريبة</td>
                                    <td className="px-4 py-2 border border-gray-200 font-bold" colSpan="3">
                                        {filteredExpenses.reduce((sum, exp) => sum + Number(exp.totalExpenses || 0), 0)} ر.س
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ModelExpenses show={showModelExpenses} onClose={HandleShowModelExpenses} FetchDateExpenses={FetchDateExpenses} />
        </div>
    );
};

export default Expenses;
