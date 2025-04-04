import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Space, Upload, message } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { layout, tailLayout } from "../../../config/style.config";
import { createImport, downloadTemplate } from "../../../services/import.service";
import { useTranslation } from "react-i18next";


const ImportModel = ({ type }) => {
  const [importList, setImportList] = useState([]);

  const [date, setDate] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const onFinish = (values) => {
    console.log(importList);

    if (type === "create") {
      createImport(importList, navigate);
    } else {
      // editDiscount(id, discount, navigate);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const allSheetsData = {};
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        allSheetsData[sheetName] = jsonData;
      });
      setImportList(allSheetsData);
      console.log("All sheets data:", allSheetsData);
    };

    reader.onerror = () => {
      message.error("Failed to read file.");
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevent upload
  };

  return (
    <>
      <Row>
        <Title level={3}>
          {type === "create" ? t('dashboard.new_import') : t('dashboard.edit_import')}
        </Title>
      </Row>
      <Row>
        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          size="large"
          variant="solid"
          color="default"
          onClick={() => downloadTemplate()}
        >
          {t('dashboard.import_temp')}
        </Button>
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
              {...tailLayout}
              name="data"
              rules={[
                {
                  required: true,
                  message: "Please choose file to upload!",
                },
              ]}
            >
              <Upload
                accept=".xls,.xlsx"
                beforeUpload={handleFileUpload}
                showUploadList={true} //
              >
                <Button icon={<UploadOutlined />}>Upload Excel File</Button>
              </Upload>
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

export default ImportModel;
