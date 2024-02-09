import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

export default function Post({ post, editPost, fetchPosts }) {
  const { comments, author, text, date, id, image } = post
  const curUser = useSelector((state) => state.curUser)
  const [showComment, setShowComment] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [newPost, setNewPost] = useState(text)

  const handleCloseEdit = () => setShowEdit(false)
  const handleShowEdit = () => setShowEdit(true)
  const handleSubmitEdit = () => {
    if (newPost !== text) {
      editPost(id, newPost)
    }
    handleCloseEdit()
  }

  const handleNewComment = async () => {
    if (newComment) {
      try {
        await axios.put(`/api/articles/${id}`, {
          text: newComment,
          commentId: -1,
        })
        setNewComment('')
        fetchPosts()
      } catch (error) {}
    }
  }

  return (
    <>
      <Row className='mb-3'>
        <Col>
          {post.author} {Date(date).slice(0, 15)}
        </Col>
        <Col
          className={`text-end ${author === curUser.username ? '' : 'd-none'}`}
        >
          <Button variant='primary' onClick={handleShowEdit}>
            edit
          </Button>
        </Col>

        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId='newBody'>
              <Form.Control
                as='textarea'
                rows={3}
                size='sm'
                placeholder='type something...'
                onChange={(e) => setNewPost(e.target.value)}
                value={newPost}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseEdit}>
              Close
            </Button>
            <Button variant='primary' onClick={handleSubmitEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
      {/* <p className='fw-bold'>{post.title}</p> */}
      <p className='post-contetn'>{text}</p>

      <div className='text-center'>
        {image && <img src={image} alt='post' className='w-100' />}

        <Button
          className='text-center my-3'
          onClick={() => setShowComment(!showComment)}
        >
          comment
        </Button>

        <ListGroup className={`${!showComment && 'd-none'} text-start`}>
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              postId={id}
              fetchPosts={fetchPosts}
            />
          ))}
          <ListGroup.Item className='bg-secondary d-flex justify-content-between'>
            <Form.Group controlId='newComment' className='w-100 me-3'>
              <Form.Control
                size='sm'
                type='text'
                placeholder='new comment'
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
              />
            </Form.Group>
            <Button size='sm' onClick={handleNewComment}>
              post
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </>
  )
}

const CommentItem = ({ comment, postId, fetchPosts }) => {
  const { id, author, text, created } = comment
  const curUsername = useSelector((state) => state.curUser.username)
  const [showEdit, setShowEdit] = useState(false)
  const [newPost, setNewPost] = useState(text)

  const handleCloseEdit = () => setShowEdit(false)
  const handleShowEdit = () => setShowEdit(true)
  const handleSubmitEdit = () => {
    if (newPost !== text) {
      editComment(id, newPost)
    }
    handleCloseEdit()
  }

  const editComment = async (id, text) => {
    try {
      await axios.put(`/api/articles/${postId}`, {
        text,
        commentId: id,
      })
      fetchPosts()
    } catch (error) {}
  }

  return (
    <ListGroup.Item className='bg-secondary'>
      <div className='d-flex justify-content-between'>
        <div>
          {author}: {text}
        </div>
        <Button
          variant='light'
          onClick={handleShowEdit}
          className={`text-end ${author === curUsername ? '' : 'd-none'}`}
        >
          edit
        </Button>
      </div>
      <div className='text-end'>{Date(created).slice(0, 15)}</div>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='newBody'>
            <Form.Control
              as='textarea'
              rows={3}
              size='sm'
              placeholder='type something...'
              onChange={(e) => setNewPost(e.target.value)}
              value={newPost}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSubmitEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </ListGroup.Item>
  )
}
