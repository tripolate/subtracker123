import React, { useCallback } from 'react';
import { Mail } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

interface GmailConnectProps {
  onSuccess: (accessToken: string) => void;
  onError: (error: Error) => void;
}

export function GmailConnect({ onSuccess, onError }: GmailConnectProps) {
  const login = useGoogleLogin({
    onSuccess: (response) => onSuccess(response.access_token),
    onError: (error) => onError(error as Error),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  });

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <Mail className="w-5 h-5 mr-2" />
      Connect Gmail
    </button>
  );
}