import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import CreateForm from './pages/CreateForm';
import FormRenderer from './pages/FormRenderer';
import Responses from './pages/Responses';
import Analytics from './pages/Analytics';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/form/:id" element={<FormRenderer />} />
            <Route path="/forms/:id/responses" element={<Responses />} />
            <Route path="/forms/:id/analytics" element={<Analytics />} />
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                  <div className="text-6xl">🔍</div>
                  <h1 className="text-white text-2xl">Page Not Found</h1>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              }
            />
          </Routes>
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#fff' },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
