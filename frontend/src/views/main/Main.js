// import router
import { useNavigate } from 'react-router-dom'
// import useEffect, useState
import { useEffect, useState } from 'react'
// import redux
import { useDispatch, useSelector } from 'react-redux'
import { delCurUser, setProfile } from '../../features/users/curUserSlice'
// import react bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
// import components
import Post from './post/Post'
// import scss
import './Main.scss'
import axios from 'axios'
import { fetchProfile } from '../../utils'
import ReactPaginate from 'react-paginate'

function Main() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState([])

  const curUser = useSelector((state) => state.curUser)
  const [searchPostText, setSearchPostText] = useState([])
  const [stateText, setStateText] = useState(null)
  const [newPost, setNewPost] = useState('')
  const [newPostFormDOM, setNewPostFormDOM] = useState(null)
  const [newFollower, setNewFollower] = useState('')
  const [fileSelect, setFileSelect] = useState(null)

  // We start with an empty list of items.
  const [pageCount, setPageCount] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 10
  useEffect(() => {
    fetchPosts()
  }, [itemOffset])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalPosts
    setItemOffset(newOffset)
  }

  const fetchPosts = async () => {
    try {
      const {
        data: { articles, articlesCount },
      } = await axios.get(`/api/articles`, {
        params: { limit: itemsPerPage, offset: itemOffset },
      })
      setPosts(articles)
      setPageCount(Math.ceil(articlesCount / itemsPerPage))
      setTotalPosts(articlesCount)
    } catch (error) {}
  }

  const fetchFollowing = async () => {
    try {
      const {
        data: { following },
      } = await axios.get(`/api/following/${curUser.username}`)
      setFollowing(await Promise.all(following.map((f) => fetchProfile(f))))
    } catch (error) {}
  }

  useEffect(() => {
    fetchPosts()
    fetchFollowing()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [following])

  const handleLogout = async () => {
    dispatch(delCurUser())
    await axios.put(`/api/logout`)
    navigate('/login')
  }

  const handleUpdateStateClick = async () => {
    if (!stateText) return
    try {
      await axios.put(`/api/headline`, { headline: stateText })
      dispatch(setProfile({ headline: stateText }))
      setStateText('')
    } catch (error) {}
  }

  const handleNewPost = (e) => {
    setNewPost(e.target.value)
  }

  const handleCancelClick = () => {
    newPostFormDOM.reset()
  }

  const uploadImage = async () => {
    if (!fileSelect) {
      return
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

  const handlePostClick = async () => {
    if (!newPost) return
    const body = { text: newPost }
    if (fileSelect) {
      const { url } = await uploadImage()
      body.image = url
    }

    try {
      await axios.post(`/api/article`, body)
      fetchPosts()
      handleCancelClick()
    } catch (error) {}
  }

  const handleUnfollow = async (id) => {
    try {
      const {
        data: { following },
      } = await axios.delete(`/api/following/${id}`)
      setFollowing(await Promise.all(following.map((f) => fetchProfile(f))))
    } catch (error) {}
  }

  const handleAddFollower = async () => {
    try {
      const {
        data: { following },
      } = await axios.put(`/api/following/${newFollower}`)
      const newFollowing = await Promise.all(
        following.map((f) => fetchProfile(f))
      )
      setFollowing(newFollowing)
    } catch (error) {
    } finally {
      setNewFollower('')
    }
  }

  const editPost = async (id, text) => {
    try {
      await axios.put(`/api/articles/${id}`, { text })
      fetchPosts()
    } catch (error) {}
  }

  return (
    <Container fluid className=''>
      <Row className='py-2 mb-3 sticky-top bg-secondary align-items-center'>
        <Col md={3} className='my-auto'>
          <div className='d-flex'>
            <Image
              src={curUser.avatar}
              roundedCircle
              width='50px'
              className='me-3'
              role='button'
              onClick={() => navigate('/profile')}
            />
            <div>
              {curUser.username}
              <p className='mb-0 small'>{curUser.headline}</p>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <Form.Control
            type='text'
            placeholder='Search Posts'
            onChange={(e) => setSearchPostText(e.target.value)}
          />
        </Col>
        <Col md={3} className='text-end my-auto'>
          <Button onClick={handleLogout}>Logout</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md={{ span: 3, order: '1' }} xs={{ span: 12, order: '1' }}>
          <Container className='text-center'>
            <div className='updateStatusBlock px-md-3 px-3 py-4'>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdateStateClick()
                }}
              >
                <Form.Group className='px-2' controlId='newStatus'>
                  <Form.Control
                    size='sm'
                    type='text'
                    placeholder='new status'
                    onChange={(e) => setStateText(e.target.value)}
                    value={stateText}
                  />
                </Form.Group>
                <br />
                <Button size='sm' onClick={handleUpdateStateClick}>
                  update
                </Button>
              </Form>
            </div>
          </Container>

          <br />
          <Container className='text-center'>
            <div className='newPostBlock px-md-3 px-3 py-4'>
              <Form
                ref={(form) => setNewPostFormDOM(form)}
                onSubmit={(e) => {
                  e.preventDefault()
                  handlePostClick()
                }}
                className='px-2'
              >
                <Form.Group controlId='newBody'>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    size='sm'
                    placeholder='type something...'
                    onChange={handleNewPost}
                  />
                </Form.Group>
                <br />
                <Form.Group controlId='newImage'>
                  <Form.Control
                    size='sm'
                    type='file'
                    onChange={(e) => setFileSelect(e.target.files[0])}
                  />
                </Form.Group>
                <br />
                <div className='d-flex justify-content-between'>
                  <Button size='sm' onClick={handleCancelClick}>
                    cancel
                  </Button>
                  <Button size='sm' onClick={handlePostClick}>
                    post
                  </Button>
                </div>
              </Form>
            </div>
          </Container>
        </Col>

        <Col
          md={{ span: 6, order: '2' }}
          xs={{ span: 12, order: '3' }}
          className='postBlock p-3'
        >
          {posts
            .filter(
              (p) =>
                !searchPostText ||
                p.text.includes(searchPostText) ||
                p.author.includes(searchPostText)
            )
            .map((p, idx) => (
              <>
                <Post
                  key={idx}
                  post={p}
                  editPost={editPost}
                  fetchPosts={fetchPosts}
                />
                {idx < posts.length - 1 && <hr />}
              </>
            ))}

          <ReactPaginate
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel='previous'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            breakLabel='...'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination'
            activeClassName='active'
            renderOnZeroPageCount={null}
          />
        </Col>

        <Col md={{ span: 3, order: '3' }} xs={{ span: 12, order: '2' }}>
          <div className='followerBlock p-3'>
            {following.map((u, idx) => (
              <FollowerItem
                key={idx}
                name={u.username}
                status={u.headline}
                img={u.avatar}
                handleUnfollow={handleUnfollow}
              />
            ))}
            <Form.Control
              type='text'
              placeholder='User'
              onChange={(e) => setNewFollower(e.target.value)}
              value={newFollower}
            />
            <Button size='sm' onClick={handleAddFollower}>
              add
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

const FollowerItem = ({ name, status, img, handleUnfollow }) => {
  return (
    <div>
      <div className='d-flex align-items-center mb-1'>
        <Image src={img} roundedCircle width='50px' className='me-3' />
        <p className='mb-0'>{name}</p>
      </div>
      <p className='mb-0'>{status}</p>
      <div className='text-end'>
        <Button
          variant='link'
          size='sm'
          className='p-0 text-black'
          onClick={() => handleUnfollow(name)}
          data-testid={`unfollow-${name}`}
        >
          unfollow
        </Button>
      </div>
      <hr />
    </div>
  )
}

export default Main
