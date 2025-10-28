import React from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router";
import Dashbord from "./pages/dashbord";
import Trips from "./pages/trips";
import Login from "./pages/Login";
import BusId from "./pages/busId";
import AddNewUser from "./pages/AddNewUser";
import { Toaster } from 'sonner'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Config/Firebase/ConfigFirebase";
import Bookings from "./pages/bookings";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import { collection, getDocs, query, where } from "firebase/firestore";
import Amenities from "./pages/Amenities";
import Safe from "./pages/Safe";



const App = () => {
    const [user] = useAuthState(auth)
    const [users, setUsers] = React.useState({});
    const [AllUsers, setAllUsers] = React.useState([]);


    // fetch user and if not user navigate to login
    const fetchMyAccount = async () => {
        try {
            const q = query(
                collection(db, "users"),
                where("uid", "==", user?.uid)
            );

            const querySnapshot = await getDocs(q);
            const myAccountData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUsers(myAccountData);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Fetch Users 
    const fetchAllUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const allUsersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAllUsers(allUsersData);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }


    React.useEffect(() => {
        fetchMyAccount();
    }, [user]);


    React.useEffect(() => {
        fetchAllUsers();
    }, []);


    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashbord" element={<Dashbord UserId={users[0]} />} />
                <Route path="/trips" element={<Trips User={users[0]} />} />
                <Route path="/trips/:id" element={<BusId User={users[0]} />} />
                <Route path="/addNewUser" element={<AddNewUser />} />
                <Route path="/bookings" element={<Bookings User={users[0]} AllUsers={AllUsers} />} />
                <Route path="/amenities" element={<Amenities User={users[0]} AllUsers={AllUsers} />} />
                <Route path="/safe" element={<Safe UserId={users[0]} AllUsers={AllUsers} />} />
                <Route path="expenses" element={<Expenses User={users[0]} AllUsers={AllUsers}/>} />
                <Route path="reports" element={<Reports AllUsers={AllUsers} />} />
                <Route path="*" element={<h1 className="text-center text-2xl font-bold mt-20">404 Not Found</h1>} />
            </Routes>
        </HashRouter>
    );
};

export default App;
