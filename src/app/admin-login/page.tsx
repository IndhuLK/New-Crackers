import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4">
            <Lock className="text-accent" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure access to Dheeran Crackers dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm" 
                placeholder="Admin Email Address" 
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm" 
                placeholder="Password" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-brand-dark">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Link href="/admin" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
