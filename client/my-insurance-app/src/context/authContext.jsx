import React, { useState, useEffect, useContext, createContext } from 'react';
import getAuth from '../util/auth'; // JWT decode utility

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize employee data
  const normalizeEmployee = (data) => ({
    id: data.employee_id,
    email: data.employee_email,
    firstname: data.employee_first_name, // ✅ normalized key
    role: data.company_role_id,
    roleName: data.company_role_name,
    token: data.token || data.employee_token,
  });

  // Load employee info from JWT on mount
  useEffect(() => {
    const loadEmployee = async () => {
      const emp = await getAuth();
      if (emp) {
        setEmployee(normalizeEmployee(emp));
        setIsLoggedIn(true);
        setIsAdmin(emp.company_role_id === 3);
      }
      setLoading(false);
    };
    loadEmployee();
  }, []);

  const login = (data) => {
    if (!data || !data.data) return;

    const emp = normalizeEmployee(data.data);
    localStorage.setItem('employee_token', data.token);
    localStorage.setItem('employee', JSON.stringify(emp));

    setEmployee(emp);
    setIsLoggedIn(true);
    setIsAdmin(emp.role === 3);
  };

  const logout = () => {
    localStorage.removeItem('employee_token');
    localStorage.removeItem('employee');
    setEmployee(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, employee, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
