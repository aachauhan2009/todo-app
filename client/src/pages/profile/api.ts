import axios from 'axios';

export interface IUser {
    name: string;
    email?: string;
    avatar?: string;
}

export const getUserProfile = async () => {
    return axios.get<IUser>('/api/auth/user/profile');
};


export const updateUserProfile = async (data: IUser) => {
    return axios.post('/api/auth/user/profile', data);
}