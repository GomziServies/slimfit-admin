import axios from 'axios';
import apiConfig from './apiConfig';

const axiosInstance = axios.create({
    baseURL: apiConfig.BASE_URL + '/admin/v1',
});

axiosInstance.interceptors.request.use(
    (config) => {
        // const authorization = localStorage.getItem('authorization');

        // if (authorization) {
        //     config.headers['authorization'] = authorization;
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const { status } = error.response;
//         if (status === 400 || status === 403) {
//             localStorage.removeItem('authorization');
//             localStorage.removeItem('adminType');
//             window.location.href = '/auth/sign-in';
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
