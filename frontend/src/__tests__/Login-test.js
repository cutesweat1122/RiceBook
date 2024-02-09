import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../utils/test-utils'
import Login from '../views/login/Login'

afterEach(cleanup)

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Login', () => {
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

  beforeEach(() => {
    renderResult = renderWithProviders(<Login />, {
      preloadedState: { users },
    })
  })

  it('should log in a previously registered user (not new users, login state should be set)', async () => {
    const { container, getByText } = renderResult

    fireEvent.change(container.querySelector('#accountName'), {
      target: { value: users[0].accountName },
    })
    fireEvent.change(container.querySelector('#password'), {
      target: { value: users[0].password },
    })
    fireEvent.click(getByText('login'))

    // should redirect to home page
    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(mockNavigate.mock.calls).toHaveLength(1)

    // should set cur user
    const { store } = renderResult
    const { curUser } = store.getState()
    expect(curUser).toEqual(users[0])

    // should set local storage
    const localStorage = window.localStorage
    const curUserStr = localStorage.getItem('curUser')
    expect(curUserStr).toEqual(JSON.stringify(users[0]))
  })

  it('should not log in an invalid user (error state should be set)', () => {
    const { container, getByText } = renderResult

    // wrong account name
    fireEvent.change(container.querySelector('#accountName'), {
      target: { value: 'fake account name' },
    })
    fireEvent.change(container.querySelector('#password'), {
      target: { value: 'fake password' },
    })
    fireEvent.click(getByText('login'))
    expect(getByText('*account name not found')).toBeTruthy()

    // wrong password
    fireEvent.change(container.querySelector('#accountName'), {
      target: { value: users[0].accountName },
    })
    fireEvent.change(container.querySelector('#password'), {
      target: { value: 'fake password' },
    })
    fireEvent.click(getByText('login'))
    expect(getByText('*wrong password')).toBeTruthy()
  })
})
