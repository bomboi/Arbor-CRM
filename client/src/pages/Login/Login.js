import React from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux';
import { userSlice } from '../../Redux/reducers/appReducers';
import { message } from 'antd';

const Login = (props) => {
    let history = useHistory();
    return (
        <Container>
            <Form method="POST" action="/api/login" name="form">
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="username" type="username" placeholder="Korisnicko ime" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Lozinka" />
            </Form.Group>
            <Button variant="primary" onClick={()=>{
                axios({
                    method: 'post',
                    url: '/api/login',
                    data: {
                        username: document.form.username.value,
                        password: document.form.password.value
                    },
                    headers: {
                        withCredentials: true
                    }
                })
                .then(function (response) {
                    
                  if(response.status == 200) {
                      console.log('Loggedin')
                      axios.get('/api/user/get')
                            .then(result => {
                                console.log('INIT_USER')
                                props.dispatch(userSlice.actions.initUser(result.data));
                                setTimeout(() => {
                                }, 10);
                                history.push('/');
                            })
                  }
                }).catch(error => {
                    message.error(error.response.data)
                })
            }}>
                Submit
            </Button>
            </Form>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Login)
