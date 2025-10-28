import axios from 'axios';
import React, { useEffect } from 'react';
import { auth } from '../../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';
import logo from '../../assets/logo.jpg';

const ModelReceiptVoucher = ({ showModelReceiptVoucher, setShowModelReceiptVoucher, FetchDataSafe }) => {
    const [FormData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [user] = useAuthState(auth);


    // Handle Print
    const handlePrint = (Data) => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
    <html dir="rtl" lang="ar">
      <head>
        <title>سند قبض</title>
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
            <div class="title">سند صرف</div>
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
            <div class="line">${Data?.name}</div>
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


    // Handle Submit
    const HandleSubmitData = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`${import.meta.env.VITE_SOME_URL}/api/receipt-voucher/${user.uid}`, FormData);
            toast.success(res.data.message);
            handlePrint(FormData);
            setShowModelReceiptVoucher(false);
            FetchDataSafe();
            setFormData({
                name: "",
                amount: "",
                date: "",
                phone: "",
                description: "",
                ProcessName: "",
            })
            setLoading(false);
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    }




    // Show Hide Model Scroll
    useEffect(() => {
        if (showModelReceiptVoucher) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showModelReceiptVoucher]);


    return (
        <div className={showModelReceiptVoucher ? 'block' : 'hidden'}>
            <div class="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto">
                <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-8 relative">
                    <svg onClick={() => setShowModelReceiptVoucher(false)} id="closeIcon" xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 cursor-pointer shrink-0 fill-gray-800 hover:fill-red-500 float-right"
                        viewBox="0 0 320.591 320.591">
                        <path
                            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                            data-original="#000000"></path>
                        <path
                            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                            data-original="#000000"></path>
                    </svg>
                    <form onSubmit={HandleSubmitData}>
                        <div class="mt-8 text-center">
                            <h4 class="text-2xl text-slate-900 font-semibold">أضافة بيانات سند قبض</h4>
                            <input onChange={(e) => setFormData({ ...FormData, name: e.target.value })} value={FormData.name} type="text" placeholder="أدخل الاسم" value={FormData.name} className="px-4 py-2.5 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-blue-600 rounded-md" />
                            <input onChange={(e) => setFormData({ ...FormData, amount: e.target.value })} value={FormData.amount} type="number" placeholder="قيمة الفاتورة" value={FormData.price} className="px-4 py-2.5 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-blue-600 rounded-md" />
                            <select onChange={(e) => setFormData({ ...FormData, ProcessName: e.target.value })} value={FormData.ProcessName} name="type" className="px-4 py-2.5 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-blue-600 rounded-md" id="">
                                <option hidden>نوع الفاتورة</option>
                                <option value="cash">نقدا</option>
                                <option value="bank">بنكي</option>
                            </select>
                            <input onChange={(e) => setFormData({ ...FormData, date: e.target.value })} value={FormData.date} type="date" placeholder="تاريخ الفاتورة" value={FormData.date} className="px-4 py-2.5 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-blue-600 rounded-md" />
                            <textarea onChange={(e) => setFormData({ ...FormData, description: e.target.value })} value={FormData.description} name="description" cols="30" rows="3" placeholder="ملاحظات" className="px-4 py-2.5 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-blue-600 rounded-md" id=""></textarea>
                        </div>
                        {
                            loading ? (
                                <button disabled class="mt-6 px-5 py-2.5 w-full rounded-md text-white text-sm font-medium outline-none bg-blue-600 hover:bg-blue-700 cursor-not-allowed">تحميل...</button>
                            ) : (
                                <button type="submit" class="mt-6 px-5 py-2.5 cursor-pointer w-full rounded-md text-white text-sm font-medium outline-none bg-blue-600 hover:bg-blue-700">أضافة البيانات</button>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModelReceiptVoucher;
