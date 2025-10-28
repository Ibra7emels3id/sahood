import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Model from './Components/Model';
import { Link } from 'react-router';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';

const Trips = ({ User }) => {
    const [isModelOpen, setIsModelOpen] = React.useState(false);
    const [tripsData, setTripsData] = React.useState([]);
    const [user, loading] = useAuthState(auth)
    const [aLoading, setALoading] = React.useState(false)



    // Handle Show Alert Model
    const HandleShowAlertModel = () => {
        setIsModelOpen(!isModelOpen);
    }


    // Handle Fetch Trips Data from API
    const FetchDateTrips = async () => {
        if (!User) return;

        setALoading(true);

        try {
            const endpoint =
                User.role === "admin"
                    ? "/api/trips"
                    : `/api/account/trips/${User.uid}`;
            const { data } = await axios.get(`${import.meta.env.VITE_SOME_URL}${endpoint}`);
            setTripsData(
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setALoading(false);
        }
    };




    // Fetch Trips Data from API
    useEffect(() => {
        FetchDateTrips();
    }, [user, User]);



    // check User is login
    React.useEffect(() => {
        if (loading) return;
        if (!user) window.location.href = '/';
    }, [user, loading]);




    return (
        <>
            <div className="flex">
                <Sidebar />
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
                <div className="flex-1">
                    <Header />
                    <div className="p-6 flex-col">
                        <div className="flex justify-between items-center w-full">
                            <h1 className="text-2xl font-bold">الرحلات</h1>
                            <button onClick={HandleShowAlertModel} className=" cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">إضافة رحلة جديدة</button>
                        </div>
                        <div className="flex flex-col mt-8">
                            <h3 className="text-lg font-bold mb-4">جميع الرحلات .</h3>
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
                                                المكتب
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                اسم السائق
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                اسم السائق الثاني
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                المسار
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                التاريخ والوقت
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                            <th class="px-4 py-4 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    {<tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                        {tripsData.map((trip, index) => (
                                            <tr>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.busNumber}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.OfficeName}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.name}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                                    {trip.name2 || '---'}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {trip.track}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {new Date(trip.date).toLocaleDateString('en-GB')} <br />
                                                    {trip.time}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                                    {
                                                        trip.seats === trip.passengerSchemas.length ? (
                                                            <span className='text-red-600 font-bold'>مكتمل</span>
                                                        ) : (
                                                            <span className='text-green-600 font-bold'>متاح</span>
                                                        )
                                                    }
                                                </td>
                                                <td class="px-4 py-4 text-sm">
                                                    <Link to={`/trips/${trip._id}`} class="cursor-pointer text-blue-600 font-medium mr-4">
                                                        أظهار
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Model isOpen={isModelOpen} onClose={HandleShowAlertModel} FetchDateTrips={FetchDateTrips} />
        </>
    );
}

export default Trips;
