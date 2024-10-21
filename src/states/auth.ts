import {atom} from "recoil";
import {AuthData} from "../models";

export const initialAuthState = {
    profile: {},
    token:""
};
export const authState = atom<AuthData>({
    key: 'authData',
    default: initialAuthState,
});
