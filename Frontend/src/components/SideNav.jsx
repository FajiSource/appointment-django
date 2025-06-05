import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SideNav() {
    const [hoveredItem, setHoveredItem] = useState(null)
    const { user } = useAuth()

    return (
        <div className="relative flex">
            <ul className="flex flex-col justify-center items-center h-screen gap-3 p-5 bg-blue-500 w-20 border border-yellow-300">
                <div className="flex flex-col gap-5">
                    {/* Dashboard */}
                    <li
                        className="relative"
                        onMouseEnter={() => setHoveredItem('dashboard')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Link to="/dashboard">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                    hoveredItem === 'dashboard' ? 'bg-blue-700' : ''
                                }`}
                            >
                                <div className="bg-[url('./resources/icons/DashB.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                            </div>
                        </Link>
                        {hoveredItem === 'dashboard' && (
                            <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                Dashboard
                            </span>
                        )}
                    </li>

                    {/* Users (Admin Only) */}
                    {user?.usertype === 'HeadOfOffice' ? (
                        <li
                            className="relative"
                            onMouseEnter={() => setHoveredItem('user')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link to="/user">
                                <div className={`w-12 h-12 flex items-center justify-center rounded-md ${hoveredItem === 'user' ? 'bg-blue-700' : ''}`}>
                                    <div className="bg-[url('./resources/icons/users.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                                </div>
                            </Link>
                            {hoveredItem === 'user' && (
                                <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                    Users
                                </span>
                            )}
                        </li>
                    ) : (
                        console.log("User is not admin or user is null:", user)
                    )}

                    {/* Members */}
                    <li
                        className="relative"
                        onMouseEnter={() => setHoveredItem('member')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Link to="/member">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                    hoveredItem === 'member' ? 'bg-blue-700' : ''
                                }`}
                            >
                                <div className="bg-[url('./resources/icons/members.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                            </div>
                        </Link>
                        {hoveredItem === 'member' && (
                            <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                Members
                            </span>
                        )}
                    </li>

                    {/* Loans */}
                    <li
                        className="relative"
                        onMouseEnter={() => setHoveredItem('loans')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Link to="/loans">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                    hoveredItem === 'loans' ? 'bg-blue-700' : ''
                                }`}
                            >
                                <div className="bg-[url('./resources/icons/loan.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                            </div>
                        </Link>
                        {hoveredItem === 'loans' && (
                            <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                Loans
                            </span>
                        )}
                    </li>

                    {/* Report Generation */}
                    <li
                        className="relative"
                        onMouseEnter={() => setHoveredItem('reportgen')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Link to="/reportgen">
                            <div
                                className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                    hoveredItem === 'reportgen' ? 'bg-blue-700' : ''
                                }`}
                            >
                                <div className="bg-[url('./resources/icons/reportgen.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                            </div>
                        </Link>
                        {hoveredItem === 'reportgen' && (
                            <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                Generate Reports
                            </span>
                        )}
                    </li>

                    {/* Backup (Admin Only) */}
                    {user?.usertype === 'Admin' && (
                        <li
                            className="relative"
                            onMouseEnter={() => setHoveredItem('backup')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link to="/Backup">
                                <div
                                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                        hoveredItem === 'backup' ? 'bg-blue-700' : ''
                                    }`}
                                >
                                    <div className="bg-[url('./resources/icons/backup.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                                </div>
                            </Link>
                            {hoveredItem === 'backup' && (
                                <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                    Backup
                                </span>
                            )}
                        </li>
                    )}

                    {/* Restore (Admin Only) */}
                    {user?.usertype === 'Admin' && (
                        <li
                            className="relative"
                            onMouseEnter={() => setHoveredItem('restore')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link to="/restore">
                                <div
                                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                        hoveredItem === 'restore' ? 'bg-blue-700' : ''
                                    }`}
                                >
                                    <div className="bg-[url('./resources/icons/restore.png')] bg-contain bg-no-repeat bg-center w-9 h-9 invert"></div>
                                </div>
                            </Link>
                            {hoveredItem === 'restore' && (
                                <span className="absolute left-[5rem] top-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                                    Restore
                                </span>
                            )}
                        </li>
                    )}
                </div>
            </ul>
        </div>
    )
}
