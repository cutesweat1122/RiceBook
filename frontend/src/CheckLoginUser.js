import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setProfile } from './features/users/curUserSlice'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { fetchProfile } from './utils'

export default function CheckLoginUser() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`/api/headline`)
      .then((res) => fetchProfile(res.data.username))
      .then((profile) => {
        dispatch(setProfile(profile))
        if (
          location.pathname === '/login' ||
          location.pathname === '/register'
        ) {
          navigate('/')
        }
      })
      .catch((err) => {
        navigate('/login')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return loading ? (
    <div className='text-center mt-5'>
      <h1>Loading...</h1>
    </div>
  ) : (
    <Outlet />
  )
}
