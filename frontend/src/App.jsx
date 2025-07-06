import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BrowseTenders from './pages/BrowseTenders'
import CreateTender from './pages/CreateTender'
import EditTender from './pages/EditTender'
import ViewTender from './pages/ViewTender'
import MyTenders from './pages/MyTenders'
import SearchCompanies from './pages/SearchCompanies'
import CompanyProfile from './pages/CompanyProfile'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/browse-tenders" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse-tenders" element={<BrowseTenders />} />
            <Route path="/search-companies" element={<SearchCompanies />} />
            <Route path="/company/:id" element={<CompanyProfile />} />
            <Route path="/tender/:id" element={<ViewTender />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-tender" 
              element={
                <ProtectedRoute>
                  <CreateTender />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-tender/:id" 
              element={
                <ProtectedRoute>
                  <EditTender />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-tenders" 
              element={
                <ProtectedRoute>
                  <MyTenders />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App