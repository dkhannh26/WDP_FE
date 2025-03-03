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
  Progress,
  Rate,
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
  const [feedbackLikeArr, setFeedbackLikeArr] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentFeedback, setCurrentFeedback] = useState(false);
  const [id, setId] = useState("");
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const selectId = product_id;
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingDistribution, setAvgRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  const totalReviews = feedback.length;

  const handleRatingChange = (value) => {
    setRating(value);
  };
  const onFinish = (values) => {
    const feedbackData = {
      content: values.content,
      account_id: userId,
      product_id,
      star: rating,
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
        setFeedbackLikeArr(data);
      });
    }
  }, [selectId, user?.id, refreshTrigger]);

  useEffect(() => {
    console.log("Feedback like array: ", feedbackLikeArr);
  }, [feedbackLikeArr]);
  useEffect(() => {
    setFilteredFeedbacks([...feedback]);
    let sum = 0;
    const newDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedback.forEach((e) => {
      sum += e.star;
      if (e.star >= 1 && e.star <= 5) {
        newDistribution[e.star] += 1;
      }
    });
    setAvgRating(sum / feedback.length);
    setAvgRatingDistribution(newDistribution);
    console.log(ratingDistribution);
  }, [feedback]);

  const likeButton = async (feedback_id, account_id) => {
    setFeedbackLikeArr((prev) =>
      prev.includes(feedback_id)
        ? prev.filter((id) => id !== feedback_id)
        : [...prev, feedback_id]
    );
    try {
      await likeFeedback(feedback_id, account_id);
      const updatedLikes = await getFeedbackLike(account_id);
      setFeedbackLikeArr(updatedLikes);
    } catch (error) {
      console.error(error);
    }

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFilterChange = (value) => {
    let filtered = [...feedback];

    switch (value) {
      case "like_increase":
        filtered.sort((a, b) => a.likeCount - b.likeCount);
        break;
      case "like_decrease":
        filtered.sort((a, b) => b.likeCount - a.likeCount);
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

  const totalRatings = totalReviews;
  const getPercent = (count) =>
    totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;

  console.log(ratingDistribution[5]);

  return (
    <div style={{ width: 1200, margin: "auto", marginTop: 100 }}>
      <Row
        style={{
          justifyContent: "space-between",
          paddingBottom: 40,
          borderBottom: "1px solid gray",
        }}
      >
        <p style={{ fontSize: 25, fontWeight: "bold" }}>Feedback</p>
      </Row>
      <Row className="rating-summary">
        <Col span={10}>
          <div className="average-rating">
            <p className="average-score">{avgRating.toFixed(1)}/5</p>
            <Rate
              value={avgRating}
              disabled
              allowHalf
              style={{ fontSize: "16px", color: "#ff8c00" }}
            />
            <p className="review-count">{totalReviews} đánh giá và nhận xét</p>
          </div>
        </Col>
        <Col span={1} style={{ borderLeft: "2px solid #d9d9d9" }}></Col>
        <Col span={13}>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="rating-row">
                <span className="star-label">
                  {star}{" "}
                  <Rate
                    value={star}
                    disabled
                    count={1}
                    style={{ fontSize: "16px", color: "#ff8c00" }}
                  />
                </span>
                <Progress
                  percent={getPercent(ratingDistribution[star])}
                  showInfo={false}
                  strokeColor={"#ff4d4f"}
                  trailColor="#f0f0f0"
                  strokeWidth={10}
                  style={{ width: "200px" }}
                />
                <span className="rating-count">
                  {ratingDistribution[star]} đánh giá
                </span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row style={{ justifyContent: "center", fontSize: 16, marginBottom: 10 }}>
        <p>Bạn đánh giá sao sản phẩm này?</p>
      </Row>
      <Row style={{ justifyContent: "center" }}>
        <Button
          style={{
            backgroundColor: "black",
            borderRadius: 0,
            width: "30%",
            borderRadius: "16px",
          }}
          type="primary"
          onClick={() => showModal("add-new")}
        >
          Write Feedback
        </Button>
      </Row>

      <Modal
        title="Đánh giá & nhận xét sản phẩm"
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
          layout="vertical"
        >
          <Form.Item
            name="content"
            rules={[
              {
                min: 3,
                max: 200,
                message: "Content length must be between 3 and 200 characters.",
                required: true,
                message: "Vui lòng nhập đánh giá!",
              },
            ]}
            className="input-form-item"
          >
            <TextArea
              placeholder="Xin mời chia sẻ nhận xét về sản phẩm..."
              autoSize={{
                minRows: 4,
                maxRows: 5,
              }}
            />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Bạn thấy sản phẩm này như thế nào?"
            className="rating-form-item"
            rules={[{ required: true, message: "Vui lòng đánh giá sản phẩm!" }]}
          >
            <Rate defaultValue={0} onChange={handleRatingChange} />
          </Form.Item>
          <Form.Item style={{ marginTop: 20 }}>
            <Button
              color="default"
              variant="solid"
              htmlType="submit"
              style={{ padding: 18, width: "100%", borderRadius: "12px" }}
            >
              Send feedback
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
                  <b style={{ fontSize: "16px" }}>{item.account_id.username}</b>
                </Col>
                <Col span={5} offset={13}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <p>{new Date(item.createdAt).toDateString()}</p>
                    {userId === item.account_id._id && (
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                          style={{ borderColor: "white" }}
                          icon={<MoreOutlined />}
                        />
                      </Dropdown>
                    )}
                  </div>
                </Col>
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
                  <Col>
                    <Rate allowHalf disabled defaultValue={item.star} />
                  </Col>
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
                    feedbackLikeArr.includes(item._id) ? (
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
