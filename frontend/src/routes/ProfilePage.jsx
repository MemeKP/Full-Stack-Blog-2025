import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage = () => {
    const { userId } = useParams();

  return (
    <div>
        <h1>Welcome to {userId}'s profile</h1>
        {/* แล้วจะใช้ userId เพื่อไป fetch ข้อมูลจาก backend อีกที*/}
    </div>
  )
}

export default ProfilePage