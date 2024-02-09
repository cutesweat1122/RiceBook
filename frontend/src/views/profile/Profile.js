import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { setCurUser } from '../../features/users/curUserSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

export default function Profile() {
  const curUser = useSelector((s) => s.curUser)
  const dispatch = useDispatch()
  const [validated, setValidated] = useState(false)
  const [emailInput, setEmailInput] = useState(curUser.email)
  const [phoneInput, setPhoneInput] = useState(curUser.phone)
  const [zipInput, setZipInput] = useState(curUser.zipcode)
  const [googleId, setGoogleId] = useState('')
  const [fileSelect, setFileSelect] = useState(null)

  useEffect(() => {
    axios.get(`/api/google`).then((res) => {
      setGoogleId(res.data.googleId)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const form = e.currentTarget
    if (form.checkValidity() === false) return

    // upload image
    const { url } = await uploadImage()

    // set users
    const newCurUser = {
      ...curUser,
      email: emailInput,
      phone: phoneInput,
      zipcode: zipInput,
      avatar: url,
    }
    const promises = []
    if (emailInput !== curUser.email) {
      promises.push(axios.put(`/api/email`, { email: emailInput }))
    }
    if (phoneInput !== curUser.phone) {
      promises.push(axios.put(`/api/phone`, { phone: phoneInput }))
    }
    if (zipInput !== curUser.zipcode) {
      promises.push(axios.put(`/api/zipcode`, { zipcode: zipInput }))
    }
    if (url !== curUser.avatar) {
      promises.push(axios.put(`/api/avatar`, { avatar: url }))
    }
    await Promise.all(promises)
    // set cur user
    dispatch(setCurUser(newCurUser))
    setValidated(true)
  }

  const uploadImage = async () => {
    if (!fileSelect) {
      return { url: curUser.avatar }
    }
    const formData = new FormData()
    formData.append('image', fileSelect)
    formData.append('title', `${curUser.username}'s avatar`)
    const { data } = await axios.post(`/api/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  return (
    <Container className='px-md-5'>
      <h1 className='text-center my-5'>Profile</h1>

      <div className='m-5 px-5'>
        <div className='roundedBlock mx-md-5 px-md-5 px-3 py-5'>
          <div className='d-flex align-items-center mb-2'>
            <Image
              src={curUser.avatar}
              roundedCircle
              width='50px'
              className='me-3'
            />
            {curUser.username}
          </div>
          <Form.Control
            type='file'
            className='mb-3'
            onChange={(e) => setFileSelect(e.target.files[0])}
          />

          <Form
            noValidate
            validated={validated}
            className='px-5'
            onSubmit={handleSubmit}
          >
            <Form.Label className='mb-0'>Email</Form.Label>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Control
                required
                size='sm'
                type='email'
                onChange={(e) => setEmailInput(e.target.value)}
                value={emailInput}
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
                value={phoneInput}
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
                disabled
                value={curUser.dob?.replace(/\//g, '-')}
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
                value={zipInput}
              />
              <Form.Control.Feedback type='invalid'>
                format: 12345
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label className='mb-0'>Google Account</Form.Label>
            <Form.Group className='mb-3' controlId='google'>
              {googleId ? (
                <>
                  <Form.Control
                    size='sm'
                    type='text'
                    value={googleId}
                    disabled
                  />
                  <Button
                    className='mt-3'
                    onClick={() => {
                      axios.delete(`/api/google`).then((res) => {
                        setGoogleId('')
                      })
                    }}
                  >
                    Unlink with Google
                  </Button>
                </>
              ) : (
                <Button
                  className='mt-3'
                  // href={`http://localhost:8080/api/auth/google?redirect=${window.location.origin}/profile`}
                  href={`/api/auth/google?redirect=${window.location.origin}/profile`}
                >
                  Link with Google
                </Button>
              )}
            </Form.Group>

            <div className='text-center'>
              <Button className='mt-3' type='submit'>
                update
              </Button>
            </div>
            <div className='text-center'>
              <Link to='/'>
                <Button className='mt-3' type='submit'>
                  back
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  )
}
