import React, { useEffect, useState } from 'react';
import { Col, Row, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LocationSelector = ({ onSelect }) => {
    const [cities, setCities] = useState([]); // Danh sách tỉnh/thành phố
    const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
    const [wards, setWards] = useState([]); // Danh sách phường/xã
    const [selectedCity, setSelectedCity] = useState(null); // Tỉnh/thành phố được chọn
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Quận/huyện được chọn
    const [selectedWard, setSelectedWard] = useState(null); // Phường/xã được chọn
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);

    // Lấy dữ liệu từ API khi component được render lần đầu tiên
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(
                    'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
                );
                setCities(response.data); // Lưu dữ liệu các tỉnh/thành phố vào state
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu tỉnh/thành phố:', error);
            }
        };

        fetchCities(); // Gọi hàm để lấy dữ liệu
    }, []);

    // Khi chọn tỉnh/thành phố
    const handleCityChange = (value) => {
        setSelectedCity(value);
        const city = cities.find((city) => city.Id === value);
        setCity(city.name)
        setSelectedDistrict(null); // Reset giá trị quận/huyện khi chọn tỉnh mới
        setSelectedWard(null); // Reset giá trị phường/xã khi chọn tỉnh mới
        const selectedCityData = cities.find((city) => city.Id === value);
        setDistricts(selectedCityData ? selectedCityData.Districts : []);
        setWards([]); // Xoá danh sách phường/xã khi chọn lại tỉnh

        // Notify parent component
        onSelect(city ? city.Name : "", null, null);
    };

    // Khi chọn quận/huyện
    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        const district = districts.find((District) => District.Id === value);
        setDistrict(district.name);
        setSelectedWard(null);
        const selectedDistrictData = districts.find((district) => district.Id === value);
        setWards(selectedDistrictData ? selectedDistrictData.Wards : []);

        onSelect(city, district ? district.Name : "", null);
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
        const ward = wards.find((Wards) => Wards.Id === value);
        setWard(ward.name);
        onSelect(city, district, ward ? ward.Name : "");
    };

    const isFormValid = () => {
        if (!selectedCity) {
            message.error('Vui lòng chọn tỉnh/thành phố!');
            return false;
        }
        if (!selectedDistrict) {
            message.error('Vui lòng chọn quận/huyện!');
            return false;
        }
        if (!selectedWard) {
            message.error('Vui lòng chọn phường/xã!');
            return false;
        }
        return true;
    };

    return (
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
            <Col xs={24} md={8}>
                <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="Chọn tỉnh/thành phố"
                    style={{ width: '100%', padding: '0 !important' }}
                >
                    {cities.map((city) => (
                        <Option key={city.Id} value={city.Id}>
                            {city.Name}
                        </Option>
                    ))}
                </Select>
            </Col>

            <Col xs={24} md={8}>
                <Select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Chọn quận/huyện"
                    style={{ width: '100%' }}
                    disabled={!selectedCity}
                >
                    {districts.map((district) => (
                        <Option key={district.Id} value={district.Id}>
                            {district.Name}
                        </Option>
                    ))}
                </Select>
            </Col>

            <Col xs={24} md={8}>
                <Select
                    value={selectedWard}
                    onChange={handleWardChange}
                    placeholder="Chọn phường/xã"
                    style={{ width: '100%' }}
                    disabled={!selectedDistrict}
                >
                    {wards.map((ward) => (
                        <Option key={ward.Id} value={ward.Id}>
                            {ward.Name}
                        </Option>
                    ))}
                </Select>
            </Col>
        </Row>
    );
};

export default LocationSelector;
