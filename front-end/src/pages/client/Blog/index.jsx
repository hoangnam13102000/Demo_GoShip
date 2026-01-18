import React, { useState } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaArrowRight,
  FaShareAlt,
  FaBookmark,
  FaRegHeart,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaChevronRight,
  FaFilter,
  FaFire,
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaTruck,
  FaBoxOpen,
  FaGlobeAsia,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  // Blog categories
  const categories = [
    { name: "Tất cả", count: 12, icon: <FaFire className="text-red-500" /> },
    { name: "Công nghệ", count: 5, icon: <FaRocket className="text-blue-500" /> },
    { name: "Logistics", count: 4, icon: <FaTruck className="text-green-500" /> },
    { name: "Kinh nghiệm", count: 3, icon: <FaLightbulb className="text-yellow-500" /> },
    { name: "Thị trường", count: 3, icon: <FaChartLine className="text-purple-500" /> },
    { name: "Case Study", count: 2, icon: <FaBoxOpen className="text-orange-500" /> },
  ];

  // Blog posts
  const posts = [
    {
      id: 1,
      title: "Tối ưu hóa giao hàng cho shop online: Tăng tỉ lệ chuyển đổi 300%",
      desc: "Khám phá 7 mẹo chiến lược giúp các shop online tối ưu quy trình giao hàng, giảm 40% thời gian vận chuyển và tăng trải nghiệm khách hàng.",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Nguyễn Minh Tuấn",
      date: "15/03/2024",
      readTime: "8 phút đọc",
      category: "Kinh nghiệm",
      tags: ["E-commerce", "Tối ưu", "Shop Online"],
      featured: true,
      views: "12.5K",
      likes: 842,
    },
    {
      id: 2,
      title: "Công nghệ Real-time Tracking 4.0: Bí mật đằng sau định vị chính xác từng mét",
      desc: "Phân tích chuyên sâu về hệ thống định vị thời gian thực của GoShip - Công nghệ AI và IoT tạo nên khác biệt trong ngành logistics.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Trần Văn Hải",
      date: "12/03/2024",
      readTime: "12 phút đọc",
      category: "Công nghệ",
      tags: ["AI", "IoT", "Real-time", "Technology"],
      featured: true,
      views: "15.2K",
      likes: 1120,
    },
    {
      id: 3,
      title: "Logistics 4.0: Tự động hóa và AI đang cách mạng hóa ngành vận chuyển như thế nào?",
      desc: "Nhìn nhận toàn diện về sự chuyển mình của logistics hiện đại với sự hỗ trợ của Trí tuệ nhân tạo và tự động hóa thông minh.",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Lê Thị Mai",
      date: "10/03/2024",
      readTime: "15 phút đọc",
      category: "Logistics",
      tags: ["Logistics 4.0", "AI", "Tự động hóa"],
      featured: false,
      views: "9.8K",
      likes: 756,
    },
    {
      id: 4,
      title: "10 Xu hướng Logistics 2024: Đón đầu làn sóng chuyển đổi số",
      desc: "Dự báo và phân tích chi tiết các xu hướng công nghệ sẽ định hình ngành logistics trong năm tới từ góc nhìn chuyên gia.",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Phạm Quốc Bảo",
      date: "08/03/2024",
      readTime: "10 phút đọc",
      category: "Thị trường",
      tags: ["Xu hướng", "2024", "Chuyển đổi số"],
      featured: false,
      views: "11.3K",
      likes: 923,
    },
    {
      id: 5,
      title: "Case Study: GoShip giúp doanh nghiệp F&B tăng 150% doanh thu với giải pháp giao hàng tối ưu",
      desc: "Phân tích chi tiết case study thực tế về cách GoShip tối ưu chuỗi cung ứng cho chuỗi nhà hàng lớn tại Việt Nam.",
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Đỗ Thanh Hằng",
      date: "05/03/2024",
      readTime: "14 phút đọc",
      category: "Case Study",
      tags: ["F&B", "Case Study", "Tối ưu hóa"],
      featured: true,
      views: "8.7K",
      likes: 634,
    },
    {
      id: 6,
      title: "Xây dựng hệ thống quản lý kho thông minh với công nghệ đám mây",
      desc: "Hướng dẫn chi tiết về việc triển khai hệ thống quản lý kho hàng thông minh dựa trên nền tảng điện toán đám mây.",
      img: "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Vũ Minh Đức",
      date: "03/03/2024",
      readTime: "11 phút đọc",
      category: "Công nghệ",
      tags: ["Cloud", "Warehouse", "Smart System"],
      featured: false,
      views: "7.9K",
      likes: 521,
    },
  ];

  // Featured posts
  const featuredPosts = posts.filter(post => post.featured);

  // Recent posts
  const recentPosts = posts.slice(0, 3);

  // Popular tags
  const popularTags = [
    "Logistics", "E-commerce", "AI", "Tối ưu hóa", "Công nghệ", 
    "Vận chuyển", "Supply Chain", "Digital Transformation", "Automation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FaGlobeAsia className="text-xl" />
              <span className="font-medium">Khám phá kiến thức chuyên sâu</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Blog <span className="text-yellow-300">GoShip</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Nơi chia sẻ kiến thức, kinh nghiệm và xu hướng mới nhất trong ngành Logistics & Technology
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết, chủ đề hoặc từ khóa..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              Chủ đề nổi bật
            </h2>
            <span className="text-gray-500 text-sm">{posts.length} bài viết</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.icon}
                {category.name}
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <FaFire className="text-white" />
              </div>
              Bài viết nổi bật
            </h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              Xem tất cả <FaChevronRight className="text-sm" />
            </a>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="group">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <FaBookmark className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUser />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaTag />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {post.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaRegHeart />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaComments />
                          <span>{post.views} lượt xem</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <FaShareAlt className="text-gray-500" />
                        </button>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                          Đọc tiếp
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Blog Posts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Bài viết mới nhất</h2>
              <div className="flex items-center gap-4">
                <select className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Sắp xếp theo mới nhất</option>
                  <option>Phổ biến nhất</option>
                  <option>Xem nhiều nhất</option>
                </select>
              </div>
            </div>

            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/3 relative">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Nổi bật
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTag />
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.desc}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                          Đọc tiếp
                          <FaArrowRight className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  Trước
                </button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      num === 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  Sau
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* About Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4">
                  <FaGlobeAsia className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Về Blog GoShip</h3>
                <p className="text-gray-600 text-sm">
                  Nơi chia sẻ kiến thức chuyên sâu từ đội ngũ 10+ năm kinh nghiệm trong ngành Logistics & Technology.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61583647847492" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                  <FaFacebookF className="text-blue-600" />
                </a>
                <a href="#"  className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                  <FaTwitter className="text-blue-400" />
                </a>
                <a href="#" className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                  <FaLinkedinIn className="text-blue-700" />
                </a>
                <a href="#" className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                  <FaInstagram className="text-pink-600" />
                </a>
                <a href="#" className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                  <FaYoutube className="text-red-600" />
                </a>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="text-blue-600" />
                Thẻ phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Bài viết gần đây</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <a key={post.id} href="#" className="group flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <FaPaperPlane className="text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nhận tin mới nhất</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Đăng ký để nhận bài viết mới và thông tin hữu ích từ GoShip
                </p>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:outline-none text-gray-800"
                />
                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 rounded-xl transition-colors">
                  Đăng ký ngay
                </button>
              </div>
              <p className="text-blue-100 text-xs text-center mt-4">
                Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng chuyển đổi logistics doanh nghiệp?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn xây dựng giải pháp vận chuyển tối ưu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Đăng ký tư vấn miễn phí
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-lg transition-all duration-300">
              Xem giải pháp
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style >{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;