import { Client, Databases, Account, Storage, Functions } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export default client;

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const ENTITIES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ENTITIES_COLLECTION_ID || '';
export const STRUCTURES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_STRUCTURES_COLLECTION_ID || '';
export const DONATIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_DONATIONS_COLLECTION_ID || '';