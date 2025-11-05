import React, { use } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ModelTicketReservation from './Components/ModelTicketReservation';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ModelSecretariatReservation from './Components/ModelSecretariatReservation';
import logo from '../assets/logo.jpg';
import { toast } from 'sonner';
import Loading from './Components/Loading';


const BusId = ({ User }) => {
    const [openSeatModel, setOpenSeatModel] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [tripData, setTripData] = React.useState({});
    const { id } = useParams();
    const [user, loading] = useAuthState(auth);
    const [openSecretariatModel, setOpenSecretariatModel] = React.useState(false);
    const [LoadingAmenity, setLoadingAmenity] = React.useState(false);
    const [FilterAmenity, setFilterAmenity] = React.useState([]);
    const [FilterSecretariat, setFilterSecretariat] = React.useState(null);
    const [aLoading, setALoading] = React.useState(false);



    // Handle Sort Form Date
    const passenger = tripData?.passengerSchemas?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const Secretariat = tripData?.deposits?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get Data Ticket
    const FetchDateTrips = async () => {
        try {
            setALoading(true);
            const res = await axios.get(`${import.meta.env.VITE_SOME_URL}/api/trips/${id}`);
            setTripData(res.data);
            setALoading(false);
        } catch (error) {
            console.error(error);
            setALoading(false);
        } finally {
            setALoading(false);
        }
    }

    // Handle Filter Amenities
    const handleFilterPassenger = () => {
        const filteredAmenity = passenger?.filter((item) => item.status === 'booked');
        const filteredSecretariat = Secretariat?.filter((item) => item.status === 'booked');
        setFilterAmenity(filteredSecretariat);
        setFilterSecretariat(filteredAmenity);
    }

    const handlePrint = (id) => {
        const reservation = passenger.find(r => r._id === id) || Secretariat.find(r => r._id === id);
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
          <h2 style="margin:20px 0;">تذكرة حجز مقعد في الحافلة</h2>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
          <p style="font-size:15px; width:180px;">رقم التذكرة: ${reservation.ticketNumber}</p>
            <p style="font-size:16px; width:160px;">الاسم: ${reservation.name || "-"}</p>
            <p style="font-size:15px; width:170px;">الجوال: ${reservation.phone}</p>
            <p style="font-size:15px; width:170px;">رقم الجواز: ${reservation.passport || "-"}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:10px;">
            <p style="font-size:16px; width:160px;">رقم المقعد: ${reservation.seat || "-"}</p>
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
                <p style="margin-top:20px; font-size:12px;">${new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p style="font-size:12px;">رقم الباص: ${reservation.busNumber}</p>
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

    const handlePrintAmenit = (id) => {
        const reservation = passenger.find(r => r._id === id) || Secretariat.find(r => r._id === id);
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
            <span>حافلة سهود للنقل البري</span>
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

    // Handle Cancel Reservation
    const HandleDeletePassenger = async (seat) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SOME_URL}/api/trips/${id}/bus-seat/${seat}/${user.uid}`);
            toast.success(res.data.message);
            FetchDateTrips();
        } catch (error) {
            console.error(error);
        }
    }

    // Handle Cancel Reservation
    const handleDeleteAmenity = async (amenity) => {
        try {
            setLoadingAmenity(true);
            const res = await axios.delete(`${import.meta.env.VITE_SOME_URL}/api/trips/${id}/amenities/${amenity}/${user.uid}`);
            toast.success(res.data.message);
            FetchDateTrips();
            setLoadingAmenity(false);
        } catch (error) {
            console.error(error);
            setLoadingAmenity(false);
        }
    }

    // Print All Reservations
    const HandlePrintReservations = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
  <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>تذكرة الباص</title>
      <style>
        body { font-family: "Arial", sans-serif; direction: rtl; text-align: right; margin: 10px; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .header img { height: 60px; }
        .header .title { text-align: center; font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; text-align: center; }
        th, td { border: 1px solid #000; padding: 6px; }
        h3 { margin-top: 20px; text-align: center; }
        .info { margin-top: 10px; display: flex; justify-content: space-between; font-size: 14px; }
        .stamp { margin-top: 40px; text-align: center; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${logo}" alt="logo" />
        <p style="text-align: center; font-size: 18px; font-weight: bold;">0535399886 - 0550603044</p>
        <div style="text-align: end; font-size: 24px; font-weight: bold; class="title">شركة حافلة سهود للنقل الدولي</div>
      </div>

      <div class="info">
        <div>السائق الأول: ${tripData?.name}</div>
        <div>السائق الثاني: ${tripData?.name2}</div>
      </div>
      <div class="info">
        <div>تاريخ: ${new Date(tripData?.date).toLocaleDateString()}</div>
        <div>رقم الرحلة: ${tripData?.busNumber} أ</div>
        <div>المسار: ${tripData?.track}</div>
      </div>

        <table>
            <thead>
                <tr>
            <th>م</th>
            <th>رقم التذكرة</th>
            <th>الاسم</th>
            <th>الجنسية</th>
            <th>رقم الجواز</th>
            <th>الميلاد</th>
            <th>المسار</th>
            <th>الوجهة</th>
            <th>ملاحظة</th>
          </tr>
        </thead>
        <tbody>
          ${FilterSecretariat?.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${r.ticketNumber}</td>
              <td>${r.name}</td>
              <td>${r.typeSix || "-"}</td>
              <td>${r.passport || "-"}</td>
              <td>${r.BirthDate || "-"}</td>
              <td>${r.track || "-"}</td>
              <td>${r.destination || "-"}</td>
              <td style="text-align: center; width: 100px">${""}</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
        </tbody>
      </table>
    </body>
  </html>
  `);

        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    // Print All Amenities
    const HandlePrintAmenities = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=800');
        printWindow.document.write(`
  <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>بيانات التذاكر ${new Date(tripData?.date).toLocaleDateString()}</title>
      <style>
        body { font-family: "Arial", sans-serif; direction: rtl; text-align: right; margin: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .header img { height: 60px; }
        .header .title { text-align: center; font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
        th, td { border: 1px solid #000; padding: 6px; }
        h3 { margin-top: 20px; text-align: center; }
        .info { margin-top: 10px; display: flex; justify-content: space-between; font-size: 14px; }
        .stamp { margin-top: 40px; text-align: center; font-size: 13px; }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;" class="header">
        <img src="${logo}" alt="logo" />
        <p style="text-align: center; font-size: 18px; font-weight: bold;">0535399886 - 0550603044</p>
        <div class="title" style="; font-size: 24px; font-weight: bold;">شركة حافلة سهود للنقل الدولي</div>
      </div>

      <div class="info">
        <div>السائق الأول: ${tripData?.name}</div>
        <div>السائق الثاني: ${tripData?.name2}</div>
      </div>
      <div class="info">
        <div>تاريخ: ${new Date(tripData?.date).toLocaleDateString()}</div>
        <div>رقم الرحلة: ${tripData?.busNumber} أ</div>
        <div>المسار: ${tripData?.track}</div>
      </div>

      <table style="text-align: center;">
        <thead>
          <tr>
            <th>#</th>
            <th>رقم التذكرة</th>
            <th>أسم المرسل</th>
            <th>اسم المستلم</th>
            <th>رقم المرسل</th>
            <th>رقم المستلم</th>
            <th>المسار</th>
            <th>الوجهة</th>
            <th>نوع الامانة</th>
          </tr>
        </thead>
        <tbody>
          ${FilterAmenity?.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${r.ticketNumber}</td>
              <td>${r.name}</td>
              <td>${r.RecipientName}</td>
              <td>${r.phone || "-"}</td>
              <td>${r.passport || "-"}</td>
              <td>${r.track || "-"}</td>
              <td>${r.destination || "-"}</td>
              <td>${r.notes || "-"}</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
            <tr style="font-weight: bold; height: 30px">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style="text-align: center; width: 100px"></td>
            </tr>
        </tbody>
      </table>
    </body>
  </html>
  `);

        // 
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            // printWindow.close();
        };
    };


    // Fetch Trips Data from API
    React.useEffect(() => {
        FetchDateTrips()
    }, []);

    // Fetch Amenities Data from API
    React.useEffect(() => {
        handleFilterPassenger()
    }, [passenger]);



    // Check Login
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);


    return (
        <div className="flex">
            {aLoading && (
                <Loading />
            )}
            <Sidebar />
            <div className="flex-1">
                <Header />
                <div className="p-6 flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold mb-4">تفاصيل الرحلة.</h2>
                        <button onClick={() => {
                            setOpenSecretariatModel(!openSecretariatModel);
                        }} className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded ml-4">أضافة أمانة</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex">
                            <h2 className="text-lg font-semibold mb-4">بيانات الحافلة</h2>
                            <div className="mr-auto">
                                <button onClick={HandlePrintReservations} className="text-blue-600 hover:underline cursor-pointer">تقرير الحجوزات</button>
                                <span className="mx-2">|</span>
                                <button onClick={HandlePrintAmenities} className="text-blue-600 hover:underline cursor-pointer">تقرير الامانات</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">رقم السيارة:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {tripData?.busNumber}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">عدد المقاعد:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {tripData?.seats}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">اسم السائق الأول:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {tripData?.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">اسم السائق الثاني:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {tripData?.name2}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block"> المسار:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {tripData?.track}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">التاريخ والوقت:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600">
                                    {`${new Date(tripData?.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" })} ${tripData?.time}`}
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">أيراد المكتب:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 font-bold">
                                    {tripData?.passengerSchemas?.filter((it) => it.status === "booked")?.reduce((acc, curr) => acc + curr.NetTicketPrice, 0) + tripData?.deposits?.filter((it) => it.status === "booked")?.reduce((acc, curr) => acc + curr.NetTicketPrice, 0)} ر . س
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-900 text-sm font-medium mb-2 block">عمولة السائق:</label>
                                <p type="text" className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 font-bold">
                                    {tripData?.passengerSchemas?.filter((it) => it.status === "booked")?.reduce((acc, curr) => acc + curr.ticketOfficeInvitedFees, 0) + tripData?.deposits?.filter((it) => it.status === "booked")?.reduce((acc, curr) => acc + curr.ticketOfficeInvitedFees, 0)} ر . س
                                </p>
                            </div>
                        </div>
                        {/*  Seat reservation */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-4">المقاعد</h2>
                            <div className="grid grid-cols-4 gap-4">
                                {Array?.from({ length: tripData?.seats }).map((_, index) => {
                                    const seatNumber = index + 1;
                                    // Check if seat is booked
                                    const isBooked = tripData.passengerSchemas?.some(
                                        (p) => p.seat === seatNumber
                                    );

                                    return (
                                        <div
                                            onClick={() => {
                                                if (!isBooked) {
                                                    if (!openSeatModel) {
                                                        setOpenSeatModel(true);
                                                        setCount(index + 1);
                                                    } else {
                                                        setOpenSeatModel(false);
                                                    }
                                                }
                                            }}
                                            key={seatNumber}
                                            className={`${!isBooked && "cursor-pointer"} relative w-full h-16 m-2 px-3 rounded flex items-center justify-center ${isBooked ? "bg-red-50 cursor-not-allowed" : "bg-gray-200"
                                                }`}
                                        >
                                            {isBooked && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm("هل أنت متأكد من حذف المقعد؟")) {
                                                            HandleDeletePassenger(index + 1);
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 text-red-500 cursor-pointer hover:text-red-800 z-50"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                            مقعد {seatNumber}
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                    {/* Table Ticket reservation */}
                    <div className="mt-6 bg-white p-2 rounded-lg shadow-md">
                        <div className="flex items-center justify-between px-3">
                            <h2 className="text-lg font-semibold mb-4 m-4">التذاكر</h2>
                            <p className="  font-bold mb-4 mr-4">عدد التذاكر: {passenger?.filter(p => p?.status === "booked").length}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أسم العميل</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المقعد</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الحجز</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الحجز</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {passenger?.map((reservation, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.ticketNumber}#</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.name.slice(0, 20)}...</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.seat || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.createdAt).toLocaleDateString()}</td>
                                            <td className={`${reservation.status === 'booked' ? 'text-green-500' : 'text-red-500'} px-6 py-4 whitespace-nowrap`}>{reservation.status === 'booked' ? 'محجوز' : 'ملغي'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => {
                                                    handlePrint(reservation?._id);
                                                }} className="text-blue-600 cursor-pointer hover:text-blue-900 ml-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                                    </svg>
                                                </button>
                                                {
                                                    reservation.status === "booked" ? (
                                                        <button onClick={() => {
                                                            if (window.confirm("هل أنت متأكد من حذف المقعد؟")) {
                                                                HandleDeletePassenger(index + 1);
                                                            }
                                                        }} className="text-red-600 cursor-pointer hover:text-red-900">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <button className=" whitespace-nowrap text-red-100" disabled>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="overflow-x-auto mt-10">
                            <div className="flex items-center justify-between px-3">
                                <h4 className="text-lg font-semibold my-4">الامانات</h4>
                                <p className="font-bold">
                                    عدد الامانات: {Secretariat?.filter((item) => item.status === 'booked')?.length}
                                </p>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أسم المرسل</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أسم المستلم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المرسل</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المستلم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الامانات</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الحجز</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Secretariat?.map((reservation, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.ticketNumber}#</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.RecipientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.phone || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.passport || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.numberBags}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{reservation.price}</td>
                                            <td className={`${reservation.status === 'booked' ? 'text-green-500' : 'text-red-500'} px-6 py-4 whitespace-nowrap`}>{
                                                reservation.status === "booked" ? "محجوز" : "ملغي"
                                            }</td>
                                            <td className="px-6 py-4 whitespace-nowrap flex ">
                                                <button onClick={() => handlePrintAmenit(reservation?._id)} className="text-blue-600 cursor-pointer hover:text-blue-900">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                                    </svg>
                                                </button>
                                                {reservation.status === "booked" ? (
                                                    <button onClick={() => {
                                                        if (window.confirm("هل أنت متأكد من حذف الامانة")) {
                                                            handleDeleteAmenity(reservation._id);
                                                        }
                                                    }} className="text-red-600 px-6  cursor-pointer hover:text-red-900">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button className="px-6 whitespace-nowrap text-red-200" disabled>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Model Send Ticket */}
            <ModelTicketReservation openSeatModel={openSeatModel} count={count} FetchDateTrips={FetchDateTrips} onClose={() => setOpenSeatModel(false)} id={id} ticketNumber={tripData?.id} date={tripData?.date} time={tripData?.time} price={tripData?.price} track={tripData?.track} busNumber={tripData?.busNumber} OfficeName={tripData?.OfficeName} />
            <ModelSecretariatReservation openSecretariatModel={openSecretariatModel} setOpenSecretariatModel={setOpenSecretariatModel} count={count} FetchDateTrips={FetchDateTrips} onClose={() => setOpenSeatModel(false)} id={id} ticketNumber={tripData?.id} date={tripData?.date} time={tripData?.time} price={tripData?.price} track={tripData?.track} busNumber={tripData?.busNumber} OfficeName={tripData?.OfficeName} />
        </div>
    );
}

export default BusId;
