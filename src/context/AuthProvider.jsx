import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase/firebase.init'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

    const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const createUser = (email , password)=> {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password)=> {
        return signInWithEmailAndPassword(auth, email, password)
    }

    
    const signInWithGoogle = ()=> {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const signOutUser = ()=> {
        setLoading(true);
        return signOut(auth)
    }


    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=> {
            setUser(currentUser)
            console.log('current User' , currentUser)
            const loggingUser = { email: currentUser.email }
            if(currentUser){
                fetch('http://localhost:3000/getToken',{
                    method : "POST",
                    headers:{
                        'content-type' : 'application/json'
                    },
                    body : JSON.stringify(loggingUser)
                })
                .then(res=>res.json())
                .then(data=> {
                    console.log('After save data', data)
                })
            }
            setLoading(false)
        })
        
        return ()=> unsubscribe()

    },[])


    const authInfo = {
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        user,
        loading,
    }

  return (
    <AuthContext value={authInfo}>
      {children}
    </AuthContext>
  )
}

export default AuthProvider
