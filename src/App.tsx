import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ToastProvider } from './components/Toast'
import { RequestDesk } from './screens/RequestDesk'
import { Sourcing } from './screens/Sourcing'
import { Operators } from './screens/Operators'
import { Quote } from './screens/Quote'
import { Mission } from './screens/Mission'
import { Clients } from './screens/Clients'
import { Vector } from './screens/Vector'

export default function App() {
  return (
    <ToastProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<RequestDesk />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/operators" element={<Operators />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/vector" element={<Vector />} />
          <Route path="*" element={<RequestDesk />} />
        </Routes>
      </Shell>
    </ToastProvider>
  )
}
