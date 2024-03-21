import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Registernew.css";

function Register() {

    const navigate = useNavigate();
     const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/users/dashboard");
      }
    }, [navigate, isAuthenticated]);






    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const responseData = await response.json();
                const redirectUrl = responseData.redirect;
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors);
            } else {
                navigate("/users/login", { state: { successMessage: true } });
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div>
            <div className="logo">
            <img src="../public/flamingo-logo.svg" alt="Logo" />
            </div>
            <h1 className="heading">Fluolingo</h1>
            {errors.length > 0 && (
                <div className="error-messages">
                    <h2>Error(s) occurred during registration:</h2>
                    {errors.map((error, index) => (
                        <p key={index}>{error.message}</p>
                    ))}
                </div>
            )}
            <Card className="p-4">
                <Card.Title as="h2">Register</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <br />
                    </Form.Group>
                    <Button variant="primary" className="g-button" type="submit">Register</Button> {/* Added className "register-button" */}
                </Form>
                <br />
                <p>Already registered? <Link to="/users/login">Login here</Link></p>
            </Card>
        </div>
    );
}

export default Register;
