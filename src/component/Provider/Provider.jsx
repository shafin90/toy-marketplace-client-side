import { createContext, useEffect, useState } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../../firebase.config";
import { Navigate, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export const AuthContext = createContext();

const auth = getAuth(app);



const Provider = ({ children }) => {
    // state declareation======================
    const [data, setData] = useState([])
    const [regulerCar, setRegulerCar] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [sportsCar, setSportsCar] = useState([]);
    const [user, setUser] = useState({});
    const [location, setLocation] = useState('');
    const [myToy, setMyToy] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
    const [latestToy, setLatestToy] = useState(null);// conains the latest 10 item of toys
    const [featuredProducts, setFeaturedProducts] = useState(null) // contains the featured products
    const [bestSellerProducts, setBestSellerProducts] = useState(null)// Contains best seller prodcuts




    // some functionaliteis================================================================

    // Taking top 10 items form the updated data
    useEffect(() => {
        const latestToys = data.slice(0, 10);
        setLatestToy(latestToys);
    }, [data]);

    // Taking  featured items form the updated data
    useEffect(() => {
        const featuredItems = data.slice(0, 3);
        setFeaturedProducts(featuredItems);
    }, [data]);

    // Taking the best seller products
    useEffect(() => {
        const bestSelleritems = data.slice(0, 5);
        setBestSellerProducts(bestSelleritems);
    }, [data]);














    // loading data========================================================================
    useEffect(() => {
        fetch('https://carz-server-shafin90.vercel.app/users')
            .then(res => res.json())
            .then(data => setData(data))

    }, [])




























    // const userEmail = user&&user.email?user.email:user.user.email;




    console.log(user)
    //handle react tab====================================================================== 

    useEffect(() => {
        const subCatagory_regulerCar = data.filter(e => e.sub_category === 'Regular Car');
        setRegulerCar([...subCatagory_regulerCar])


        const subCatagory_trucks = data.filter(e => e.sub_category === 'Truck');
        setTrucks([...subCatagory_trucks])


        const subCatagory_sportsCar = data.filter(e => e.sub_category === 'Sports Car');
        setSportsCar([...subCatagory_sportsCar])




        // const toys = data.filter(e=>e.email== userEmail);
        // setMyToy(toys);


        setSpinner(true)

    }, [data])




    useEffect(() => {
        const toys = data.filter(e => e.email == user?.email);
        setMyToy([...toys])


    }, [user, data])



    // logout user=========================
    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            setUser(null);

        }).catch((error) => {
            // An error happened.
        });

    }






    // onAuth Change==========================
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, loggedUser => {

            setUser(loggedUser);



        })

        return () => {
            unsubscribe();
        }
    }, [])









    // passing data================
    const info = {

        regulerCar,
        sportsCar,
        trucks,
        data,
        location,
        setLocation,
        user,
        setUser,
        handleLogout,
        auth,
        setMyToy,
        myToy,
        spinner,
        setPhotoUrl,
        photoUrl,
        latestToy,
        featuredProducts,
        bestSellerProducts

    }



    return (
        <AuthContext.Provider value={info}>
            {children}

        </AuthContext.Provider>
    );
};

export default Provider;