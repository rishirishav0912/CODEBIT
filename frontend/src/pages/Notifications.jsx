import { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import useNotifications from '../hooks/useNotifications'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { fetchNotifications } = useNotifications();


  const notificationData = async () => {
    console.log("hello")
    const data = await fetchNotifications();
    setNotifications([...data]);
  }

  useEffect(() => {
    notificationData();

  },[]);

  return (
    <div className="w-full bg-[#181C21]s bg-[#171717] flex">
      <Navbar />
      <div className="w-[65vw] min-h-screen py-10 bg-[#171717] flex flex-col gap-10 ml-40 mt-20">

        {notifications.map((notification,index) => {
          return (
            notification.userid === 'rishirishav912@gmail.com' ?
              (
                notification.type === 'team-register' &&
                <div className='bg-[#262626] w-[70%] h-[20%] rounded-md px-8 pt-4 text-green-500s text-[#E5E5E5] hover:border-[#174337] border-2 border-transparent duration-200 hover:scale-105' key={index}>
                  <p className='mb-2 text-lg'>{notification.text}</p>
                  <button className='bg-[#1D332D] text-[#34D399] p-2 px-4 rounded-3xl'>Accept</button>
                  <button className='ml-10 bg-[#412424] text-[#F8664B] p-2 px-4 rounded-3xl'>Cancel</button>
                </div>
              )
              :
              <>

              </>
          )
        })}
      </div>
    </div>
  )
}

export default Notifications