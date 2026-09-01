import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Safety from "./pages/Safety";
import Hospital from "./pages/Hospital";
import Police from "./pages/Police";
import RegisterRolePortal from "./pages/RegisterRolePortal";
import LoginRolePortal from "./pages/LoginRolePortal";
import AuthRegister from "./pages/auth/PilgrimRegister";
import Login from "./pages/auth/PilgrimLogin";
import PilgrimDashboard from "./pages/pilgrim/PilgrimDashboard";
import PilgrimInfo from "./pages/pilgrim/PilgrimInfo";
import PilgrimEmergency from "./pages/pilgrim/PilgrimEmergency";
import PilgrimQr from "./pages/pilgrim/PilgrimQr";
import SOS from "./pages/pilgrim/SOS";
import SafeRoute from "./pages/pilgrim/SafeRoute";
import VolunteerRegister from "./pages/auth/VolunteerRegister";
import VolunteerLogin from "./pages/auth/VolunteerLogin";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import ScanQR from "./pages/volunteer/ScanQR";
import PilgrimInfoReg from "./pages/volunteer/PilgrimInfoReg";
import ReportMissingPerson from "./pages/volunteer/ReportMissingPerson";
import VolunteerHospital from "./pages/volunteer/VolunteerHospital";
import VolunteerPolice from "./pages/volunteer/VolunteerPolice";
import VolunteerAssignments from "./pages/volunteer/VolunteerAssignments";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";
import NGORegister from "./pages/auth/NGORegister";
import NGOLogin from "./pages/auth/NGOLogin";
import NGODashboard from "./pages/ngo/NGODashboard";
import VolunteersList from "./pages/ngo/VolunteersList";
import WaterDistribution from "./pages/ngo/WaterDistribution";
import FoodDistribution from "./pages/ngo/FoodDistribution";
import NGOReports from "./pages/ngo/NGOReports";
import WeatherOfficerRegister from "./pages/auth/WeatherOfficerRegister";
import WeatherOfficerLogin from "./pages/auth/WeatherOfficerLogin";
import HospitalRegister from "./pages/auth/HospitalRegister";
import HospitalLogin from "./pages/auth/HospitalLogin";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalProfile from "./pages/hospital/HospitalProfile";

import MissingPersonsList from "./pages/controlroom/MissingPersonsList";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/police" element={<Police />} />
        <Route path="/register-role-portal" element={<RegisterRolePortal />} />
        <Route path="/login-role-portal" element={<LoginRolePortal />} />
        <Route path="/pilgrim/register" element={<AuthRegister />} />
        <Route path="/pilgrim/login" element={<Login />} />
        <Route path="/pilgrim/dashboard" element={<PilgrimDashboard />} />
        <Route path="/pilgrim/info" element={<PilgrimInfo />} />
        <Route path="/pilgrim/emergency" element={<PilgrimEmergency />} />
        <Route path="/pilgrim/qr" element={<PilgrimQr />} />
        <Route path="/pilgrim/emergency/sos" element={<SOS />} />
        <Route path="/pilgrim/emergency/route" element={<SafeRoute />} />
        <Route path="/volunteer/register" element={<VolunteerRegister />} />
        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/scan-qr" element={<ScanQR />} />
        <Route path="/volunteer/pilgrim-info-reg" element={<PilgrimInfoReg />} />
        <Route path="/volunteer/dashboard/missing-person" element={<ReportMissingPerson />} />
        <Route path="/volunteer/dashboard/hospitals" element={<VolunteerHospital />} />
        <Route path="/volunteer/dashboard/police-stations" element={<VolunteerPolice />} />
        <Route path="/volunteer/dashboard/assignment" element={<VolunteerAssignments />} />
        <Route path="/volunteer/dashboard/profile" element={<VolunteerProfile />} />
        <Route path="/ngo/register" element={<NGORegister />} />
        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/dashboard" element={<NGODashboard />} />
        <Route path="/ngo/dashboard/volunteer-list" element={<VolunteersList />} />
        <Route path="/ngo/dashboard/water-distribution" element={<WaterDistribution />} />
        <Route path="/ngo/dashboard/food-distribution" element={<FoodDistribution/>} />
        <Route path="/ngo/dashboard/reports" element={<NGOReports/>} />
        <Route path="/weather/register" element={<WeatherOfficerRegister />} />
        <Route path="/weather/login" element={<WeatherOfficerLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />

        <Route path="/controlroom/missing-person-list" element={<MissingPersonsList />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;