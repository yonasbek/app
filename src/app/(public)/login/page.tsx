'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Building } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      window.localStorage.setItem('fullName', JSON.stringify(response.data?.fullName));
      window.localStorage.setItem('email', JSON.stringify(response.data?.email));
      window.localStorage.setItem('role', JSON.stringify(response.data?.role));
      window.localStorage.setItem('token', response.data.token);
      if (rememberMe) {
        window.localStorage.setItem('rememberMe', 'true');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex shadow-lg rounded-lg border border-neutral-200">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-app-primary via-app-primary-light to-app-primary relative overflow-hidden rounded-l-lg shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center px-8 py-12 text-white">
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold leading-tight">Office Management System</h1>
              <p className="text-sm text-white opacity-90 leading-relaxed">
                Streamline your office operations with our comprehensive management platform
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-white opacity-90 text-sm">Employee Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-white opacity-90 text-sm">Task Planning & Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-white opacity-90 text-sm">Room & Resource Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-white opacity-90 text-sm">Attendance & Reports</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-app-bg">
        <div className="w-full max-w-sm space-y-6">

          {/* Logo & Title */}
          <div className="text-center">
            <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center mb-1">
              {/* Logo */}
              <Image
                src="/om logo.png"
                alt="Office Management System Logo"
                className="rounded-full shadow-lg border border-app-secondary "
                width={120}
                height={120}

              />
            </div>

          </div>

          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-app-foreground mb-2">Welcome Back!</h2>
            <p className="text-sm text-neutral-600">Sign in to access your office dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-app-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 pl-10 text-sm border-2 border-app-secondary rounded-lg focus:ring-2 focus:ring-app-primary focus:ring-opacity-20 focus:border-app-primary focus:outline-none transition-all duration-200 bg-app-accent hover:bg-app-card hover:border-neutral-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-app-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 pl-10 text-sm border-2 border-app-secondary rounded-lg focus:ring-2 focus:ring-app-primary focus:ring-opacity-20 focus:border-app-primary focus:outline-none transition-all duration-200 bg-app-accent hover:bg-app-card hover:border-neutral-300"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-app-primary focus:ring-app-primary border-app-secondary rounded transition-colors"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-app-foreground font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-app-primary hover:text-app-primary-light transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-4">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-app-primary hover:bg-app-primary-light focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-opacity-20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="text-center mt-4">
            <p className="text-sm text-neutral-600">
              Need help? <span className="font-semibold text-app-primary">Contact your system administrator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 