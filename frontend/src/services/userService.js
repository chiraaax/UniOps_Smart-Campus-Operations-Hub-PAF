import axios from 'axios';

const API_URL = '/api/users';

export const getTechnicians = async () => {
    const response = await axios.get(`${API_URL}/technicians`);
    return response.data;
};
