import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Button, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/api"; // Mengimpor utility API

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newlyAddedVideos, setNewlyAddedVideos] = useState([]);
  const [thisWeekVideos, setThisWeekVideos] = useState([]);
  const [thisMonthVideos, setThisMonthVideos] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getData("/api/playlist/38"); // Asumsi endpoint untuk semua video
        if (response?.datas) {
          const videos = response.datas.map((video) => ({
            ...video,
            created_at: new Date(video.created_at), // Pastikan created_at adalah objek Date
          }));
          setAllVideos(videos);
          filterVideos(videos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Menambahkan event listener untuk pencarian
    const handleSearch = (event) => {
      const { searchText, results } = event.detail;
      setSearchText(searchText);
      setSearchResults(results);
    };

    window.addEventListener("search-video", handleSearch);

    return () => {
      window.removeEventListener("search-video", handleSearch);
    };
  }, []);

  const filterVideos = (videos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Minggu dimulai dari Minggu
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newlyAdded = videos.filter((video) => video.created_at >= today);
    const thisWeek = videos.filter((video) => video.created_at >= startOfWeek);
    const thisMonth = videos.filter((video) => video.created_at >= startOfMonth);

    setNewlyAddedVideos(newlyAdded.slice(0, 4)); // Batasi 4 video terbaru
    setThisWeekVideos(thisWeek.slice(0, 4));
    setThisMonthVideos(thisMonth.slice(0, 4));
  };

  const renderVideoCards = (videoArray) => {
    if (loading) {
      return (
        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </Col>
      );
    }
    if (videoArray.length === 0) {
      return (
        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
          <Empty description="Tidak ada video ditemukan" />
        </Col>
      );
    }
    return videoArray.map((video) => (
      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={video.id_play} style={{ marginBottom: "16px" }}>
        <Card
          hoverable
          cover={<img alt={video.play_name} src={video.play_thumbnail} style={{ height: "180px", objectFit: "cover" }} />}
          onClick={() => window.open(video.play_url, "_blank")} // Mengubah navigasi ke URL YouTube
        >
          <Card.Meta title={video.play_name} />
        </Card>
      </Col>
    ));
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "24px" }}>
        <Button type="primary" style={{ backgroundColor: "#EA4D1E", borderColor: "#EA4D1E", height: "40px", borderRadius: "5px" }} onClick={() => navigate("/tambah-video")}>
          Tambah video baru
        </Button>
      </div>

      {searchText ? (
        <>
          <h3 style={{ marginBottom: "16px" }}>Hasil Pencarian: {searchText}</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(searchResults || [])}</Row>
        </>
      ) : (
        <>
          <h3 style={{ marginBottom: "16px" }}>Baru ditambahkan</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(newlyAddedVideos)}</Row>

          <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Minggu ini</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(thisWeekVideos)}</Row>

          <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Bulan ini</h3>
          <Row gutter={[16, 16]}>{renderVideoCards(thisMonthVideos)}</Row>
        </>
      )}
    </div>
  );
};

export default Home;
