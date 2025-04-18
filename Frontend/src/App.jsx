import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context.jsx'

function App() {

  return (
    <div>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </div>
  );
}

export default App
