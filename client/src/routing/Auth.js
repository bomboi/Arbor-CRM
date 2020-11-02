import axios from 'axios'

class Auth {
    static async isAuthenticated() {
        const response = await axios.get('/api/authenticated');
        return response.status === 200;
    }

    static async logout(history) {
        const response = await axios.get('/api/logout');
        if(response.status === 200) history.push('/login');
    }
}

export default Auth;