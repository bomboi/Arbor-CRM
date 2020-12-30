import axios from 'axios'

class Auth {
    static async isAuthenticated() {
        try {

            const response = await axios.get('/api/authenticated');
            return response.status === 200;
        }
        catch(e) {

            return false;
        }
    }

    static async logout(history) {
        const response = await axios.get('/api/logout');
        if(response.status === 200) history.push('/login');
    }
}

export default Auth;