import { useState, useEffect } from 'react';
import axios from 'axios';

// Component for updating a user
export default function UserUpdate({ user, onUserUpdated, closeModal }) {
  // State to hold the updated user data
  const [updatedUser, setUpdatedUser] = useState(user);
  // State to control display of confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // State for validation error messages for each field
  const [errors, setErrors] = useState({
    lastname: '',
    firstname: '',
    middleinitial: '',
    address: '',
    username: '',
  });

  // Update state and reset errors when the user prop changes
  useEffect(() => {
    setUpdatedUser(user);
    setErrors({
      lastname: '',
      firstname: '',
      middleinitial: '',
      address: '',
      username: '',
    });
  }, [user]);

  // Handle input field changes and clear corresponding error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form inputs and set error messages if invalid
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      lastname: '',
      firstname: '',
      middleinitial: '',
      address: '',
      username: '',
    };
    
    // Validate last name
    if (!updatedUser.lastname || !updatedUser.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
      isValid = false;
    }
    
    // Validate first name
    if (!updatedUser.firstname || !updatedUser.firstname.trim()) {
      newErrors.firstname = 'First name is required';
      isValid = false;
    }
    
    // Validate middle initial (optional, but if provided, must be a single character)
    if (updatedUser.middleinitial && updatedUser.middleinitial.length > 1) {
      newErrors.middleinitial = 'Middle initial should be a single character';
      isValid = false;
    }
    
    // Validate address
    if (!updatedUser.address || !updatedUser.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    if (!updatedUser.username || !updatedUser.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (updatedUser.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Triggered when user clicks Update, validates then shows confirmation modal
  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  // Close confirmation modal without submitting
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Confirmed submit: send PUT request to update user data
  const handleConfirmSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${updatedUser.id}/update/`,
        updatedUser
      );
      console.log(response.data);
      onUserUpdated(); // Callback to refresh user list or parent state
      closeModal();    // Close the edit modal
    } catch (error) {
      console.error('Error updating user:', error);
      alert('There was an error updating the user. Please try again later.');
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <div>
      {/* Main Update Modal */}
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          <form onSubmit={handleUpdateClick}>
            {/* Last Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={updatedUser.lastname || ''}
                onChange={handleChange}
                className={`w-full border ${errors.lastname ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              />
              {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
            </div>
            {/* First Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={updatedUser.firstname || ''}
                onChange={handleChange}
                className={`w-full border ${errors.firstname ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              />
              {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
            </div>
            {/* Middle Initial Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Middle Initial</label>
              <input
                type="text"
                name="middleinitial"
                value={updatedUser.middleinitial || ''}
                onChange={handleChange}
                className={`w-full border ${errors.middleinitial ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              />
              {errors.middleinitial && <p className="text-red-500 text-xs mt-1">{errors.middleinitial}</p>}
            </div>
            {/* Address Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={updatedUser.address || ''}
                onChange={handleChange}
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            {/* User Type Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                name="usertype"
                value={updatedUser.usertype || 'Personnel'}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
              >
                <option value="Personnel">Personnel</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {/* Username Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={updatedUser.username || ''}
                onChange={handleChange}
                className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            {/* Buttons */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Update User
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Update</h3>
            <p className="mb-6">Are you sure you want to update this member's information?</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
