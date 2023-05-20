import { createContext, useEffect, useState } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword , createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../../firebase.config";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const auth = getAuth(app);



const Provider = ({ children }) => {
    // state declareation======================
    const [data, setData] = useState([])
    const [regulerCar, setRegulerCar] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [sportsCar, setSportsCar] = useState([]);
    const [user, setUser] = useState([])


   


    // loading data========================================================================
    useEffect(() => {
        fetch('http://localhost:5000/users')
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




  






















    // create user by email pass===========================================
    // const handleRegister = (email, password) => {
    //     console.log(email,password);
    //     createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         // Signed in 
    //         console.log('registration done')
    //         return  <Navigate to="/login" />;
            
             
            
            
    //         // ...
    //       })
    //     .catch((error) => {
    //       console.log(error)
    //       // ..
    //     });

    // }

    // logout user=========================
    const handleLogout=()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
            setUser(null);
          }).catch((error) => {
            // An error happened.
          });
          
    }



    // onAuth Change==========================
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, loggedUser => {
            console.log('logged in user inside auth state observer', loggedUser)
            setUser(loggedUser);
            
        })

        return () => {
            unsubscribe();
        }
    }, [])









    // passing data================
    const info = {
        handle_react_tab,
        regulerCar,
        sportsCar,
        trucks,
        data,
        
    
        
        user,
        setUser,
        handleLogout,
        auth




    }



    return (
        <AuthContext.Provider value={info}>
            {children}

        </AuthContext.Provider>
    );
};

export default Provider;