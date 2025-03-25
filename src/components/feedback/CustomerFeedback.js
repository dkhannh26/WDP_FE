import {
  FilterOutlined,
  LikeFilled,
  LikeOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  List,
  Menu,
  Modal,
  Progress,
  Rate,
  Row,
  Select,
  Upload,
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
  getFeedbackImg,
  sendNotification,
  createReply,
  getReplies,
} from "../../services/feedback.service";
import { showDeleteConfirm } from "../../utils/helper";
import { useAuth } from "../context/AuthContext";
import UploadImg from "../common/UploadImg";

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
  const [fileList, setFileList] = useState([]);
  const [replyForms, setReplyForms] = useState({}); // Theo dõi form reply nào đang hiển thị
  const [replies, setReplies] = useState({}); // Lưu trữ replies cho từng feedback
  const totalReviews = feedback.length;
  const handleFileListChange = (newFileList) => {
    setFileList(newFileList);
  };
  const handleRatingChange = (value) => {
    setRating(value);
  };
  const onFinish = async (values) => {
    const feedbackData = {
      content: values.content,
      account_id: userId,
      product_id,
      star: rating,
    };
    let result;
    try {
      if (currentFeedback) {
        result = await updateFeedback(id, feedbackData, fileList);
        setCurrentFeedback(false);
        setFeedback((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, ...feedbackData, imageUrls: result.imageUrls || [] }
              : item
          )
        );
      } else {
        result = await createFeedback(feedbackData, fileList);
        const newFeedback = {
          _id: result.feedbackId,
          ...feedbackData,
          account_id: { _id: userId, username: user.username }, // Giả sử username từ user
          createdAt: new Date().toISOString(),
          likeCount: 0,
          imageUrls: result.imageUrls || [],
        };
        setFeedback((prev) => [...prev, newFeedback]);
      }
      // sendNotification(feedbackData);
      setFileList([]);
      form.resetFields();
      setIsModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error in onFinish:", error);
    }
  };
  const editFeedback = async (feedbackItem, id) => {
    setCurrentFeedback(true);
    setId(id);
    console.log(feedbackItem);
    setRating(feedbackItem.star);
    form.setFieldsValue({
      content: feedbackItem.content,
      rating: feedbackItem.star,
    });

    let fileList = await getFeedbackImg(id);

    setFileList(fileList || []);

    setIsModalOpen(true);
  };

  const showModal = async (action) => {
    form.resetFields();
    setFileList([]);

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
    getListFeedback(selectId, setFeedback);

    if (user.id) {
      getFeedbackLike(user.id).then((data) => {
        setFeedbackLikeArr(data);
      });
    }
    // console.log(feedback);
  }, [selectId, user?.id, refreshTrigger]);

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
    feedback.length === 0
      ? setAvgRating(0)
      : setAvgRating(sum / feedback.length);
    setAvgRatingDistribution(newDistribution);
    // Lấy replies cho tất cả feedback
    feedback.forEach((item) => {
      getReplies(item?._id).then((data) => {
        setReplies((prev) => ({ ...prev, [item._id]: data }));
      });
    });
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

  const handleReplySubmit = async (feedbackId, values) => {
    const replyData = {
      content: values.replyContent,
      account_id: userId,
      feedback_id: feedbackId,
    };
    try {
      const result = await createReply(feedbackId, replyData);
      setReplies((prev) => ({
        ...prev,
        [feedbackId]: [
          ...(prev[feedbackId] || []),
          {
            _id: result._id,
            ...replyData,
            account_id: { _id: userId, username: user.username },
            createdAt: new Date().toDateString(),
          },
        ],
      }));
      setReplyForms((prev) => ({ ...prev, [feedbackId]: false }));
      form.resetFields([`reply-${feedbackId}`]);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const toggleReplyForm = (feedbackId) => {
    setReplyForms((prev) => ({ ...prev, [feedbackId]: !prev[feedbackId] }));
  };

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

      {localStorage.getItem("role") === "user" ? (
        <>
          <Row
            style={{ justifyContent: "center", fontSize: 16, marginBottom: 10 }}
          >
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
        </>
      ) : (
        <></>
      )}

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
          <Form.Item
            name="rating"
            label="Bạn thấy sản phẩm này như thế nào?"
            className="rating-form-item"
            rules={[{ required: true, message: "Vui lòng đánh giá sản phẩm!" }]}
          >
            <UploadImg
              onFileListChange={handleFileListChange}
              filesApi={fileList}
            ></UploadImg>
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
              <Row className="feedback-image-container">
                {item?.imageUrls && item.imageUrls.length > 0
                  ? item.imageUrls.map((url, index) => (
                      <Image
                        key={index}
                        preview={true}
                        className="feedback-image"
                        width={100}
                        height={100}
                        src={`http://localhost:3000${url}`}
                      />
                    ))
                  : ""}
              </Row>
              {localStorage.getItem("role") === "user" ? (
                <Row>
                  <Button
                    size="large"
                    style={{
                      borderColor: "white",
                    }}
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
              ) : (
                <Row style={{ marginTop: 10 }}>
                  <Col span={24}>
                    <Button
                      type="link"
                      onClick={() => toggleReplyForm(item._id)}
                      style={{ padding: 0 }}
                    >
                      Reply
                    </Button>

                    {/* Reply Form */}
                    {replyForms[item._id] && (
                      <Form
                        name={`reply-${item._id}`}
                        onFinish={(values) =>
                          handleReplySubmit(item._id, values)
                        }
                        style={{ marginTop: 10 }}
                      >
                        <Form.Item
                          name="replyContent"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your reply!",
                            },
                            {
                              min: 3,
                              max: 200,
                              message:
                                "Reply must be between 3 and 200 characters",
                            },
                          ]}
                        >
                          <TextArea
                            placeholder="Write your reply..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Submit Reply
                          </Button>
                          <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => toggleReplyForm(item._id)}
                          >
                            Cancel
                          </Button>
                        </Form.Item>
                      </Form>
                    )}
                  </Col>
                </Row>
              )}

              {/* Display Replies */}
              <Row>
                {replies[item._id] && replies[item._id].length > 0 && (
                  <List
                    dataSource={replies[item._id]}
                    renderItem={(reply) => (
                      <List.Item style={{ padding: "5px 0 5px 20px" }}>
                        <div>
                          <b>{reply.account_id.username} </b>
                          <span
                            style={{
                              marginLeft: 8,
                              color: "#fff",
                              backgroundColor: "#1890ff",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontSize: 12,
                            }}
                          >
                            Quản trị viên
                          </span>
                          -{" "}
                          <span style={{ color: "#666" }}>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                          <p>{reply.content}</p>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Row>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default CustomerFeedback;
