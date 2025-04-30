// /src/stores/useUserStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    token: '',
  }),
  actions: {
    setUser(user) {
      this.username = user.username
      this.firstName = user.first_name || ''
      this.lastName = user.last_name || ''
      this.email = user.email
      this.token = user.token

      // Optional: sync with localStorage
      localStorage.setItem('username', this.username)
      localStorage.setItem('firstName', this.firstName)
      localStorage.setItem('lastName', this.lastName)
      localStorage.setItem('email', this.email)
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.username = ''
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.token = ''

      localStorage.clear()
    },
    restoreFromLocalStorage() {
      this.username = localStorage.getItem('username') || ''
      this.firstName = localStorage.getItem('firstName') || ''
      this.lastName = localStorage.getItem('lastName') || ''
      this.email = localStorage.getItem('email') || ''
      this.token = localStorage.getItem('token') || ''
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})
