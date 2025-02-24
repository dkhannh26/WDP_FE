import {
  FilterOutlined,
  LikeFilled,
  LikeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  List,
  Menu,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import "../../assets/css/feedback.css";
import { API_PATH } from "../../config/api.config";
import {
  createFeedback,
  getFeedbackLike,
  getListFeedback,
  likeFeedback,
  updateFeedback,
} from "../../services/feedback.service";
import { showDeleteConfirm } from "../../utils/helper";
import { useAuth } from "../context/AuthContext";

const CustomerFeedback = ({ product_id, userId, feedbackId }) => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(feedback);

  const [feedbackArr, setFeedbackArr] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentFeedback, setCurrentFeedback] = useState(false);
  const [id, setId] = useState("");

  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const selectId = product_id;
  const onFinish = (values) => {
    const feedbackData = {
      content: values.content,
      account_id: userId,
      product_id,
    };
    if (currentFeedback) {
      updateFeedback(id, feedbackData);
      setCurrentFeedback(false);
    } else {
      createFeedback(feedbackData);
    }
    form.resetFields();
    setIsModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };
  const editFeedback = (feedbackItem, id) => {
    setCurrentFeedback(true);
    setId(id);
    form.setFieldsValue({ content: feedbackItem.content });
    setIsModalOpen(true);
  };

  const showModal = async (action) => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (item, id) => (e) => {
    if (e.key === "edit") {
      editFeedback(item, id);
    } else if (e.key === "delete") {
      showDeleteConfirm(
        id,
        messageApi,
        () => getListFeedback(selectId, setFeedback),
        setFeedback,
        API_PATH.feedback
      );
    }
  };
  useEffect(() => {
    if (selectId) {
      getListFeedback(selectId, setFeedback);
    }
    if (user.id) {
      getFeedbackLike(user.id).then((data) => {
        setFeedbackArr(data);
      });
    }
  }, [selectId, user?.id, refreshTrigger]);

  useEffect(() => {
    console.log("Feedback array đã được cập nhật:", feedbackArr);
  }, [feedbackArr]);
  useEffect(() => {
    setFilteredFeedbacks([...feedback]);
  }, [feedback]);
  const likeButton = async (feedback_id, account_id) => {
    setFeedbackArr((prev) =>
      prev.includes(feedback_id)
        ? prev.filter((id) => id !== feedback_id)
        : [...prev, feedback_id]
    );
    try {
      await likeFeedback(feedback_id, account_id);
      const updatedLikes = await getFeedbackLike(account_id);
      setFeedbackArr(updatedLikes);
    } catch (error) {
      console.error("Lỗi khi cập nhật like:", error);
    }

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFilterChange = (value) => {
    let filtered = [...feedback];

    switch (value) {
      case "like_increase":
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "like_decrease":
        filtered.sort((a, b) => a.likeCount - b.likeCount);
        break;
      case "date_increase":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        break;
      case "date_decrease":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    setFilteredFeedbacks(filtered);
  };

  return (
    <div style={{ width: 900, margin: "auto", marginTop: 100 }}>
      <Row
        style={{
          justifyContent: "space-between",
          paddingBottom: 40,
          borderBottom: "1px solid gray",
        }}
      >
        <p style={{ fontSize: 25, fontWeight: "bold" }}>Feedback</p>
        <Button
          style={{ backgroundColor: "black", borderRadius: 0 }}
          type="primary"
          onClick={() => showModal('add-new')}
        >
          Write Feedback
        </Button>
      </Row>

      <Modal
        title="Write new feedback"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}

      >
        <Form
          className="customer-feedback"
          name="basic"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="content"
            rules={[
              {
                min: 3,
                max: 200,
                message: "Content length must be between 3 and 200 characters.",
              },
            ]}
          >
            <TextArea
              autoSize={{
                minRows: 4,
                maxRows: 5,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              color="default"
              variant="solid"
              htmlType="submit"
              style={{ marginRight: 15 }}
            >
              Send feedback
            </Button>
            <Button
              color="default"
              variant="outlined"
              onClick={() => form.resetFields()}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Col span={6}>
        <div style={{ fontWeight: 600, fontSize: 20, marginTop: 20 }}>
          <FilterOutlined />
          <Select
            defaultValue="Date"
            style={{
              marginLeft: 20,
            }}
            onChange={handleFilterChange}
          >
            <Select.OptGroup label="Like">
              <Select.Option value="like_increase">Increase</Select.Option>
              <Select.Option value="like_decrease">Decrease</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Date">
              <Select.Option value="date_increase">Increase</Select.Option>
              <Select.Option value="date_decrease">Decrease</Select.Option>
            </Select.OptGroup>
          </Select>
        </div>
      </Col>
      <List
        style={{
          paddingBottom: "30px",
          borderBottom: "1px solid gray",
        }}
        itemLayout="horizontal"
        dataSource={filteredFeedbacks}
        split={false}
        renderItem={(item, index) => {
          const menu = (
            <Menu onClick={handleMenuClick(item, item._id)}>
              <Menu.Item key="edit">Edit</Menu.Item>
              <Menu.Item key="delete">Remove</Menu.Item>
            </Menu>
          );
          return (
            <List.Item style={{ marginBottom: 15, display: "block" }}>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col span={6}>
                  <b>{item.account_id.username}</b>
                </Col>
                <Col span={4} offset={13}>
                  <p>{new Date(item.createdAt).toDateString()}</p>
                </Col>
                {userId === item.account_id._id && (
                  <Col span={1}>
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <Button
                        style={{ borderColor: "white" }}
                        icon={<MoreOutlined />}
                      />
                    </Dropdown>
                  </Col>
                )}
              </Row>
              <div
                style={{
                  marginLeft: 20,
                  backgroundColor: "#F3F4F6",
                  height: 70,
                  marginTop: 10,
                  padding: 15,
                  paddingRight: 0,
                }}
              >
                <Row>
                  <Col span={2}>
                    <p>
                      <b>Đánh giá: </b>
                    </p>
                  </Col>
                  {/* <Col>
                    <Rate allowHalf disabled defaultValue={2.5} />
                  </Col> */}
                </Row>
                <Row>
                  <Col span={2}>
                    <p>
                      <b>Nhận xét: </b>
                    </p>
                  </Col>
                  <Col>
                    <p>{item.content}</p>
                  </Col>
                </Row>
              </div>

              <Row>
                <Button
                  style={{ borderColor: "white" }}
                  icon={
                    feedbackArr.includes(item._id) ? (
                      <LikeFilled />
                    ) : (
                      <LikeOutlined />
                    )
                  }
                  onClick={() => likeButton(item._id, user.id)}
                />
                {item.likeCount}
              </Row>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default CustomerFeedback;
