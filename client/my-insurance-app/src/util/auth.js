const getAuth = async () => {
  const token = localStorage.getItem('employee_token');
  if (!token) return null;

  const decoded = decodeTokenPayload(token);
  if (!decoded || isExpired(decoded.exp)) {
    localStorage.removeItem('employee_token');
    return null;
  }

  return {
    employee_token: token,
    employee_id: decoded.employee_id || decoded.sub, // check your token claims!
    employee_email: decoded.employee_email,
    employee_first_name: decoded.employee_first_name,
    employee_role: Number(decoded.company_role_id || decoded.employee_role_id),
    employee_role_name: decoded.company_role_name,
  };
};

const decodeTokenPayload = (token) => {
  try {
    const base64url = token.split('.')[1];
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

const isExpired = (exp) => {
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
};

export default getAuth;