// /src/stores/useUserStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    username: '',
    name: '',
    email: '',
    token: '',
  }),
  actions: {
    setUser(user) {
      this.id = user.id
      this.username = user.username || ''
      this.name = user.name || ''
      this.email = user.email
      this.token = user.token

      localStorage.setItem('id', this.id)
      localStorage.setItem('username', this.username)
      localStorage.setItem('name', this.name)
      localStorage.setItem('email', this.email)
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.id = null
      this.username = ''
      this.name = ''
      this.email = ''
      this.token = ''

      localStorage.clear()
    },
    restoreFromLocalStorage() {
      const storedId = localStorage.getItem('id')
      this.id = storedId ? Number(storedId) : null
      this.username = localStorage.getItem('username') || ''
      this.name = localStorage.getItem('name') || ''
      this.email = localStorage.getItem('email')
      this.token = localStorage.getItem('token')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})
