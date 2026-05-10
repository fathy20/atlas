import { Account, Client, type Models } from "appwrite";

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();

if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID) {
  client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
}

export const appwriteClient = client;
export const appwriteAccount = new Account(client);
export type AppwriteUser = Models.User<Models.Preferences>;
export const isAppwriteReady = Boolean(APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID);

export const getAppwriteUser = async (): Promise<AppwriteUser | null> => {
  if (!isAppwriteReady) {
    return null;
  }

  try {
    return await appwriteAccount.get();
  } catch {
    return null;
  }
};