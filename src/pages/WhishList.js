import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { Space, Table, Tag } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
const { Column, ColumnGroup } = Table;


const WhishList = () => {

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <>
                <img style={{ width: 64, float: 'right' }} src={text} alt="demo" />
            </>
        },
        {
            title: 'Product name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <>{text}</>,
        },
        {
            title: 'Unit price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => <>${text}</>,
        },
        {
            title: 'Stock status',
            dataIndex: 'status',
            key: 'status',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'in stock') {
                            color = 'green';
                        } else if (tag === 'out of stock') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <DeleteOutlined
                        style={{ fontSize: '20px' }}
                    />
                    <ShoppingCartOutlined
                        style={{ fontSize: '22px' }}
                        onClick={handleAddToCart}

                    />
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            image: 'https://cdn.shopvnb.com/uploads/gallery/giay-cau-long-yonex-eclipsion-z3-mid-light-blue-chinh-hang_1740958940.webp',
            name: 'John Brown',
            price: 32,
            tags: ['out of stock'],
        },
        {
            key: '2',
            image: 'https://cdn.shopvnb.com/uploads/gallery/giay-cau-long-yonex-eclipsion-z3-mid-light-blue-chinh-hang_1740958940.webp',
            name: 'Jim Green',
            price: 42,
            tags: ['in stock'],
        },
        {
            key: '3',
            image: 'https://cdn.shopvnb.com/uploads/gallery/giay-cau-long-yonex-eclipsion-z3-mid-light-blue-chinh-hang_1740958940.webp',
            name: 'Joe Black',
            price: 32,
            tags: ['out of stock'],
        },
        {
            key: '4',
            image: 'https://cdn.shopvnb.com/uploads/gallery/giay-cau-long-yonex-eclipsion-z3-mid-light-blue-chinh-hang_1740958940.webp',
            name: 'Joe Black',
            price: 32,
            tags: ['out of stock'],
        },
        {
            key: '5',
            image: 'https://cdn.shopvnb.com/uploads/gallery/giay-cau-long-yonex-eclipsion-z3-mid-light-blue-chinh-hang_1740958940.webp',
            name: 'Joe Black',
            price: 32,
            tags: ['out of stock'],
        },
    ];

    const [count, setCount] = useState(0);

    const handleAddToCart = (e) => {
        // Lấy vị trí của button và cart
        const button = e.currentTarget;
        const cart = document.querySelector('.anticon-shopping');

        // Tìm ảnh trong card
        const card = button.closest('.ant-table-row');
        const imgToDrag = card.querySelector('img');

        if (imgToDrag) {
            // Tạo clone của ảnh
            const imgClone = imgToDrag.cloneNode(true);
            const imgRect = imgToDrag.getBoundingClientRect();
            const cartRect = cart.getBoundingClientRect();

            // Thiết lập style ban đầu
            Object.assign(imgClone.style, {
                position: 'absolute',
                top: `${imgRect.top}px`,
                left: `${imgRect.left}px`,
                opacity: '0.8',
                height: '150px',
                width: '150px',
                zIndex: '100',
                transition: 'all 1s ease-in-out'
            });

            document.body.appendChild(imgClone);

            // Animation đến cart
            setTimeout(() => {
                Object.assign(imgClone.style, {
                  top: `${cartRect.top + 8}px`,
                  left: `${cartRect.left + 7}px`,
                  width: '10px',
                  height: '10px'
                });

                // Xóa clone sau khi animation hoàn tất
                imgClone.addEventListener('transitionend', () => {
                    imgClone.remove();
                });
              }, 0);

            // Cập nhật count và shrink animation
            setTimeout(() => {
                setCount(prev => prev + 1);
            }, 1000);
        }
    };

    return (
        <div className="container">
            <Table
                pagination={false}
                columns={columns}
                dataSource={data}
                style={{ marginTop: '50px' }}
            />
        </div>
    );
};

export default WhishList;
