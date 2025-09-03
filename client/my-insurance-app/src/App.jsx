import { Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './markup/pages/Admin/Menu/Menu';
import Home from './markup/components/Home/Home';
import Header from './markup/components/Header/Header';
import Footer from './markup/components/Footer/Footer';
import Add from './markup/pages/Admin/add-employee/Add-employee';
import AddClaim from './markup/pages/Admin/add-claim/add-claim';
import AddPolicy from './markup/pages/Admin/add-policy/add-policy';
import Login from './markup/pages/Admin/login/Login';
import Unauthorized from './markup/pages/unauthorized/Unauthorized';
import PrivateAuthRoute from './markup/components/Auth/privateAuthRouter';
import Employee from './markup/pages/Employee/Employee';
import Claims from './markup/pages/Claims/Claims';
import Policies from './markup/pages/Policies/Policies';
import PolicyExpireList from './markup/pages/Admin/report/PolicyExpireList';
import CommissionList from './markup/pages/Admin/commission/commissionList'
import About from './markup/components/About/About';
import Service from './markup/components/Service/Service'
import Contact from './markup/components/Contact/Contact'
import AIAssistant from './markup/pages/Admin/ai/aiAssistant'
import AuditLogList from './markup/pages/Admin/audit/auditLogList'
import Four from './markup/components/Four/Four';
function App() {
  return (
    <>
      <div className="app-container">
     <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/claim" element={<AddClaim />} />
        <Route path="/policy" element={<AddPolicy />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/about" element={<About/>} />
        <Route path="/service" element={<Service/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/letter" element={<AIAssistant/>} />
        <Route path="/employee" element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Add />
            </PrivateAuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/claims" element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Claims />
            </PrivateAuthRoute>
          }
        />
        <Route path="/employees" element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Employee />
            </PrivateAuthRoute>
          }
        />
        <Route path="/audit" element={<AuditLogList/>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/expiring" element={<PolicyExpireList />} />
        <Route path="/commission" element={<CommissionList />} />
        <Route path="*" element={<Four/>} />
      </Routes>
      <Footer/>
      </div>
    </>
  );
}

export default App;
