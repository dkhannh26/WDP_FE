import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layout, tailLayout } from '../../config/style.config';
import { getListDiscount } from '../../services/discount.service';
import { createProduct, editProduct, getListBrand, getProductDetailAdmin } from '../../services/product/product.service';
import RacketSize from '../size/RacketSize.js';
import ShoesSize from '../size/ShoesSize.js';
import TshirtSize from '../size/TshirtSize.js';
import UploadImg from '../common/UploadImg';
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const { Option } = Select;


const ProductForm = ({ typeAction, typeProduct }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const { id } = useParams();
  const [discounts, setDiscounts] = useState()
  const [brands, setBrands] = useState()
  const [sizes, setSizes] = useState()
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null)
  const [brandError, setBrandError] = useState('')
  const { t, i18n } = useTranslation();

  const currentDate = new Date();
  const handleFileListChange = (newFileList) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    if (values.brand === undefined) {
      setBrandError('Please choose a brand')
      return
    } else {
      setBrandError('')
    }

    const product = {
      name: values.name,
      price: values.price,
      category: typeProduct,
      brand_id: values.brand,
      size: {
        S: values.S,
        M: values.M,
        L: values.L,
        XL: values.XL,
        XLL: values.XLL,
        "3U": values["3U"],
        "4U": values["4U"],
        "37": values["37"],
        "38": values["38"],
        "39": values["39"],
        "40": values["40"],
        "41": values["41"],
        "42": values["42"],
        "43": values["43"],
        "ONE SIZE": values["ONE SIZE"]
      },
      discount_id: values.discount,
    }

    if (typeAction === 'create') {
      createProduct(product, fileList, navigate, setError, typeProduct)
    } else {
      editProduct(id, product, typeProduct, fileList, navigate)
    }
  };

  useEffect(() => {
    getListDiscount(setDiscounts)
    getListBrand(setBrands)
    if (typeAction === 'edit') getProductDetailAdmin(id, form, setSizes, handleFileListChange)
  }, [id, typeAction, form])



  return (
    <>
      <Row>
        <Title level={3}>
          {typeAction === "create" ? t('button.create')+" ": t('button.edit')+" "}
          {typeProduct === "tshirt" ? 'T-shirt' : ''}
          {typeProduct === "pant" ? t('pants')   : ''}
          {typeProduct === "shoes" ? t('shoes')   : ''}
          {typeProduct === "accessory" ? t('accessory')  : ''}
          {typeProduct === "racket" ? t('racket')  : ''}
        </Title>
      </Row>
      <Row >
        <Col offset={4} span={12}>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item
              name="name"
              label={t('table.name')}
              validateStatus={error ? 'error' : ''}
              help={error ? error : null}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="brand"
              label={t('table.brand')}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a brand"
                allowClear
              >
                {brands?.map((brand) => {
                  return (
                    <Option value={brand._id}>{brand.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label={t('price')}
              rules={[
                {
                  required: true,
                  type: 'number',
                  min: 0,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="discount"
              label={t('table.discount')}

            >
              <Select
                placeholder="Select a discount"
                allowClear
              >
                {discounts?.map((discount) => {
                  const date = new Date(discount?.expired_at)
                  const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  if (date > currentDate) return (
                    <Option value={discount._id}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        {discount.percent}%
                        <p>
                          Exp: {formattedDate}
                        </p>
                      </div>
                    </Option>
                  )
                  return null
                })}
              </Select>
            </Form.Item>
            {(typeAction === 'create' && (typeProduct === 'tshirt' || typeProduct === 'pant')) && <TshirtSize error={error} />}
            {(typeAction === 'create' && typeProduct === 'shoes') && <ShoesSize error={error} />}
            {(typeAction === 'create' && typeProduct === 'racket') && <RacketSize error={error} />}
            {(typeAction === 'create' && typeProduct === 'accessory') &&
              <Form.Item
                name={"ONE SIZE"}
                label={`${t('table.quantity_of_size')} ONE SIZE`}
                rules={[
                  {
                    required: true,
                    type: 'number',
                    min: 0,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            }

            {
              sizes?.map(item => {
                return <Form.Item
                  name={item.size_name}
                  label={`${t('table.quantity_of_size')} ${item.size_name}`}
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      min: 0,
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              })
            }
            <Form.Item
              name="image"
              label={t('table.upload_img')}
              valuePropName="fileList"
            // getValueFromEvent={normFile}
            // extra="longgggggggggggggggggggggggggggggggggg"
            >
              <UploadImg onFileListChange={handleFileListChange} filesApi={fileList}></UploadImg>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Text type="danger">{brandError}</Text>
              </Row>
              <Space>
                <Button type="primary" htmlType="submit" >
                  {typeAction === 'create' ? t('button.insert') : t('button.edit')}
                </Button>
                <Button htmlType="button" onClick={() => navigate(-1)}>
                {t('button.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};


export default ProductForm;