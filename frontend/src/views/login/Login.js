// import router
import { useNavigate } from 'react-router-dom'
// import redux
import { useDispatch } from 'react-redux'
import { setCurUser } from '../../features/users/curUserSlice'
// import useState
import { useState } from 'react'
// import react bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
// import scss
import './Login.scss'
import axios from 'axios'
import { fetchProfile } from '../../utils'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [accountNameInput, setAccountNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginHelpText, setLoginHelpText] = useState('')

  const handleLoginClick = async () => {
    if (accountNameInput && passwordInput) {
      try {
        // verify login info
        const { data } = await axios.post(`/api/login`, {
          username: accountNameInput,
          password: passwordInput,
        })
        // set cur user
        const profile = await fetchProfile(data.username)
        dispatch(setCurUser(profile))
        // redirect to main page
        navigate('/')
      } catch (error) {
        if (error.response?.data?.result) {
          setLoginHelpText(error.response.data.result)
        } else {
          setLoginHelpText('login failed')
        }
      }
    }
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <Container className='px-md-5'>
      <h1 className='text-center my-5'>Hello World!</h1>

      <div className='m-5 px-5'>
        <div className='roundedBlock mx-md-5 px-md-5 px-3 py-5'>
          <Form className='text-center'>
            <Form.Group className='mb-3 px-5' controlId='accountName'>
              <Form.Control
                type='text'
                placeholder='Account Name'
                onChange={(e) => setAccountNameInput(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3 px-5' controlId='password'>
              <Form.Control
                type='password'
                placeholder='Password'
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </Form.Group>
            <Form.Text id='loginHelpBlock' className='alert'>
              {loginHelpText}
            </Form.Text>
            <br />
            <Button className='mt-3' onClick={handleLoginClick}>
              login
            </Button>
            <Button
              className='mt-3'
              // href={`http://localhost:8080/api/auth/google?redirect=${window.location.origin}/`}
              href={`/api/auth/google?redirect=${window.location.origin}/`}
            >
              login with Google
            </Button>
            <hr />
            <Button onClick={handleRegisterClick}>register</Button>
          </Form>
        </div>
      </div>
    </Container>
  )
}

export default Login
