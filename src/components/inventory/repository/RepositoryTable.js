import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Row, Table, Tag } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { getListInventory } from "../../../services/inventory";
import AddImport from "./AddImport";
import SearchTable from "./SearchTable";
import DetailInventoryModal from "./DetailInventoryModal";

const RepositoryTable = () => {
    const [inventoryList, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inventoryDetail, setInventoryDetail] = useState();

    const showModal = (id) => {
        const product = inventoryList.find(item => item._id === id);
        setInventoryDetail(product)
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const columns = [
        {
            title: "No.",
            render: (text, record, index) => index + 1,
            width: "5%",
        },
        {
            title: "Product Name",
            dataIndex: "name",
            width: "15%",
        },
        {
            title: "Total Quantity",
            dataIndex: "sizes",
            width: "10%",
            render: (sizes) => {
                const totalQuantity = sizes.reduce((sum, item) => sum + item.quantity, 0);
                return totalQuantity;
            },
            align: 'center'
        },
        {
            align: 'center',
            title: "Status",
            dataIndex: "sizes",
            width: "10%",
            render: (sizes) => {
                const totalQuantity = sizes.reduce((sum, item) => sum + item.quantity, 0);
                if (totalQuantity === 0) {
                    return <Tag color="red" style={{ width: 100, textAlign: 'center' }}>OUT OF STOCK</Tag>
                } else if (totalQuantity > 5) {
                    return <Tag color="green" style={{ width: 100, textAlign: 'center' }}>IN STOCK</Tag>
                } else if (totalQuantity <= 5) {
                    return <Tag color="orange" style={{ width: 100, textAlign: 'center' }}>LOW STOCK</Tag>
                }
            },
        },
        {
            align: 'center',
            title: "Action",
            dataIndex: "_id",
            render: (_id, record) => {
                return (
                    <div>
                        <Button
                            style={{ marginRight: 5 }}
                            shape="round"
                            icon={<PlusOutlined />}
                        ></Button>
                        <Button
                            onClick={() => {
                                showModal(_id);
                            }}
                            shape="round"
                            icon={<EyeOutlined />}
                        ></Button>
                    </div>
                );
            },
            width: "10%",
        },
    ];

    useEffect(() => {
        getListInventory(setInventory);
    }, []);

    useEffect(() => {
        setFilteredInventory(inventoryList);
    }, [inventoryList]);

    const handleSearch = (values) => {
        const { type, name, status } = values;

        let filtered = [...inventoryList];

        if (type) {
            filtered = filtered.filter(item => item.category === type);
        }

        if (name) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        if (status) {
            filtered = filtered.filter(item => {
                const totalQuantity = item.sizes.reduce((sum, size) => sum + size.quantity, 0);
                if (status === "inStock" && totalQuantity > 5) return true;
                if (status === "lowStock" && totalQuantity <= 5 && totalQuantity > 0) return true;
                if (status === "outOfStock" && totalQuantity === 0) return true;
                return false;
            });
        }

        setFilteredInventory(filtered);
    };

    return (
        <>
            <Row style={{ justifyContent: 'center' }}>
                <Title level={2}>Inventory Management</Title>
            </Row>
            <Row>
                <Col span={10}>
                    <Title level={3} style={{ marginTop: 20 }}>Create Import List</Title>
                    <SearchTable onSearch={handleSearch} />
                    <AddImport />
                </Col>
                <Col span={14}>
                    <Flex gap="middle" align="center" justify="space-between" justifyContent={'center'}>
                        <Col span={24}>
                            <Col span={24}>
                                <Title style={{ marginTop: 20 }} level={3}>Repository</Title>
                            </Col>
                        </Col>
                    </Flex>
                    <Table
                        pagination={{ pageSize: 12 }}
                        columns={columns}
                        dataSource={filteredInventory}
                    />
                </Col>
            </Row>
            <DetailInventoryModal inventoryDetail={inventoryDetail} isModalOpen={isModalOpen} handleCancel={handleCancel}></DetailInventoryModal>
        </>
    );
};

export default RepositoryTable;