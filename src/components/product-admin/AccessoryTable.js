import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Image, Input, message, Space, Table } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MESSAGE } from "../../config/message.config";
import { ACCESSORY_URL } from "../../config/url.config";
import { showDeleteConfirm, success } from "../../utils/helper";
import Highlighter from 'react-highlight-words';
import { getProductList } from "../../services/product/product.service";
import { API_PATH } from "../../config/api.config"; 
import { useTranslation } from "react-i18next";

const AccessoryTable = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;
  const role = localStorage.getItem("role");
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search product`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {

      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      width: "10%",

    },
    {
      title: t('table.img'),
      dataIndex: "productImg",
      render: (imgUrl) => {
        return (
          <Image width={150} src={"http://localhost:3000" + imgUrl}></Image>
        );
      },
      width: "20%",
    },
    {
      title: t('table.name'),
      dataIndex: "productName",
      filterSearch: true,
      width: "20%",
      ...getColumnSearchProps('productName'),
    },
    {
      title: t('price') + " (VND)",
      dataIndex: "productPrice",
      render: (price) => price.toLocaleString("vi-VN"),
      width: "20%",
      sorter: (a, b) => a.productPrice - b.productPrice,
    },
    {
      title: t('table.discount_percent'),
      dataIndex: "productDiscountPercent",
      render: (percent) => {
        if (percent) return `${percent}%`;
        return "-";
      },
      width: "10%",
      sorter: (a, b) => a.productDiscountPercent - b.productDiscountPercent,
    },
    {
      title: t('table.action'),
      dataIndex: "productId",
      render: (_id) => {
        return role === "admin" ? (
          <Space>
            <Button
              shape="round"
              icon={<SearchOutlined />}
              onClick={() => navigate(`detail/${_id}`)}
            ></Button>
            <Button
              shape="round"
              icon={<EditOutlined />}
              onClick={() => navigate(`edit/${_id}`)}
            ></Button>
            <Button
              danger
              shape="round"
              icon={<DeleteOutlined />}
              onClick={() =>
                showDeleteConfirm(
                  _id,
                  messageApi,
                  getProductList,
                  setProducts,
                  API_PATH.product,
                  'accessory'
                )
              }
            ></Button>
          </Space>
        ) : (
          <Button
            shape="round"
            icon={<SearchOutlined />}
            onClick={() => navigate(`detail/${_id}`)}
          ></Button>
        );
      },
      width: "15%",
    },
  ];

  useEffect(() => {
    if (state?.message === MESSAGE.CREATE_SUCCESS) {
      console.log("message", state?.message);
      success(state.message, messageApi);
      navigate(location.pathname, { replace: true }); //xóa state sau khi sử dụng
    } else if (state?.message === MESSAGE.UPDATE_SUCCESS) {
      console.log("message", state?.message);
      success(state.message, messageApi);
      navigate(location.pathname, { replace: true });
    }

    getProductList(setProducts, 'Accessory');
  }, [state, navigate, messageApi, location.pathname]);

  console.log(products);

  return (
    <>
      <Flex gap="middle" align="center" justify="space-between">
        {contextHolder}
        <Col>
          <Title level={2}>{t('dashboard.accessories_mng')}</Title>
        </Col>
        <Col
          className="gutter-row"
          style={{
            display: "flex",
            justifyContent: "flex-end  !important",
            alignItems: "center !important",
            height: "100%",
          }}
        >
          {role === "admin" ? (
            <Button onClick={() => navigate(ACCESSORY_URL.CREATE)}>{t('button.insert')}</Button>
          ) : (
            ""
          )}
        </Col>
      </Flex>
      <Table columns={columns} dataSource={products} />
    </>
  );
};

export default AccessoryTable;
