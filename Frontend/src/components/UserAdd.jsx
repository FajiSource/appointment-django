import { useState } from 'react';
import axios from 'axios';

export default function UserAdd({ onUserAdded }) {
    // State to control whether the Add User modal is visible
    const [showModal, setShowModal] = useState(false);
    // State to control whether the confirmation dialog is visible
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Form field states
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [middleinitial, setMiddleinitial] = useState('');
    const [address, setAddress] = useState('');
    const [usertype, setUsertype] = useState('Admin');  // Default user type set to 'Admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State to hold validation error messages for each field
    const [errors, setErrors] = useState({
        lastname: '',
        firstname: '',
        middleinitial: '',
        address: '',
        username: '',
        password: '',
    });

    /**
     * Validate form fields before submission.
     * Sets error messages for invalid fields and returns boolean indicating form validity.
     */
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            lastname: '',
            firstname: '',
            middleinitial: '',
            address: '',
            username: '',
            password: '',
        };
        
        // Validate last name: must not be empty
        if (!lastname.trim()) {
            newErrors.lastname = 'Last name is required';
            isValid = false;
        }
        
        // Validate first name: must not be empty
        if (!firstname.trim()) {
            newErrors.firstname = 'First name is required';
            isValid = false;
        }
        
        // Validate middle initial: optional, but if provided must be a single character
        if (middleinitial && middleinitial.length > 1) {
            newErrors.middleinitial = 'Middle initial should be a single character';
            isValid = false;
        }
        
        // Validate address: must not be empty
        if (!address.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
        }
        
        // Validate username: must not be empty and at least 4 characters
        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
            isValid = false;
        }
        
        // Validate password: must not be empty and at least 8 characters
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }
        
        // Update the error state
        setErrors(newErrors);
        return isValid;
    };

    /**
     * Sends a POST request to add a new user.
     * Clears the form and closes the modal on success.
     * Calls the onUserAdded callback to update the user list.
     */
    const handleAddUser = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/create/', {
                lastname,
                firstname,
                middleinitial,
                address,
                // Ensure usertype's first letter is uppercase and rest lowercase
                usertype: usertype.charAt(0).toUpperCase() + usertype.slice(1),
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Clear all input fields after successful submission
            setLastname('');
            setFirstname('');
            setMiddleinitial('');
            setAddress('');
            setUsertype('Admin');
            setUsername('');
            setPassword('');
            setShowModal(false);

            // Notify parent component to refresh user list or perform other actions
            onUserAdded();
        } catch (error) {
            // Log any errors from the server or network
            console.error('Error adding user:', error.response ? error.response.data : error.message);
        }
    };

    /**
     * Handler called when the user confirms addition in the confirmation dialog.
     * Proceeds to add the user by calling handleAddUser().
     */
    const handleConfirm = () => {
        setShowConfirmation(false);
        handleAddUser();
    };

    /**
     * Handler to cancel the confirmation dialog.
     * Simply closes the confirmation modal.
     */
    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };
    
    /**
     * Handles the form submission.
     * Validates the form and if valid, shows the confirmation dialog.
     */
    const handleSubmit = () => {
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };

    return (
        <>
            {/* Button to open the Add User modal */}
            <button
                onClick={() => setShowModal(true)}
                className="h-10 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add User
            </button>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add User</h2>

                        {/* Last Name Input */}
                        <div className="mb-2">
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                placeholder="Last Name"
                                className={`w-full border rounded-md px-3 py-2 ${errors.lastname ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if last name validation failed */}
                            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                        </div>

                        {/* First Name Input */}
                        <div className="mb-2">
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="First Name"
                                className={`w-full border rounded-md px-3 py-2 ${errors.firstname ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if first name validation failed */}
                            {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                        </div>

                        {/* Middle Initial Input */}
                        <div className="mb-2">
                            <input
                                type="text"
                                value={middleinitial}
                                onChange={(e) => setMiddleinitial(e.target.value)}
                                placeholder="Middle Initial"
                                className={`w-full border rounded-md px-3 py-2 ${errors.middleinitial ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if middle initial validation failed */}
                            {errors.middleinitial && <p className="text-red-500 text-xs mt-1">{errors.middleinitial}</p>}
                        </div>

                        {/* Address Input */}
                        <div className="mb-2">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Address"
                                className={`w-full border rounded-md px-3 py-2 ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if address validation failed */}
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Username Input */}
                        <div className="mb-2">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className={`w-full border rounded-md px-3 py-2 ${errors.username ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if username validation failed */}
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="mb-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full border rounded-md px-3 py-2 ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {/* Display error if password validation failed */}
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* User Type Selector */}
                        <div className="mb-4">
                            <select
                                value={usertype}
                                onChange={(e) => setUsertype(e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Personnel">Personnel</option>
                            </select>
                        </div>

                        {/* Action buttons: Add and Cancel */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-3">Confirm User Addition</h2>
                        <div className="mb-4">
                            <p className="mb-2">Are you sure you want to add this user with the following details?</p>
                            <div className="bg-gray-50 p-3 rounded-md text-sm">
                                <p><span className="font-medium">Name:</span> {firstname} {middleinitial} {lastname}</p>
                                <p><span className="font-medium">Address:</span> {address}</p>
                                <p><span className="font-medium">Username:</span> {username}</p>
                                <p><span className="font-medium">User Type:</span> {usertype}</p>
                                {/* Masked password display */}
                                <p><span className="font-medium">Password:</span> {'•'.repeat(password.length > 0 ? 8 : 0)}</p>
                            </div>
                        </div>
                        {/* Confirmation action buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancelConfirmation}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
