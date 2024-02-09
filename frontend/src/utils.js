import axios from 'axios'

export const fetchProfile = async (username) => {
  try {
    const [headline, avatar, email, phone, dob, zipcode] = await Promise.all([
      axios.get(`/api/headline/${username}`),
      axios.get(`/api/avatar/${username}`),
      axios.get(`/api/email/${username}`),
      axios.get(`/api/phone/${username}`),
      axios.get(`/api/dob/${username}`),
      axios.get(`/api/zipcode/${username}`),
    ])
    return {
      username: username || undefined,
      headline: headline.data.headline,
      avatar: avatar.data.avatar,
      email: email.data.email,
      phone: phone.data.phone,
      dob: dob.data.dob,
      zipcode: zipcode.data.zipcode,
    }
  } catch (error) {}
}
