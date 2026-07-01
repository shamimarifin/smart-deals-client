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
            setLoading(false)
        })
    })


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
