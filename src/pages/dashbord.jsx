import React, { useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';
import axios from 'axios';
import { Link } from 'react-router';

const Dashbord = ({ UserId }) => {
    const [user] = useAuthState(auth)
    const [AllReservations, setAllReservations] = React.useState([]);
    const [tripsData, setTripsData] = React.useState([]);
    const [AllAmenities, setAllAmenities] = React.useState([]);
    const [ExpensesData, setExpensesData] = React.useState([]);
    const [SafeData, setSafeData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);



    // Handle Fetch Trips Data from API
    const FetchDateTrips = async () => {
        if (!UserId) return;

        try {
            setLoading(true);

            const urls = [
                `${import.meta.env.VITE_SOME_URL}/api/trips`,
                `${import.meta.env.VITE_SOME_URL}/api/all-reservations`,
                `${import.meta.env.VITE_SOME_URL}/api/all-amenities`,
                `${import.meta.env.VITE_SOME_URL}/api/get-expenses`,
                `${import.meta.env.VITE_SOME_URL}/api/get-safe`
            ];

            const [tripsRes, reservationsRes, amenitiesRes, expensesRes, safeRes] = await Promise.all(
                urls.map(url => axios.get(url))
            );

            // Sort/filter after all responses
            const tripsData = tripsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTripsData(UserId.role === "admin" ? tripsData : tripsData.filter(t => t.uid === UserId.uid));

            const reservationsData = reservationsRes.data;
            setAllReservations(UserId.role === "admin" ? reservationsData : reservationsData.filter(r => r.OfficeName === UserId.OfficeName));

            const amenitiesData = amenitiesRes.data;
            setAllAmenities(UserId.role === "admin" ? amenitiesData : amenitiesData.filter(a => a.OfficeName === UserId.OfficeName));

            const expensesData = expensesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setExpensesData(expensesData);

            setSafeData(safeRes.data);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Filter By Month 
    const TotalProfit = SafeData?.filter((trip) => {
        const tripDate = new Date(trip.createdAt);
        return tripDate.getMonth() + 1 === Number(new Date().getMonth() + 1);
    });

    const totalBalance = TotalProfit?.reduce(
        (total, trip) => total + trip.balance,
        0
    );




    // Check Login 
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);
    ;


    // Fetch Data 
    useEffect(() => {
        FetchDateTrips()
    }, [UserId]);



    return (
        <div className="flex">
            <Sidebar UserId={UserId} />
            <div className="flex-1">
                {/* // If user is loading, show loading screen */}
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
                <Header />
                <div className="p-6 flex-col">
                    <h2 className="text-2xl font-bold mb-4">مرحبًا بك في لوحة التحكم 🚍</h2>
                    <div className="grid grid-cols-3 gap-6  mt-8">
                        <div className="bg-[#eee] p-5 rounded shadow shadow-[#eee]">
                            <h3 className="text-lg font-bold mb-2">إجمالي الرحلات</h3>
                            <p className="text-3xl font-bold">{tripsData.length}</p>
                        </div>
                        <div className=" bg-[#eee] p-4 rounded shadow">
                            <h3 className="text-lg font-bold mb-2">إجمالي الحجوزات الناجحة</h3>
                            <p className="text-3xl font-bold">{AllReservations?.filter((trip) => trip.status === "booked").length}</p>
                        </div>
                        <div className="bg-[#eee] p-4 rounded shadow">
                            <h3 className="text-lg font-bold mb-2">إجمالي الامانات الناجحة</h3>
                            <p className="text-3xl font-bold">
                                {AllAmenities?.filter((trip) => trip.status === "booked").length}
                            </p>
                        </div>
                        {
                            UserId?.role === "admin" && (
                                <>
                                    <div className="bg-[#eee] p-4 rounded shadow">
                                        <h3 className="text-lg font-bold mb-2">إجمالي الايردات</h3>
                                        <p className="text-3xl font-bold">
                                            {totalBalance} ر.س
                                        </p>
                                    </div>
                                    <div className="bg-[#eee] p-5 rounded shadow shadow-[#eee]">
                                        <h3 className="text-lg font-bold mb-2">إجمالي المصروفات</h3>
                                        <p className="text-3xl font-bold">
                                            {ExpensesData.reduce((sum, exp) => sum + Number(exp.invoiceValue || 0), 0)} ر.س
                                        </p>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className="flex flex-col mt-8">
                        <h3 className="text-lg font-bold mb-4">الرحلات القادمة</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-100 whitespace-nowrap">
                                    <tr>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            رقم الرحلة
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            اسم المكتب
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            السائق
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            السائق الثاني
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            المسار
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            التاريخ
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            الحالة
                                        </th>
                                        <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                            الإجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                    {tripsData.map((trip, index) => (
                                        <tr>
                                            <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                {index + 1}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                {trip.busNumber}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                {trip.OfficeName}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                {trip.name}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                {trip.name2}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                {trip.track}
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                {new Date(trip.date).toLocaleDateString('en-GB')} <br />
                                                {trip.time}PM
                                            </td>
                                            <td class={`${trip.passengerSchemas.length === trip.seats ? "text-red-600" : "text-green-600"} px-4 py-4 text-sm font-medium`}>
                                                {trip.passengerSchemas.length === trip.seats ? "مكتملة" : "غير مكتملة"}
                                            </td>
                                            <td class="px-4 py-4 text-sm">
                                                <Link to={`/trips/${trip._id}`} class="cursor-pointer text-blue-600 font-medium mr-4">
                                                    أظهار
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashbord;
