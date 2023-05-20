import { createContext, useEffect, useState } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../../firebase.config";

export const AuthContext = createContext();

const auth = getAuth(app);


const Provider = ({ children }) => {
    // state declareation======================
    const [data, setData] = useState([])
    const [regulerCar, setRegulerCar] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [sportsCar, setSportsCar] = useState([]);
    const [user,setUser] = useState([])


    // loading data========================================================================
    useEffect(() => {
        fetch('data.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])





    //handle react tab====================================================================== 
    const handle_react_tab = () => {
        const subCatagory_regulerCar = data.filter(e => e.sub_category === 'Regular Car');
        setRegulerCar([...subCatagory_regulerCar])


        const subCatagory_trucks = data.filter(e => e.sub_category === 'Truck');
        setTrucks([...subCatagory_trucks])


        const subCatagory_sportsCar = data.filter(e => e.sub_category === 'Sports Car');
        setSportsCar([...subCatagory_sportsCar])

    }



















    // sign in by google==================================================================
    const handleGoogle = () => {
        console.log("google handler is working....")
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result);
                // ...
            }).catch((error) => {
                console.log(error)
                // ...
            });


    }









    // passing data================
    const info = {
        handle_react_tab,
        regulerCar,
        sportsCar,
        trucks,
        data,
        handleGoogle




    }



    return (
        <AuthContext.Provider value={info}>
            {children}

        </AuthContext.Provider>
    );
};

export default Provider;