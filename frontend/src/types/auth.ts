export type User = {
  id: number
  name: string
  email: string
  preferred_username: string
}

export type LoginResponse = {
  token_type: 'Bearer'
  access_token: string
  expires_at: string
  user: User
}