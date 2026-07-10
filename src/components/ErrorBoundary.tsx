import { Component, ErrorInfo, ReactNode } from 'react'

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060d08', color: '#f0faf2', fontFamily: 'sans-serif', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ color: '#39ff14', fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ color: '#94a89a', marginBottom: '1rem' }}>{this.state.message}</p>
            <button onClick={() => window.location.reload()} style={{ background: '#39ff14', color: '#060d08', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
