import { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const AuthContext = createContext()

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/api'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const checkSessionCookie = () => {
    // return sessionStorage.getItem('authToken');
    const match = document.cookie.match(/access_token=[^;]+/)
    console.log("token from cookie: ", match);
    return match || localStorage.getItem('authToken') !== null
  }

  const fetchUserIfAuthenticated = async () => {
    if (checkSessionCookie()) {
      try {
        console.log("has token", checkSessionCookie())

        const res = await axios.get('/protected/', { withCredentials: true })
        setUser({
          username: res.data.user,
          usertype: res.data.usertype,
          authenticated: res.data.authenticated
        })
        setError(null)
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserIfAuthenticated()
  }, [])

  // Log in the user and store token
  // const logIn = async (credentials) => {
  //   setLoading(true)
  //   setError(null)
  //   try {
  //     const loginRes = await axios.post('/login/', credentials)
  //     localStorage.setItem('authToken', loginRes.data.token)

  //     // Fetch User Info
  //     const userRes = await axios.get('/protected/', { withCredentials: true })
  //     setUser({
  //       username: userRes.data.user,
  //       position: userRes.data.position
  //     })

  //     setLoading(false)
  //     return true
  //   } catch (err) {
  //     setError(err.response?.data?.detail || 'Invalid username or password')
  //     setUser(null)
  //     setLoading(false)
  //     return false
  //   }
  // }
  const logIn = async (credentials) => {
    setLoading(true)
    setError(null)

    try {

      const loginRes = await axios.post('/login/', credentials, { withCredentials: true })
      const encryptedData = loginRes.data.encrypted_data
      console.log('Encrypted Data:', encryptedData)
      const decryptedRes = await axios.post('decrypt/', { data: encryptedData }, { withCredentials: true });
      localStorage.setItem('authToken', decryptedRes.data.access_token);
      //console.log('Decrypted Data:', decryptedRes.data);
      const userRes = await axios.get('protected/', { withCredentials: true });
      console.log("user data:: ", userRes);
      setUser({
        username: userRes.data.user,
        usertype: userRes.data.usertype,
        authenticated: userRes.data.authenticated
      })

      setLoading(false)
      return true

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
      setUser(null)
      setLoading(false)
      return false
    }
  }
  const register_client = async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post('/users/create-client/', credentials, { withCredentials: true })
      console.log('Registration successful:', res.data)
      setLoading(false)
      return true
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      return false;
    }

  }

  const logOut = async () => {
    setLoading(true);

    try {

      await axios.post('/logout/', {}, { withCredentials: true });
      // const navigate = useNavigate();

      localStorage.removeItem('authToken');


      setUser(null);


      document.cookie = 'access_token=; Max-Age=0; path=/;';


      return <Navigate to={"/login"}/>
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {

            const res = await axios.post('/refresh/', {}, { withCredentials: true });


            localStorage.setItem('authToken', res.data.access);


            return axios(originalRequest);
          } catch (refreshError) {

            setUser(null);
            localStorage.removeItem('authToken');
          }
        }

        return Promise.reject(error);
      }
    );


    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        logIn,
        logOut,
        register_client,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
