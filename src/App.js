
import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeCustomization from 'themes';
import { useSelector } from "react-redux";


//private route 
import PrivateRoute from 'utils/privateRoute';

// pages
import Home from './pages/home/index'

//settings panel
import SettingPanel from './pages/settings/index';
//company panel
import HcpsTable from './pages/settings/company/hcps/index';
import ReferalTab from './pages/settings/company/referals/index';
import RequestsTab from './pages/settings/company/requests/index';
//patient panel
import PatientEnrollments from './pages/settings/patient/enrollments/index';
import CompanyEnrollments from './pages/settings/company/enrollments/index';
//hcp panel
import HcpEnrollments from './pages/settings/hcp/enrollments/index';
import HcpReferals from './pages/settings/hcp/referals/index';
//pharmacy panel 
import PharmacyEnrollments from './pages/settings/pharmacy/enrollments/index';
//programs 
import ProgramForm from 'pages/programs/createProgram/index';
import Details from './pages/programs/programDetails';
import Programs from './pages/programs/programs';

//navigation
import Header from './ui-component/navigation/header';
import Footer from './ui-component/navigation/footer';


//slices
import Snackbar from 'ui-component/extended/Snackbar';


//authentication
import Register from './pages/authentication/register';
import Login from './pages/authentication/login';


function Root() {
  const { islogged } = useSelector((state) => state.auth);
  return (
    <Routes >
      <Route index element={<Home />} />
      <Route path="/details" element={<Programs />} />
      <Route path="/programs/:id" element={<Details />} />
      <Route path="/createProgram" element={<PrivateRoute Component={ProgramForm} />} />
      <Route path="/editProgram/:id" element={<PrivateRoute Component={ProgramForm} />} />
      <Route path="/listPrograms/:id" element={<PrivateRoute Component={Programs} />} />

      
      <Route path="/panel" element={<PrivateRoute Component={SettingPanel} />} >
        {/* company */}
        <Route path="company/programs/:id" element={<PrivateRoute Component={Programs} />} />
        <Route path="company/enrollments" element={<PrivateRoute Component={CompanyEnrollments} />} />
        <Route path="company/referal" element={<PrivateRoute Component={ReferalTab} />} />
        <Route path="company/hcps" element={<PrivateRoute Component={HcpsTable} />} />
        <Route path="company/requests" element={<PrivateRoute Component={RequestsTab} />} />

      {/* patient */}
        <Route path="patient/programs/:id" element={<PrivateRoute Component={PatientEnrollments} />} />

        {/* pharmacy */}
        <Route path="pharmacy/enrollments" element={<PrivateRoute Component={PharmacyEnrollments} />} />

      {/* hcp */}
        <Route path="hcp/patientenrollments" element={<PrivateRoute Component={HcpEnrollments} />} />
        <Route path="hcp/referal" element={<PrivateRoute Component={HcpReferals} />} />

      </Route>
      <Route path={islogged ? '/' : '/register'} element={<Register />} />
      <Route path={islogged ? '/' : "/login"} element={<Login />} />
      <Route path="/login" element={<PrivateRoute Component={Home} />} />
      <Route path="/register" element={<PrivateRoute Component={Home} />} />
    </Routes>
  );
}
function App() {
  return (
    <>
      <BrowserRouter>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <ThemeCustomization>
            <Header />
            <div className="App">
              <Root />
              <Snackbar />
            </div>
            <Footer />
          </ThemeCustomization>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
