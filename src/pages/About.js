import React from 'react';
import { FaHandsHelping } from 'react-icons/fa';
import { RiUserHeartLine } from "react-icons/ri";
import { IoShirtOutline } from "react-icons/io5";
import About1 from '../assets/images/about1.jpeg'
import About2 from '../assets/images/about2.jpeg'

const About = () => {
    return (
        <div style={{ padding: '2%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <section style={{ width: '80%', margin: '20px', color: '#333', textAlign: 'center' }}>
                <h1 style={{ fontSize: '50px' }}>About us</h1>
                <h3 style={{ margin: '40px 0 20px 0' }}>WHY WE DO</h3>
            </section>
            <section style={{ width: '80%', color: '#666', textAlign: 'justify', textAlignLast: 'center' }}>
                <p>
                    We live in a world obsessed with conformity, following societal norms and standards. At DOTAI, we believe in the opposite - true connection comes from embracing your individuality and rejecting limitations. That's why we celebrate the unique diversity of each individual, creating a community.
                </p>
                <p style={{ margin: '15px 0' }}>
                    DOTAI was born with the purpose of representing those who want to be authentic, proud of their unique identity. We believe in breaking boundaries, challenging expectations, and confidently expressing your personal style.
                </p>
                <img src={About1} alt="Beach Sunset" style={{ width: '100%', margin: '20px 0' }} />
            </section>
            <section style={{ width: '80%', textAlign: 'justify', textAlignLast: 'center' }}>
                <h3 style={{ color: '#333', margin: '40px 0 20px 0' }}>Who We Are</h3>
                <p style={{ color: '#666' }}>
                    DOTAI is a leading street fashion brand, known for its simple, modern designs and high-quality products for young people worldwide to confidently express their individuality.
                </p>
                <p style={{ color: '#666', margin: '15px 0' }}>
                    DOTAI is not just a brand; it's a movement. A movement for those passionate about free expression, being true to themselves, and confidently pursuing their passions.
                </p>
                <p style={{ color: '#666' }}>
                    DOTAI values modern urban aesthetics, celebrates individuality, and promotes community awareness. We believe everyone has their own value and story. It's about loving all aspects of yourself - unique and ordinary.
                </p>
                <img src={About2} alt="Beach Sunset" style={{ width: '100%', margin: '20px 0' }} />
            </section>
            <section style={{ width: '80%', textAlign: 'justify', textAlignLast: 'center' }}>
                <h3 style={{ color: '#333', margin: '40px 0 20px 0' }}>WHAT WE WANT OUR MISSION</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ margin: '20px 0', color: '#666' }}>
                        <strong>Self-Expression:</strong> Empowering individuals to embrace their unique identities and pursue their passions without limitations.
                    </li>
                    <li style={{ margin: '20px 0', color: '#666' }}>
                        <strong>Fashion:</strong> Provide high-quality fashion at affordable prices.
                    </li>
                    <li style={{ margin: '20px 0', color: '#666' }}>
                        <strong>Responsibility:</strong> Build a socially responsible business.
                    </li>
                </ul>
            </section>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', fontSize: '70px' }}>
                <RiUserHeartLine />
                <IoShirtOutline style={{margin: '0 40px'}} />
                <FaHandsHelping />
            </div>
        </div>
    );
};

export default About;
