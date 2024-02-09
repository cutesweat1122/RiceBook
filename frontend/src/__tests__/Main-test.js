import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../utils/test-utils'
import { setCurUser } from '../features/users/curUserSlice'
import Main from '../views/main/Main'
import { act } from 'react-dom/test-utils'

afterEach(cleanup)

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Main Page', () => {
  let renderResult

  const users = [
    {
      id: 1,
      accountName: 'Bret',
      username: 'Leanne Graham',
      email: 'Sincere@april.biz',
      phone: '1-770-736-8031 x56442',
      birthday: '2023/09/09',
      zip: '92998-3874',
      password: 'Kulas Light',
      img: 'https://picsum.photos/id/64/60/60',
      status: "I'm busy now...",
    },
    {
      id: 2,
      accountName: 'Antonette',
      username: 'Ervin Howell',
      email: 'Shanna@melissa.tv',
      phone: '010-692-6593 x09125',
      birthday: '2023/09/09',
      zip: '90566-7771',
      password: 'Victor Plains',
      img: 'https://picsum.photos/id/64/60/60',
      status: "I'm busy now...",
    },
    {
      id: 3,
      accountName: 'Samantha',
      username: 'Clementine Bauch',
      email: 'Nathan@yesenia.net',
      phone: '1-463-123-4447',
      birthday: '2023/09/09',
      zip: '59590-4157',
      password: 'Douglas Extension',
      img: 'https://picsum.photos/id/64/60/60',
      status: "I'm busy now...",
    },
  ]

  const followedUsers = {
    1: [2, 3],
    2: [1],
    3: [1],
  }

  const posts = [
    {
      userId: 1,
      id: 100,
      title: 'at nam consequatur ea labore ea harum',
      body: 'cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut',
      time: '2023/09/09',
      img: 'https://picsum.photos/id/237/400/300',
    },
    {
      userId: 2,
      id: 99,
      title: 'temporibus sit alias delectus eligendi possimus magni',
      body: 'quo deleniti praesentium dicta non quod\naut est molestias\nmolestias et officia quis nihil\nitaque dolorem quia',
      time: '2023/09/09',
      img: 'https://picsum.photos/id/237/400/300',
    },
    {
      userId: 3,
      id: 98,
      title: 'laboriosam dolor voluptates',
      body: 'doloremque ex facilis sit sint culpa\nsoluta assumenda eligendi non ut eius\nsequi ducimus vel quasi\nveritatis est dolores',
      time: '2023/09/09',
      img: 'https://picsum.photos/id/237/400/300',
    },
  ]

  beforeEach(() => {
    act(() => {
      renderResult = renderWithProviders(<Main />, {
        preloadedState: { users, posts, curUser: users[1], followedUsers },
      })
    })
  })

  it('should fetch all articles for current logged in user (posts state is set)', async () => {
    const { queryByText } = renderResult

    // should show the posts of the current user and followed users
    let userId = users[1].id
    let postFeed = [...followedUsers[userId], userId]
    posts.forEach((post) => {
      if (postFeed.includes(post.userId)) {
        expect(queryByText(post.title)).toBeInTheDocument()
      } else {
        expect(queryByText(post.title)).not.toBeInTheDocument()
      }
    })

    // login user[2]
    act(() => {
      renderResult.store.dispatch(setCurUser(users[2]))
    })
    userId = users[2].id
    postFeed = [...followedUsers[userId], userId]
    posts.forEach((post) => {
      if (postFeed.includes(post.userId)) {
        expect(queryByText(post.title)).toBeInTheDocument()
      } else {
        expect(queryByText(post.title)).not.toBeInTheDocument()
      }
    })
  })

  it('should fetch subset of articles for current logged in user given search keyword (posts state is filtered)', async () => {
    const { queryByText, getByPlaceholderText } = renderResult

    // type search keyword
    act(() => {
      fireEvent.change(getByPlaceholderText('Search Posts'), {
        target: { value: 'cupiditate' },
      })
    })

    // should show the posts of the current user and followed users
    const userId = users[1].id
    const postFeed = [...followedUsers[userId], userId]
    posts.forEach((post) => {
      if (post.body.includes('cupiditate') && postFeed.includes(post.userId)) {
        expect(queryByText(post.title)).toBeInTheDocument()
      } else {
        expect(queryByText(post.title)).not.toBeInTheDocument()
      }
    })
  })

  it('should add articles when adding a follower (posts state is larger )', async () => {
    const { queryByText, getByText, getByPlaceholderText } = renderResult

    // add user[2] as a follower
    act(() => {
      fireEvent.change(getByPlaceholderText('User'), {
        target: { value: users[2].username },
      })
      fireEvent.click(getByText('add'))
    })

    // should show the posts of the current user and followed users
    const userId = users[1].id
    const postFeed = [...followedUsers[userId], userId, users[2].id]
    posts.forEach((post) => {
      if (postFeed.includes(post.userId)) {
        expect(queryByText(post.title)).toBeInTheDocument()
      } else {
        expect(queryByText(post.title)).not.toBeInTheDocument()
      }
    })
  })

  it('should remove articles when removing a follower (posts state is smaller)', async () => {
    const { queryByText, getByTestId } = renderResult

    // unfollow user[0]
    act(() => {
      fireEvent.click(getByTestId('unfollow-1'))
    })

    // should show the posts of the current user and followed users
    const userId = users[1].id
    const postFeed = [...followedUsers[userId], userId]
    postFeed.splice(postFeed.indexOf(1), 1)
    posts.forEach((post) => {
      if (postFeed.includes(post.userId)) {
        expect(queryByText(post.title)).toBeInTheDocument()
      } else {
        expect(queryByText(post.title)).not.toBeInTheDocument()
      }
    })
  })

  it('should log out a user (login state should be cleared)', async () => {
    try {
      const { getByText } = renderResult

      // logout
      act(() => {
        fireEvent.click(getByText('Logout'))
      })
    } catch (error) {}

    // should redirect to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login')
    expect(mockNavigate.mock.calls).toHaveLength(1)

    // should clear cur user
    const { store } = renderResult
    const { curUser } = store.getState()
    expect(curUser).toEqual(null)

    // should clear local storage
    const localStorage = window.localStorage
    const curUserStr = localStorage.getItem('curUser')
    expect(curUserStr).toEqual(null)
  })
})
