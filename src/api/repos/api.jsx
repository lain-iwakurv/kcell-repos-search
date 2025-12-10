import axios from 'axios';

export const getRepos = async () => {
    const response = await axios.get(
        `https://api.github.com/search/repositories?q=QUERY`
    );
    return response.data;


}

