import { google } from 'googleapis';
import type { Subscription } from '../types/subscription';

const SUBSCRIPTION_KEYWORDS = [
  'subscription',
  'recurring payment',
  'monthly plan',
  'yearly plan',
  'trial period',
  'free trial',
  'billing',
];

const KNOWN_SERVICES = {
  'netflix.com': {
    name: 'Netflix',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=64&h=64&fit=crop&auto=format'
  },
  'spotify.com': {
    name: 'Spotify',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=64&h=64&fit=crop&auto=format'
  },
  'adobe.com': {
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=64&h=64&fit=crop&auto=format'
  },
  'github.com': {
    name: 'GitHub',
    category: 'Development',
    logo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=64&h=64&fit=crop&auto=format'
  }
};

export async function initializeGmailAPI(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth });
}

export async function fetchEmails(accessToken: string) {
  const gmail = await initializeGmailAPI(accessToken);
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: SUBSCRIPTION_KEYWORDS.join(' OR '),
    maxResults: 100
  });

  return response.data.messages || [];
}

export async function getEmailContent(accessToken: string, messageId: string) {
  const gmail = await initializeGmailAPI(accessToken);
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full'
  });

  return response.data;
}

function extractAmount(text: string): number | null {
  const amountRegex = /\$\s*(\d+(?:\.\d{2})?)/;
  const match = text.match(amountRegex);
  return match ? parseFloat(match[1]) : null;
}

function extractDate(text: string): Date | null {
  const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/;
  const match = text.match(dateRegex);
  return match ? new Date(match[1]) : null;
}

export function parseSubscriptionFromEmail(email: any): Partial<Subscription> | null {
  const headers = email.payload.headers;
  const from = headers.find((h: any) => h.name === 'From')?.value || '';
  const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
  const body = email.snippet || '';

  // Extract domain from email
  const domainMatch = from.match(/@([^>]+)>/);
  const domain = domainMatch ? domainMatch[1].toLowerCase() : '';

  // Check if it's a known service
  const knownService = Object.entries(KNOWN_SERVICES).find(([key]) => 
    domain.includes(key)
  );

  if (!knownService) {
    return null;
  }

  const [, serviceInfo] = knownService;
  const amount = extractAmount(body) || extractAmount(subject);
  const nextBillingDate = extractDate(body) || extractDate(subject);

  if (!amount || !nextBillingDate) {
    return null;
  }

  return {
    name: serviceInfo.name,
    amount,
    currency: 'USD', // Default to USD
    billingCycle: body.toLowerCase().includes('yearly') ? 'yearly' : 'monthly',
    nextBillingDate,
    category: serviceInfo.category,
    status: body.toLowerCase().includes('trial') ? 'trial' : 'active',
    logo: serviceInfo.logo
  };
}