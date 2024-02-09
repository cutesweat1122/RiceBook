/*
 * Test suite for articles
 */
require('es6-promise').polyfill()
require('isomorphic-fetch')

const url = (path) => `http://localhost:3000${path}`

describe('Validate Registration and Login functionality', () => {
  let cookie
  const regUser = {
    username: 'testUser',
    password: '123',
    email: '123@qwe.com',
    dob: '01-01-1990',
    zipcode: '12345',
    phone: '123-123-1234',
  }

  it('register new user', (done) => {
    fetch(url('/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regUser),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.result).toEqual('success')
        done()
      })
  })

  it('login user', (done) => {
    const loginUser = { username: 'testUser', password: '123' }
    fetch(url('/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginUser),
    })
      .then((res) => {
        cookie = res.headers.get('set-cookie').split(';')[0] // get the cookie
        return res.json()
      })
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.result).toEqual('success')
        done()
      })
  })

  it('POST /article', (done) => {
    fetch(url('/article'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ text: 'test post' }),
    })
      .then((res) => res.json())
      .then((res) => {
        articleId = res.articles[0].id
        expect(res.articles[0].text).toEqual('test post')
        expect(res.articles[0].author).toEqual('testUser')
        done()
      })
  })

  it('GET /articles/:id', (done) => {
    fetch(url(`/articles/${articleId}`), {
      method: 'GET',
      headers: { Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles[0].text).toEqual('test post')
        expect(res.articles[0].author).toEqual('testUser')
        done()
      })
  })

  it('GET /articles', (done) => {
    fetch(url(`/articles`), {
      method: 'GET',
      headers: { Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles[0].text).toEqual('test post')
        expect(res.articles[0].author).toEqual('testUser')
        done()
      })
  })

  it('PUT /headline', (done) => {
    fetch(url('/headline'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ headline: 'new headline' }),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.headline).toEqual('new headline')
        done()
      })
  })

  it('GET /headline', (done) => {
    fetch(url('/headline'), {
      method: 'GET',
      headers: { Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.headline).toEqual('new headline')
        done()
      })
  })

  it('PUT /logout', (done) => {
    fetch(url('/logout'), {
      method: 'PUT',
      headers: { Cookie: cookie },
    }).then((res) => {
      // statue should be 200
      expect(res.status).toEqual(200)
      done()
    })
  })

  it('can not register with the same username', (done) => {
    fetch(url('/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regUser),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.username).toEqual('testUser')
        expect(res.result).toEqual('This username has already been registered')
        done()
      })
  })
})
