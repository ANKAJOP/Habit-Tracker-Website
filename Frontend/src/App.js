// import React from 'react';
// import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar'; // Adjust path if needed
// import './index.css';
// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './components/Dashboard';
// import Footer from './components/Footer';
// import ContactUs from './components/ContactUs';
// import About from './components/About';
// import Habit from './components/Habit';
// import Progress from './components/Progress';
// import HabitLog from './components/HabitLog';
// import Rewards from './components/Rewards';
// import ProfilePage from './components/ManageProfile';

// function App() {
//   return (
//      <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/contact" element={<ContactUs />} />
//         <Route path="/about" element={<About/>} />
//         <Route path="/habits" element={<Habit />} />
//         <Route path="/progress" element={<Progress />} />
//         <Route path="/logs" element={<HabitLog/>} />
//         <Route path="/rewards" element={<Rewards />} />
//         <Route path="/manage" element={<ProfilePage/>} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import About from './components/About';
import Habit from './components/Habit';
import Progress from './components/Progress';
import HabitLog from './components/HabitLog';
import Rewards from './components/Rewards';
import ProfilePage from './components/ManageProfile';
import ScrollToTop from './components/ScrollToTop'; // ✅ Add this

import FloatingChatbot from './components/chatBot';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/habits" element={<Habit />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/logs" element={<HabitLog />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/manage" element={<ProfilePage />} />
      </Routes>
      <Footer />
      <FloatingChatbot />
    </Router>
  );
}

export default App;
