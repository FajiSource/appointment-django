import { useState } from 'react';

export default function UserSearch({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle search on submit
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        // If searchQuery is empty, fetch all users by sending empty string or some keyword
        onSearch(searchQuery.trim());
    };

    return (
        <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                Search
            </button>
        </form>
    );
}
