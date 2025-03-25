import { Button, Col, DatePicker, Form, InputNumber, Row, Space } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { layout, tailLayout } from "../../config/style.config";
import {
  createDiscount,
  editDiscount,
  getDiscount,
} from "../../services/discount.service";
import { useTranslation } from "react-i18next";

const DiscountModel = ({ type }) => {
  const [date, setDate] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const onFinish = (values) => {
    const discount = {
      percent: values.percent,
      expired_at: date,
    };

    if (type === "create") {
      createDiscount(discount, navigate);
    } else {
      editDiscount(id, discount, navigate);
    }
  };

  useEffect(() => {
    if (type === "edit") getDiscount(id, dayjs, form);
  }, [id, type, form]);

  return (
    <>
      <Row>
        <Title level={3}>
          {type === "create" ? t('dashboard.new_discount') : t('dashboard.edit_discount')}
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
              name="percent"
              label={t('table.percent')} 
              rules={[
                {
                  required: true,
                  type: "number",
                  min: 0,
                  max: 100,
                },
              ]}
            >
              <InputNumber suffix="%" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="date"
              label={t('dashboard.expire_at')}
              rules={[
                {
                  required: true,
                },
              ]}
            > 
              <DatePicker
                onChange={(dateString) => setDate(dateString)}
                style={{ width: "100%" }}
              />
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

export default DiscountModel;
