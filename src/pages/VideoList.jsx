import React, { useState, useEffect, cloneElement } from "react";
import { Button, Space, Popconfirm, message, Card, Input, List, Modal, Dropdown, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, PlayCircleOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getData, deleteData } from "../utils/api";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const location = useLocation();

  const getPlaylistByGroupId = async () => {
    try {
      const response = await getData(`/api/playlist/38`);
      return response;
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  };

  const deletePlaylistItem = async (playId) => {
    try {
      const response = await deleteData(`/api/playlist/${playId}`);
      return response;
    } catch (error) {
      console.error("Error deleting playlist item:", error);
      throw error;
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getPlaylistByGroupId();
      if (response?.datas) {
        setVideos(response.datas);
        setFilteredVideos(response.datas);
      } else {
        setVideos([]);
        setFilteredVideos([]);
      }
    } catch (error) {
      message.error("Gagal mengambil data video");
      setVideos([]);
      setFilteredVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    // Menambahkan event listener untuk pencarian dari header
    const handleHeaderSearch = (event) => {
      const { searchText, results } = event.detail;
      setSearchText(searchText);
      setFilteredVideos(results);
    };

    window.addEventListener("search-video", handleHeaderSearch);

    return () => {
      window.removeEventListener("search-video", handleHeaderSearch);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genre = params.get("genre");

    if (genre) {
      const filtered = videos.filter((video) => video.play_genre === genre);
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [location.search, videos]);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
    const filtered = videos.filter((video) => video.play_name.toLowerCase().includes(value.toLowerCase()) || video.play_genre.toLowerCase().includes(value.toLowerCase()));
    setFilteredVideos(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePlaylistItem(id);

      if (response instanceof Response) {
        if (response.status === 204 || response.status === 200) {
          message.success("Video berhasil dihapus");
          fetchVideos();
          return;
        }
      }

      if (response?.message === "OK") {
        message.success("Video berhasil dihapus");
        fetchVideos();
      } else {
        message.error("Gagal menghapus video");
      }
    } catch (error) {
      message.error("Gagal menghapus video");
    }
  };

  const handlePreview = (thumbnail) => {
    setPreviewImage(thumbnail);
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const getDropdownItems = (item) => [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => navigate(`/edit-video/${item.id_play}`),
    },
    {
      key: "delete",
      label: "Hapus",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Apakah Anda yakin ingin menghapus video ini?",
          content: "Tindakan ini tidak dapat dibatalkan.",
          okText: "Ya",
          okType: "danger",
          cancelText: "Tidak",
          onOk: () => handleDelete(item.id_play),
        });
      },
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredVideos.slice(startIndex, endIndex);
  };

  return (
    <Card title="Daftar Video" style={{ width: "100%" }}>
      {/* <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/add-video")}>
          Tambah Video Baru
        </Button>
      </div> */}

      {filteredVideos?.length > 0 && !loading ? (
        <>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 1,
            }}
            dataSource={getCurrentPageData()}
            renderItem={(item) => (
              <List.Item key={item.id_play}>
                <Card hoverable style={{ width: "100%" }} bodyStyle={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ position: "relative" }}>
                      <img
                        alt={item.play_name}
                        src={item.play_thumbnail}
                        style={{
                          width: "200px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePreview(item.play_thumbnail)}
                      />
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          opacity: 0.8,
                          background: "rgba(0, 0, 0, 0.5)",
                          border: "none",
                        }}
                        onClick={() => handlePreview(item.play_thumbnail)}
                      >
                        Preview
                      </Button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 8px 0" }}>{item.play_name}</h3>
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong>Genre:</strong> {item.play_genre}
                      </p>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.play_description}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <a href={item.play_url} target="_blank" rel="noopener noreferrer" style={{ color: "#EA4D1E" }}>
                          Tonton di YouTube
                        </a>
                        <Dropdown menu={{ items: getDropdownItems(item) }} trigger={["click"]} placement="bottomRight">
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredVideos.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `Total ${total} video`}
              itemRender={(page, type, originalElement) => {
                if (type === "page" && page === currentPage) {
                  return (
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #ea4d1e",
                        color: "#ea4d1e",
                        borderRadius: "4px",
                        padding: "0 8px",
                        height: "32px",
                        lineHeight: "30px",
                        textAlign: "center",
                        minWidth: "32px",
                        cursor: "pointer",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    >
                      {page}
                    </div>
                  );
                }
                return originalElement;
              }}
            />
          </div>
        </>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>Tidak ada video</div>
      )}

      <Modal open={previewVisible} footer={null} onCancel={handlePreviewCancel}>
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default VideoList;
