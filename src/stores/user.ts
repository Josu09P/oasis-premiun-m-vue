import { defineStore } from 'pinia'

// Pinia: stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: 'Usuario',
    email: '',
    token: '',
    role: '',
    route: '/',
    image: '',
    loginTime: 0, // ⬅️ tiempo de inicio en timestamp
  }),
  actions: {
    setUser(user: any) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
      this.token = user.token
      this.role = user.role
      this.route = user.route
      this.image = user.image || ''
      this.loginTime = Date.now() // ⬅️ guardamos el tiempo actual

      localStorage.setItem(
        'userDetailOasisPremiun',
        JSON.stringify({ ...user, loginTime: this.loginTime })
      )
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
      this.role = ''
      this.route = '/'
      this.image = ''
      this.loginTime = 0
      localStorage.removeItem('userDetailOasisPremiun')
    }
  }
})
