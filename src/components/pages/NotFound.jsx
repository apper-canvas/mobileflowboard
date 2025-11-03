import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page not found</h2>
          <p className="text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="text-sm text-gray-500">
            or{' '}
            <button 
              onClick={() => window.history.back()}
              className="text-primary hover:text-primary-600 font-medium"
            >
              go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;