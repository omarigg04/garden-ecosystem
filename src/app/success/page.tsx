'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [entityInfo, setEntityInfo] = useState<{ name: string; email: string } | null>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // In a real implementation, you would verify the payment on the server
    // and fetch the created entity information
    const verifyPayment = async () => {
      try {
        // Simulate API call to verify payment and get entity info
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock entity info - in reality this would come from your API
        setEntityInfo({
          name: 'Zephyr the Curious',
          email: 'donor@example.com'
        });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Digital Being</h1>
          <p className="text-gray-600">
            Our AI is crafting your unique creature with a special personality and appearance. 
            This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t verify your payment or create your digital being. 
            Please contact support if this issue persists.
          </p>
          <div className="space-y-3">
            <Link 
              href="/" 
              className="block w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Return to Ecosystem
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Digital Ecosystem!
          </h1>
          <p className="text-gray-600 text-lg">
            Your donation was successful and your digital being has been created!
          </p>
        </div>

        {entityInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meet Your New Digital Being</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{entityInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium text-gray-900">{entityInfo.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Active & Exploring</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Your being is now active in the ecosystem</li>
              <li>• It will start exploring and meeting other creatures</li>
              <li>• Watch it develop unique behaviors and relationships</li>
              <li>• Higher donations unlock ecosystem influence</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Being&apos;s Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• AI-generated unique personality</li>
              <li>• Procedural appearance with special features</li>
              <li>• Autonomous behavior and decision-making</li>
              <li>• Real-time interaction with other beings</li>
            </ul>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          >
            View Your Being in the Ecosystem
          </Link>
          <p className="text-sm text-gray-500">
            Bookmark this page to easily find your digital being later!
          </p>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">📧 Email Confirmation</h4>
          <p className="text-yellow-700 text-sm">
            We&apos;ve sent you an email confirmation with your digital being&apos;s details. 
            Check your inbox at <strong>{entityInfo?.email}</strong> for your creature&apos;s unique ID and special features.
          </p>
        </div>
      </div>
    </div>
  );
}