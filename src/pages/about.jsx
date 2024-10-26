// AboutUs.js
import React from 'react';
import '../stylings/styles.css';
import Header from './header';

const AboutUs = () => {
    return (
        <>
        <Header/>
        <div className="about-us">
            <h1>About Us</h1>
            <p>
            At Asoro Automotive, our skilled technicians, state-of-the-art equipment, and commitment to excellence ensure unparalleled service quality, making us the ultimate destination for reliable car repair and trusted vehicle care.
            </p>
            <h2>Our Mission</h2>
            <p>
            To empower car owners with the tools and expertise they need to take control of their vehicle’s health. We aim to reduce vehicle downtime, lower repair costs, and enhance the overall automotive repair experience.
            </p>
            <h2>Our Values</h2>
            <ul>
                <li>Integrity</li>
                <li>Innovation</li>
                <li>Customer Satisfaction</li>
                <li>Teamwork</li>
            </ul>
            <h2>Contact Us</h2>
            <p>
                If you have any questions or would like to know more about our services, 
                feel free to reach out!
            </p>
        </div>
        </>
    );
};

export default AboutUs;
