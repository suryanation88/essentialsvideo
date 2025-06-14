import React, { useState, useCallback, useRef } from "react";
import { Input, Avatar, Button } from "antd";
import { UserOutlined, AudioOutlined, BellOutlined, SearchOutlined } from "@ant-design/icons";
import { getData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HeaderSearch = () => {
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  const searchVideos = async (value) => {
    try {
      setLoading(true);
      const response = await getData(`/api/playlist/38`);

      if (response?.datas) {
        const filteredVideos = response.datas.filter((video) => video.play_name.toLowerCase().includes(value.toLowerCase()) || video.play_genre.toLowerCase().includes(value.toLowerCase()));

        window.dispatchEvent(
          new CustomEvent("search-video", {
            detail: {
              searchText: value,
              results: filteredVideos,
            },
          })
        );
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    searchVideos(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim() === "") {
      // Jika input kosong, tampilkan semua video
      getData(`/api/playlist/38`)
        .then((response) => {
          if (response?.datas) {
            window.dispatchEvent(
              new CustomEvent("search-video", {
                detail: {
                  searchText: "",
                  results: response.datas,
                },
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching all videos:", error);
        });
    } else {
      // Set new timeout
      searchTimeout.current = setTimeout(() => {
        searchVideos(value);
      }, 300);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
        <Input.Search
          placeholder="Cari video..."
          allowClear
          loading={loading}
          style={{ width: "100%" }}
          onSearch={handleSearch}
          onChange={handleChange}
          enterButton={
            <Button
              type="primary"
              style={{
                backgroundColor: "#EA4D1E",
                borderColor: "#EA4D1E",
                color: "white",
              }}
              icon={<SearchOutlined style={{ color: "white" }} />}
            />
          }
        />
        <AudioOutlined style={{ fontSize: "20px", marginLeft: "16px", cursor: "pointer", color: "#EA4D1E" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", position: "absolute", right: "16px" }}>
        <BellOutlined style={{ fontSize: "20px", marginRight: "16px", cursor: "pointer", color: "#EA4D1E" }} />
        <Avatar size={40} icon={<UserOutlined style={{ color: "white" }} />} onClick={() => navigate("/profile")} style={{ cursor: "pointer", backgroundColor: "#EA4D1E" }} />
      </div>
    </div>
  );
};

export default HeaderSearch;
