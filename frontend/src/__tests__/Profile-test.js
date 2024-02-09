import Profile from '../views/profile/Profile'
import { renderWithProviders } from '../utils/test-utils'
import { act } from 'react-dom/test-utils'

describe('Profile', () => {
  let renderResult
  const curUser = {
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
  }

  beforeEach(() => {
    act(() => {
      renderResult = renderWithProviders(<Profile />, {
        preloadedState: { curUser },
      })
    })
  })

  it("should fetch the logged in user's profile username", async () => {
    const { getAllByText } = renderResult
    expect(getAllByText(curUser.username)).toBeTruthy()
  })
})
