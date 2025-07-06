import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getCurrentUser()
        .then(response => {
          setUser(response.data.user)
          setCompany(response.data.company)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    const { user, token } = response.data
    
    localStorage.setItem('token', token)
    setUser(user)
    
    // Get current user data with company info
    const userResponse = await authService.getCurrentUser()
    setCompany(userResponse.data.company)
    
    return response
  }

  const register = async (email, password) => {
    const response = await authService.register(email, password)
    const { user, token } = response.data
    
    localStorage.setItem('token', token)
    setUser(user)
    
    return response
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setCompany(null)
  }

  const updateCompany = (updatedCompany) => {
    setCompany(updatedCompany)
  }

  const value = {
    user,
    company,
    login,
    register,
    logout,
    updateCompany,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}