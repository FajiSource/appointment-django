import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom';

export default function ClientRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    lastname: '',
    firstname: '',
    middlename: '',
    email: '',
    contact_number: '',
    address: '',
    civil_status: 'Single',
    birthplace: '',
    birthday: '',
    sex: 'Male',
  })
  const { error, register_client } = useAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await register_client(formData)
    if (success) {
      alert('Registration successful')
      setFormData({
        username: '',
        password: '',
        lastname: '',
        firstname: '',
        middlename: '',
        email: '',
        contact_number: '',
        address: '',
        civil_status: 'Single',
        birthplace: '',
        birthday: '',
        sex: 'Male',
      })
    } else {
      alert(error || 'Registration failed')
    }
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="username" className='border' placeholder="Username" onChange={handleChange} /><br />
        <input name="password" className='border' type="password" placeholder="Password" onChange={handleChange} /><br />
        <input name="lastname" className='border' placeholder="Last Name" onChange={handleChange} /><br />
        <input name="firstname" className='border' placeholder="First Name" onChange={handleChange} /><br />
        <input name="middlename" className='border' placeholder="Middle Name" onChange={handleChange} /><br />
        <input name="email" className='border' placeholder="Email" onChange={handleChange} /><br />
        <input name="contact_number" className='border' placeholder="Contact Number" onChange={handleChange} /><br />
        <input name="address" className='border' placeholder="Address" onChange={handleChange} /><br />
        <input name="birthplace" className='border' placeholder="Birthplace" onChange={handleChange} /><br />
        <input name="birthday" className='border' type="date" onChange={handleChange} /><br />
        <select name="civil_status" className='border' onChange={handleChange}>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
          <option value="Separated">Separated</option>
        </select><br />
        <select name="sex" className='border' onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select><br />
        <button type="submit" className='border bg-green-500 cursor-pointer'>Register</button>
      </form>

      <div className="text-center mt-2">
        <span className="mr-1">Already have an account?</span>
        <Link to={"/"} className="text-black underline font-bold ">Login</Link>
      </div>
    </div>
  )
}
