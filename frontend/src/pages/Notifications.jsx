import { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import useNotifications from '../hooks/useNotifications'
import { useAuthContext } from '../hooks/useAuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { fetchNotifications, acceptNotifications, rejectNotification } = useNotifications();
  const { user } = useAuthContext();

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

        {notifications.map((notification, index) => {
          return (
            !user ? <></> : notification.userid === user.userid ?
              (
                notification.type === 'team-register' &&
                <div className='bg-[#262626] w-[70%] h-fit rounded-md px-8 pt-4 pb-2 text-green-500s text-[#E5E5E5] hover:border-[#174337] border-2 border-transparent duration-200 hover:scale-105' key={index}>
                  <p className='mb-2 text-lg h-fit w-full break-words'>{notification.text}</p>
                  <button className='bg-[#1D332D] text-[#34D399] p-2 px-4 rounded-3xl' onClick={() => acceptNotifications(notification._id)}>Accept</button>
                  <button className='ml-10 bg-[#412424] text-[#F8664B] p-2 px-4 rounded-3xl' onClick={()=> rejectNotification(notification._id)}>Cancel</button>
                </div>
              )
              :
              <div key={index}>

              </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notifications