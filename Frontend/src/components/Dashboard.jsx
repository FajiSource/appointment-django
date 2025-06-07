import React, { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    const match = document.cookie.match(/access_token=[^;]+/)
    console.log("token from cookie: ",match);
  },[])
  return (
    <div>
      <label>Page: Dashboard</label><br/>
      <label>Slated for Development</label>
    </div>
  )
}
