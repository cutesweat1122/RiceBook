// import router
import { useNavigate } from 'react-router-dom'
// import useState
import { useState } from 'react'
// import redux
import { useDispatch } from 'react-redux'
import { setCurUser } from '../../features/users/curUserSlice'
// import react bootstrap
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
// import scss
import './Register.scss'
import axios from 'axios'
import { fetchProfile } from '../../utils'

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [validated, setValidated] = useState(false)
  const [accountNameInput, setAccountNameInput] = useState(null)
  const [emailInput, setEmailInput] = useState(null)
  const [phoneInput, setPhoneInput] = useState(null)
  const [birthdayInput, setBirthdayInput] = useState(null)
  const [zipInput, setZipInput] = useState(null)
  const [passwordInput, setPasswordInput] = useState(null)
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState(null)
  const [helpText, setHelpText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setValidated(true)
    if (form.checkValidity() === false) {
      return
    } else if (passwordInput && passwordInput === passwordConfirmationInput) {
      // set users
      const newUser = {
        username: accountNameInput,
        password: passwordInput,
        email: emailInput,
        phone: phoneInput,
        dob: birthdayInput,
        zipcode: zipInput,
      }

      try {
        // create new user
        await axios.post(`/api/register`, newUser)
        const profile = await fetchProfile(accountNameInput)
        dispatch(setCurUser(profile))
        navigate('/')
      } catch (error) {
        if (error.response?.data?.result) {
          setHelpText(error.response.data.result)
        } else {
          setHelpText('register failed')
        }
      }
    }
  }

  const createAccountNameHint = () => {
    return (
      '*enter letters and numbers(optional)' + '\n' + '*starts with a letter'
    )
  }

  return (
    <Container className='px-md-5'>
      <h1 className='text-center my-5'>Register</h1>

      <div className='m-5 px-5'>
        <div className='roundedBlock mx-md-5 px-md-5 px-3 py-5'>
          <Form
            noValidate
            validated={validated}
            className='px-5'
            onSubmit={handleSubmit}
          >
            <Form.Label className='mb-0'>Account Name</Form.Label>
            <Form.Group className='mb-3' controlId='accountName'>
              <Form.Control
                required
                size='sm'
                type='text'
                pattern='[a-zA-Z]{1}[a-zA-Z0-9]{0,30}'
                onChange={(e) => setAccountNameInput(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                {createAccountNameHint()}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Email</Form.Label>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Control
                required
                size='sm'
                type='email'
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                invalid email
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Phone Number</Form.Label>
            <Form.Group className='mb-3' controlId='phone'>
              <Form.Control
                required
                size='sm'
                type='tel'
                pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                format: 123-123-1234
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Date of Birth</Form.Label>
            <Form.Group className='mb-3' controlId='birthday'>
              <Form.Control
                required
                size='sm'
                type='date'
                onChange={(e) => setBirthdayInput(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                invalid date of birth
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Zip Code</Form.Label>
            <Form.Group className='mb-3' controlId='zip'>
              <Form.Control
                required
                size='sm'
                type='text'
                pattern='[0-9]{5}'
                onChange={(e) => setZipInput(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                format: 12345
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Password</Form.Label>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Control
                required
                size='sm'
                type='password'
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </Form.Group>

            <Form.Label className='mb-0'>Password Confirmation</Form.Label>
            <Form.Group className='mb-3' controlId='passwordConfirmation'>
              <Form.Control
                required
                size='sm'
                type='password'
                onChange={(e) => setPasswordConfirmationInput(e.target.value)}
                isInvalid={
                  passwordConfirmationInput !== passwordInput ||
                  !passwordConfirmationInput
                }
              />
              <Form.Control.Feedback type='invalid'>
                Password and Password Confirmation do not match.
              </Form.Control.Feedback>
            </Form.Group>

            <div className='text-center'>
              <Form.Text id='helpBlock' className='alert'>
                {helpText}
              </Form.Text>
              <Button className='mt-3' type='submit'>
                submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  )
}

export default Register
