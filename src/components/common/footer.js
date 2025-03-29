import React from 'react';
import '../../assets/css/footer.css'
import { Col, Row } from 'antd';
import { EnvironmentFilled, PhoneFilled, MailFilled, FacebookFilled, InstagramFilled } from '@ant-design/icons';


const Footer = () => {
    return (
        <div className='footer'>
            <Row className='container'>
                {/* <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        ABOUT US
                    </div>
                    <p className='footer-item--text'>
                        Được thành lập vào cuối năm 2016 trong bối cảnh thời trang streetstyle dần nhen nhóm vào thị trường Việt Nam.
                        Sau 6 năm phát triển, SWE - Street Wear Eazy với slogan Young kids with a mission™ đã chiếm được tình cảm của
                        hầu hết các bạn trẻ yêu mến thời trang đường phố trên khắp cả nước.
                    </p>
                </Col> */}
                <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        THÔNG TIN CHUNG
                    </div>
                    <div className='footer-item--content'>
                        <p>
                            <span className='highlight-text'>DOTAI Sports</span> là hệ thống cửa hàng cầu lông với hơn 50 chi nhánh
                            trên toàn quốc, cung cấp sỉ và lẻ các mặt hàng dụng cụ cầu lông từ phong trào tới chuyên nghiệp
                        </p>
                        <p>
                            <span className='highlight-text'>Với sứ mệnh:</span> "<i>DOTAI cam kết mang đến những sản phẩm, dịch vụ chất
                                lượng tốt nhất phục vụ cho người chơi thể thao để nâng cao sức khỏe của chính mình.</i>"
                        </p>
                        <p>
                            <span className='highlight-text'>Tầm nhìn:</span> "<i>Trở thành nhà phân phối và sản xuất thể thao lớn nhất
                                Việt Nam</i>"
                        </p>
                    </div>
                </Col>
                <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        THÔNG TIN LIÊN HỆ
                    </div>
                    <ul className='footer-list'>
                        <li>Store 1: 44A Trần Quang Diệu, Quận 3</li>
                        <li>Store 2: TNP Lý Tự Trọng, Quận 1</li>
                        <li>Store 3: TNP Lê Lai, Quận 1</li>
                        <li>Đại lý phân phối chính hãng: SN 84, Tổ 9, Hoàng Công Chất, P. Mường Thanh, TP Điện Biên</li>
                        <li>0123456789</li>
                        <li>dotaigroup@gmail.com</li>
                    </ul>
                    <FacebookFilled className='fb-icon ' />
                    <InstagramFilled className='fb-icon ' />
                </Col>
                <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        CHÍNH SÁCH
                    </div>
                    <ul className='footer-list'>
                        <li>
                            <a href='/'>Thông tin về vận chuyển và giao nhận</a>
                        </li>
                        <li>
                            <a href='/'>Chính sách đổi trả,hoàn tiền</a>
                        </li>
                        <li>
                            <a href='/'>Chính sách bảo hành</a>
                        </li>
                        <li>
                            <a href='/'>Chính sách xử lý khiếu nại</a>
                        </li>
                        <li>
                            <a href='/'>Chính sách vận chuyển</a>
                        </li>
                        <li>
                            <a href='/'>Điều khoản sử dụng</a>
                        </li>
                        <li>
                            <a href='/'>Chính Sách Bảo Mật Thông Tin</a>
                        </li>
                        <li>
                            <a href='/'>Chính sách nhượng quyền</a>
                        </li>
                    </ul>
                </Col>
                <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        HƯỚNG DẪN
                    </div>
                    <ul className='footer-list'>
                        <li>
                            <a href='/'>Danh sách số tài khoản chính thức của các shop trong hệ thống DOTAI Sports</a>
                        </li>
                        <li>
                            <a href='/'>Hướng dẫn cách chọn vợt cầu lông cho người mới chơi</a>
                        </li>
                        <li>
                            <a href='/'>Hướng dẫn thanh toán</a>
                        </li>
                        <li>
                            <a href='/'>Kiểm tra bảo hành</a>
                        </li>
                        <li>
                            <a href='/'>Kiểm tra đơn hàng</a>
                        </li>
                        <li>
                            <a href='/'>HƯỚNG DẪN MUA HÀNG</a>
                        </li>
                    </ul>
                    <img alt="Đã đăng ký bộ công thương" src="https://cdn.shopvnb.com/themes_new/images/bct.webp" width="200" height="76" data-was-processed="true"></img>
                </Col>

                {/* <Col span={6} className='footer-item'>
                    <div className='footer-item--title'>
                        HƯỚNG DẪN
                    </div>
                    <FacebookFilled className='fb-icon ' />
                    <InstagramFilled className='fb-icon ' />
                </Col> */}
            </Row>
            {/* <Row className='container footer-navigate' >
                <a href='/'>facebook</a>
                |
                <a href='/'>instagram</a>
            </Row>
            <Row className='footer-bottom'>
                Copyright © 2024 SWE (STREETWEAREAZY). Powered by Haravan
            </Row> */}
        </div>
    );
};

export default Footer;