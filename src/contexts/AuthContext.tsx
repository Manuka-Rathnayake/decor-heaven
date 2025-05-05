import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  auth,
  app
} from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { Designer } from "../types";

interface AuthContextType {
  designer: Designer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = getFirestore(app);

  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchDesignerData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "designers", user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setDesigner({
              id: user.uid,
              name: userData.name || "Designer",
              email: userData.email || "",
              role: userData.role || "designer",
              avatar: user.photoURL || "https://i.pravatar.cc/150?img=11",
            });
          } else {
            console.warn("User document not found in Firestore");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setDesigner(null);
      }
    };

    fetchDesignerData();
  }, [user]);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      if (userCredential.user) {
        await setDoc(doc(db, "designers", userCredential.user.uid), {
          name,
          email,
          role: "designer",
          uid: userCredential.user.uid,
          createdAt: new Date().toISOString(),
        });
      }

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          throw new Error("Invalid email or password.");
        case "auth/too-many-requests":
          throw new Error("Too many unsuccessful login attempts. Please try again later.");
        case "auth/network-request-failed":
          throw new Error("Network error. Please check your internet connection.");
        default:
          throw new Error("An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut(auth);
      setDesigner(null);
    } catch (e) {
      console.error("Failed to sign out:", e);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = designer !== null;

  return (
    <AuthContext.Provider
      value={{
        designer,
        isAuthenticated,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};





// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { auth, app } from '../config/firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';

// import { Designer } from '../types';

// interface AuthContextType {
//   designer: Designer | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const db = getFirestore(app);

//   const [designer, setDesigner] = useState<Designer | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [user, setUser] = useState<User | null>(null);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Update designer info when user changes
//   useEffect(() => {
//     const fetchDesignerData = async () => {
//       if (user) {
//         // Convert Firebase user to Designer
//         setDesigner({
//           id: user.uid,
//           name: user.displayName || 'Designer',
//           email: user.email || '',
//           role: 'designer', // Default role
//           avatar: user.photoURL || 'https://i.pravatar.cc/150?img=11'
//         });
//       } else {
//         setDesigner(null);
//       }
//     };

//     fetchDesignerData();
//   }, [user]);

//   const register = async (name: string, email: string, password: string): Promise<boolean> => {
//     try {
//       setLoading(true);
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, {
//         displayName: name,
//       });
      
//       // Update Firestore with additional user data
//       if (userCredential.user) {
//         await setDoc(doc(db, "designers", userCredential.user.uid), {
//           name,
//           email,
//           role: 'designer',
//           uid: userCredential.user.uid,
//           createdAt: new Date().toISOString(),
//         });
//       }

//       return true;
//     } catch (error: any) {
//       console.error('Registration error:', error);
//       // Handle specific Firebase errors if needed (e.g., email already in use)

//       // Re-throw the error to be handled by the component
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       setLoading(true);
//       await signInWithEmailAndPassword(auth, email, password);

//       return true;
//     } catch (error: any) {
//       console.error('Login error:', error);
//       // Handle specific Firebase errors (e.g., invalid credentials)

//       switch (error.code) {
//         case 'auth/invalid-credential':
//         case 'auth/user-not-found':
//         case 'auth/wrong-password':
//           throw new Error('Invalid email or password.');
//         case 'auth/too-many-requests':
//           throw new Error('Too many unsuccessful login attempts. Please try again later.');
//         case 'auth/network-request-failed':
//           throw new Error('Network error. Please check your internet connection.');
//         default:
//           throw new Error('An error occurred during login.');
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       setLoading(true);

//       try {
//         await signOut(auth);
//         setDesigner(null);
//       } catch (e) {
//         console.error('Failed to sign out locally:', e);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isAuthenticated = designer !== null;

//   return (
//     <AuthContext.Provider
//       value={{
//         designer,
//         isAuthenticated,
//         login,
//         logout,
//         register,
//         loading
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


