import axios from '../axios';

// export const apiGetCategories = () =>
//   axios({
//     method: 'get',
//     url: '/category',
//   });

export const apiGetCategories = () => axios.get('/category');
