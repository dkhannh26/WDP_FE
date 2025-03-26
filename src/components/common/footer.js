import React from 'react';
import '../../assets/css/footer.css'
import { Col, Row } from 'antd';
import { EnvironmentFilled, PhoneFilled, MailFilled, FacebookFilled, InstagramFilled } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t, i18n } = useTranslation();
    
      
    return (
        <div className='footer'>
            <Row className='container'>
                {/* <Col span={6} className='footer-content'>
                    <div className='footer-item--title'>
                        ABOUT US
                    </div>
                    <p className='footer-item--text'>
                        Được thành lập vào cuối năm 2016 trong bối cảnh thời trang streetstyle dần nhen nhóm vào thị trường Việt Nam.
                        Sau 6 năm phát triển, SWE - Street Wear Eazy với slogan Young kids with a mission™ đã chiếm được tình cảm của
                        hầu hết các bạn trẻ yêu mến thời trang đường phố trên khắp cả nước.
                    </p>
                </Col> */}
                <Col span={8} className='footer-content'>
                    <div className='footer-item--title uppercase'>
                        {t('footer.policy')}
                    </div>
                    <ul className='footer-list'>
                        <li>
                            <a href='/'>{t('footer.policy2')}</a>
                        </li>
                        <li>
                            <a href='/'>{t('footer.policy3')}</a>
                        </li>
                        <li>
                            <a href='/'>{t('footer.policy4')}</a>
                        </li>
                        <li>
                            <a href='/'>{t('footer.policy5')}</a>
                        </li>
                        <li>
                            <a href='/'>{t('footer.policy6')}</a>
                        </li>
                    </ul>
                </Col>
                <Col span={8} className='footer-content'>
                    <div className='footer-item--title'>
                    {t('footer.store_system')}
                    </div>
                    <ul className='footer-list store-system'>
                        <li>
                            <div className='icon'>
                                <EnvironmentFilled />
                            </div>
                            <a href='/'>Store 1: 44A Trần Quang Diệu, Quận 3</a>
                        </li>
                        <li>
                            <div className='icon'>
                                <EnvironmentFilled />
                            </div>
                            <a href='/'>Store 2: TNP Lý Tự Trọng, Quận 1</a>
                        </li>
                        <li>
                            <div className='icon'>
                                <EnvironmentFilled />
                            </div>
                            <a href='/'>Store 3: TNP Lê Lai, Quận 1</a>
                        </li>
                        <li>
                            <div className='icon'>
                                <EnvironmentFilled />
                            </div>
                            <a href='/'>Đại lý phân phối chính hãng: SN 84, Tổ 9, Hoàng Công Chất, P. Mường Thanh, TP Điện Biên</a>
                        </li>
                        <li>
                            <div className='icon'>
                                <PhoneFilled />
                            </div>
                            <a href='/'>0357 420 420</a>
                        </li>
                        <li>
                            <div className='icon'>
                                <MailFilled />
                            </div>
                            <a href='/'>streetweareazy@gmail.com</a>
                        </li>
                    </ul>
                </Col>
                <Col span={8} className='footer-content'>
                    <div className='footer-item--title'>
                        FANPAGE
                    </div>
                    <FacebookFilled className='fb-icon ' />
                    <InstagramFilled className='fb-icon ' />
                </Col>
            </Row>
            <Row className='container footer-navigate' >
                <a href='/'>facebook</a>
                |
                <a href='/'>instagram</a>
            </Row>
            <Row className='footer-bottom'>
                Copyright © 2024 SWE (STREETWEAREAZY). Powered by Haravan
            </Row>
        </div>
    );
};

export default Footer;