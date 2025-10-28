import axios from 'axios';
import React, { use } from 'react';
import { toast } from 'sonner';
import { auth } from '../../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const ModelExpenses = ({ show, onClose, FetchDateExpenses }) => {
    const [formData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [user] = useAuthState(auth);


    // Add To Expenses
    const HandleAddExpenses = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_SOME_URL}/api/add-expenses`, {
                ...formData,
                uid: user.uid,
                OfficeName: user.displayName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success(res.data.message);
            FetchDateExpenses();
            onClose();
            setFormData({
                InvoiceName: "",
                invoiceValue: "",
                invoiceDate: ""
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("حدث خطأ ما، حاول مرة أخرى");
            setLoading(false);
        }
    };


    // 
    useEffect(() => {
        setFormData({ ...formData, totalExpenses: Math.round(Number(formData.invoiceValue) * 1.15) || 0 });
    }, [formData.invoiceValue])





    return (
        <div className={` ${show ? 'block' : 'hidden'}`}>
            <div>
                <div id="modal">
                    <div class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                        <div class="w-full max-w-2xl bg-white shadow-lg rounded-md p-8 relative">
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
                                <h4 class="text-2xl text-slate-900 font-semibold">ادخل بيانات المصروف</h4>
                                <form onSubmit={HandleAddExpenses} class="mt-6">
                                    <div class="grid grid-cols-1 mt-6 gap-4">
                                        <div className='flex flex-col items-start' >
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">أسم الفاتورة</label>
                                            <select onChange={(e) => setFormData({ ...formData, InvoiceName: e.target.value })} value={formData.InvoiceName} name="NameExpense" id="NameExpense" className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none'>
                                                <option selected >أختر نوع الفاتورة</option>
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
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">قيمة الفاتورة</label>
                                            <input onChange={(e) => setFormData({ ...formData, invoiceValue: Number(e.target.value) })} value={formData.invoiceValue || ''} type="number" placeholder="قمية الفاتورة"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">القيمة المضافة</label>
                                            <p className='text-slate-900 text-sm mb-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-start p-3 font-bold'>%15</p>
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">أجمالي الفاتورة</label>
                                            <p className='text-slate-900 text-sm mb-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-start p-3 font-bold'>{Math.round(Number(formData.invoiceValue) * 1.15) || 0}</p>
                                        </div>
                                        <div className='flex flex-col items-start '>
                                            <label class="text-slate-900 text-sm font-medium mb-2 block">تاريخ الفاتورة</label>
                                            <input onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} value={formData.invoiceDate || ''} type="date" placeholder="تاريخ الفاتورة"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    {
                                        loading ? (
                                            <button disabled type="submit" class="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-not-allowed">
                                                جاري الأضافة...
                                            </button>
                                        ) : (
                                            <button type="submit" class="mt-6 cursor-pointer w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                                اضافة
                                            </button>
                                        )
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

export default ModelExpenses;
