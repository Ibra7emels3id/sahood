import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Model from './Components/Model';
import { Link } from 'react-router';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Config/Firebase/ConfigFirebase';
import { toast } from 'sonner';

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


    // Delete Trip By Id
    const HandleDeleteTrip = async (id) => {
        if (confirm('هل تريج حذف الرحلة؟')) {
            setALoading(true);
            try {
                const res = await axios.delete(`${import.meta.env.VITE_SOME_URL}/api/trips/delete/${id}`);
                toast.success(res.data.message);
                FetchDateTrips();
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setALoading(false);
            }
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
                                            <th class="px-4 py-4 text-center text-xs font-semibold text-slate-900 uppercase tracking-wider">
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
                                                <td class="px-4 py-4 text-sm h-full w-full flex items-center justify-between">
                                                    {/* btn view */}
                                                    <Link to={`/trips/${trip._id}`} title='ينظر' class="cursor-pointer text-blue-600 font-medium mr-4 py-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </Link>
                                                    {/* btn edit */}
                                                    <Link to={`/trips/edit/${trip._id}`} className='py-2 px-2 cursor-pointer text-green-600 font-medium' title='تعديل'>
                                                        <svg width="21px" height="21px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>edit_cover [#ffca38]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -359.000000)" fill="#ffca38"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M384,209.210475 L384,219 L363,219 L363,199.42095 L373.5,199.42095 L373.5,201.378855 L365.1,201.378855 L365.1,217.042095 L381.9,217.042095 L381.9,209.210475 L384,209.210475 Z M370.35,209.51395 L378.7731,201.64513 L380.4048,203.643172 L371.88195,212.147332 L370.35,212.147332 L370.35,209.51395 Z M368.25,214.105237 L372.7818,214.105237 L383.18415,203.64513 L378.8298,199 L368.25,208.687714 L368.25,214.105237 Z" id="edit_cover-[#ffca38]"> </path> </g> </g> </g> </g></svg>
                                                    </Link>
                                                    {/* btn Delete */}
                                                    {User?.role === 'admin' && (
                                                        <button onClick={() => HandleDeleteTrip(trip._id)} className='py-2 cursor-pointer text-red-600 font-medium' title='حذف'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    )}
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
