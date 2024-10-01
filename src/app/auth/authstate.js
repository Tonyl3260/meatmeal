// import { useEffect, useState } from 'react';
// import { auth } from '../firebase';
// import { onAuthStateChanged, signOut } from 'firebase/auth';

// const AuthState = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleSignOut = () => {
//     signOut(auth).then(() => {
//       console.log('User signed out');
//     });
//   };

//   return (
//     <div>
//       {user ? (
//         <div>
//           <h2>Welcome, {user.email}</h2>
//           <button onClick={handleSignOut}>Sign Out</button>
//         </div>
//       ) : (
//         <p>No user signed in</p>
//       )}
//     </div>
//   );
// };

// export default AuthState;
