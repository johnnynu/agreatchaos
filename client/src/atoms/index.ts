import { atom } from "jotai";
import { AuthUser } from "aws-amplify/auth";

export interface ExtendedAuthUser {
  authUser: AuthUser;
  email?: string;
  name?: string;
  displayName?: string;
}

export const userAtom = atom<ExtendedAuthUser | null>(null);
export const errorAtom = atom<unknown>(null);
