// src/api.js
import axios from 'axios';

const API_URL = 'https://dahua.metcfire.com.tw/api/CRUDTest';

export const getData = () => axios.get(`${API_URL}/a`);
export const createData = (data) => axios.post(API_URL, data);
export const updateData = (id, data) => axios.patch(`${API_URL}/${id}`, data);
export const deleteData = (id) => axios.delete(`${API_URL}/${id}`);
