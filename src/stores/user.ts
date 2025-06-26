import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: 'Usuario',
    email: '',
    token: '',
  }),
  actions: {
    setUser(user: any) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
      this.token = user.token
      localStorage.setItem('userDetailOasisPremiun', JSON.stringify(user))
    },
    loadUserFromLocalStorage() {
      const data = localStorage.getItem('userDetailOasisPremiun')
      if (data) {
        try {
          const user = JSON.parse(data)
          this.setUser(user)
        } catch (err) {
          console.error('Error cargando usuario:', err)
        }
      }
    },
    logout() {
      this.id = ''
      this.name = 'Usuario'
      this.email = ''
      this.token = ''
      localStorage.removeItem('userDetailOasisPremiun')
    }
  }
})