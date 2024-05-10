import axios from 'axios';

const baseURL = 'http://localhost:5000/api/words';

const getWords = () => {
    return axios.get(baseURL);
}

export default { 
    getWords 
};

