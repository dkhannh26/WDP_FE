import { Button, Col, Form, Input, Row, Space } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { layout, tailLayout } from "../../config/style.config";
import {
  createBrand,
  editBrand,
  getBrand,
} from "../../services/brand.service";
import { useTranslation } from "react-i18next";

const BrandModel = ({ type }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const {t} = useTranslation();
  const onFinish = (values) => {
    const brand = {
      name: values.name,
    };

    if (type === "create") {
      createBrand(brand, navigate);
    } else {
      editBrand(id, brand, navigate);
    }
  };

  useEffect(() => {
    if (type === "edit") getBrand(id, form);
  }, [id, type, form]);

  return (
    <>
      <Row>
        <Title level={3}>
          {type === "create" ? t('dashboard.new_brand') : t('dashboard.edit_brand')}
        </Title>
      </Row>
      <Row>
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
              label={t('table.brand_name')}
              rules={[
                {
                  max: 20,
                  required: true,
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {type === "create" ? t('button.insert') : t('button.edit')}
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

export default BrandModel;
