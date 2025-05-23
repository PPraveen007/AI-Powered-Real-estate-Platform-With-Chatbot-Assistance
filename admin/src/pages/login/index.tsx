import { useState, FormEvent, JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles.css'

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps): JSX.Element => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('https://real-estate-xbh8.onrender.com/api/auth/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(response);
      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store token in localStorage for future API requests
      localStorage.setItem('token', data.token);

      // Call the onLogin prop to update authentication state
      onLogin();

      // Redirect to admin dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      // You could add state for error messages here to display to users
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className={`login-card ${isLoading ? 'loading' : ''}`}>
        <div className="login-logo">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="currentColor" d="M12,3L2,12h3v8h6v-6h2v6h6v-8h3L12,3z" />
          </svg>
        </div>
        <h1 className="login-title">Admin Portal</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner">
                <div className="spinner-inner"></div>
              </div>
            ) : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login