import axios from 'axios';
import { Trie } from '../../../shared/utils/mwt';

const getTrie = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/trie');
        const serialized = res.data.trie;
        const deserialized = Trie.deserialize(serialized);
        console.log('deserialized:', deserialized);
        return deserialized;
    } catch (error) {
        console.error('Error fetching trie:', error);
        throw error;
    }
}

export default {
    getTrie
}

