import axios from '../axios';

export const apiGetProducts = (params) => axios.get('/product', { params });
