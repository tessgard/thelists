import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import NewList from './components/NewList';
import './App.css';

function AppRoutes() {
  return (
    <>
      <Header />
      <main className="flex-1 p-5 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-list" element={<NewList />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
