import { JSX, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import pages (to be created)
import Login from './pages/login'
import Dashboard from './pages/dashboard'

// Define types
type ProtectedRouteProps = {
  children: React.ReactNode;
}

function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

  // Function to handle login
  const handleLogin = (): void => {
    setIsAuthenticated(true)
  }

  // Protected route component
  const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return <>{children}</>
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App