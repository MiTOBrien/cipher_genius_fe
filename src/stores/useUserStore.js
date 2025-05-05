// /src/stores/useUserStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    name: '',
    email: '',
    token: '',
  }),
  actions: {
    setUser(user) {
      this.username = user.username || ''
      this.name = user.name || ''
      this.email = user.email
      this.token = user.token

      localStorage.setItem('username', this.username)
      localStorage.setItem('name', this.name)
      localStorage.setItem('email', this.email)
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.username = ''
      this.name = ''
      this.email = ''
      this.token = ''

      localStorage.clear()
    },
    restoreFromLocalStorage() {
      this.username = localStorage.getItem('username') || ''
      this.name = localStorage.getItem('name') || ''
      this.email = localStorage.getItem('email') || ''
      this.token = localStorage.getItem('token') || ''
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})
