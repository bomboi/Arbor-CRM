import React from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { store } from 'react-recollect';
import { collect } from 'react-recollect';

const Login = () => {
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
                  // handle success
                  console.log(response);
                  if(response.status == 200) {
                      store.loggedIn = true;
                      console.log('Loggedin')
                      console.log(store.loggedIn)
                      history.push('porudzbine')
                  }
                })
            }}>
                Submit
            </Button>
            </Form>
        </Container>
    )
}

export default collect(Login)
