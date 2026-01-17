import React, { useState, useRef, useEffect } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
  FaSmile,
  FaPhone,
  FaTrash,
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaClock,
  FaBell,
  FaShippingFast,
  FaDollarSign,
  FaSearch,
  FaQuestionCircle,
} from "react-icons/fa";

export default function ChatWidget({ sessionId = null, isStacked = false }) {
  const STORAGE_KEY = `chat_history_${sessionId || "guest"}`;
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const scrollRef = useRef();

  /** ---------------------------
   * SAVE + AUTO SCROLL
   * --------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, STORAGE_KEY]);

  /** ---------------------------
   * FIX: CLEAR KHI LOGOUT (EVENT GLOBAL)
   * --------------------------- */
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "chatbot_clear") {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [STORAGE_KEY]);

  /** ---------------------------
   * FIX: LOAD CHAT MỚI KHI sessionId đổi (Đăng nhập/Đăng xuất)
   * --------------------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch {
      setMessages([]);
    }
  }, [sessionId, STORAGE_KEY]);

  /** gửi tin nhắn */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userRole = localStorage.getItem("role") || "khách hàng";
    const userName = localStorage.getItem("username") || "Khách hàng";

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages.slice(-8);

    try {
      const res = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          history,
          save: false,
          user_role: userRole, 
          username: userName, 
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.assistant },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.message || "Lỗi server" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Lỗi kết nối đến server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setShowClearConfirm(false);
  };

  // ===========================================
  //          IMAGE RENDERING LOGIC
  // ===========================================
  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif|\.webp)[^\s]*)/gi;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (index % 2 !== 0 && part) {
        return (
          <div key={index} className="flex flex-col gap-2 mt-2">
            <a href={part} target="_blank" rel="noopener noreferrer">
              <img
                src={part}
                alt="Product Image"
                className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200 cursor-pointer transition-transform hover:scale-[1.01] duration-300"
                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                loading="lazy"
              />
            </a>
          </div>
        );
      }

      let renderedText = part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <span key={index} dangerouslySetInnerHTML={{ __html: renderedText }} />;
    });
  };

  // ===========================================
  //        QUICK ACTIONS FOR GO SHIP
  // ===========================================
  const quickActions = [
    { text: "Theo dõi đơn hàng", icon: FaSearch, color: "from-blue-500 to-blue-600" },
    { text: "Đặt dịch vụ vận chuyển", icon: FaShippingFast, color: "from-green-500 to-green-600" },
    { text: "Báo giá nhanh", icon: FaDollarSign, color: "from-yellow-500 to-yellow-600" },
    { text: "Thời gian giao hàng", icon: FaClock, color: "from-purple-500 to-purple-600" },
    { text: "Liên hệ hỗ trợ", icon: FaPhone, color: "from-red-500 to-red-600" },
    { text: "Câu hỏi thường gặp", icon: FaQuestionCircle, color: "from-indigo-500 to-indigo-600" },
  ];

  const handleQuickAction = (actionText) => {
    setInput(actionText);
  };

  // ===========================================
  //        COMPONENT RENDER
  // ===========================================
  const positionStyle = isStacked 
    ? {} 
    : { position: "fixed", right: "1rem", bottom: "1.5rem", zIndex: 50 };

  return (
    <div style={positionStyle}>
      <div className="flex flex-col items-end gap-3" style={{ maxHeight: "calc(100vh - 120px)" }}>
        {open && (
          <div
            className="w-full sm:w-96 max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 border border-gray-100 mx-4 sm:mx-0"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 flex items-center justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <FaTruck className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">GoShip Assistant</h2>
                  <p className="text-sm text-blue-200 flex items-center gap-1">
                    <FaBell className="animate-pulse" size={12} /> Hỗ trợ 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                {messages.length > 0 && (
                  <button
                    className="text-gray-300 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200"
                    onClick={() => setShowClearConfirm(true)}
                    title="Xóa toàn bộ tin nhắn"
                  >
                    <FaTrash size={18} />
                  </button>
                )}
                <button
                  className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                  onClick={() => setOpen(false)}
                  title="Đóng"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* CLEAR CONFIRM POPUP */}
            {showClearConfirm && (
              <div className="absolute w-full h-full bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white shadow-xl rounded-2xl p-6 text-center space-y-4 max-w-xs">
                  <p className="text-gray-700 font-medium">
                    Bạn có chắc muốn xoá toàn bộ tin nhắn?
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors"
                      onClick={() => setShowClearConfirm(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      onClick={clearMessages}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions - Responsive Grid */}
            {messages.length === 0 && (
              <div className="px-4 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.text)}
                      className={`bg-gradient-to-r ${action.color} text-white p-3 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95`}
                    >
                      <action.icon className="text-lg mb-1" />
                      <span className="text-xs font-medium leading-tight">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages - Responsive */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 flex flex-col gap-3 scroll-smooth"
              style={{ 
                height: messages.length === 0 ? "300px" : "384px",
                maxHeight: "calc(100vh - 280px)"
              }}
            >
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full flex-col gap-4 pt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                    <FaTruck className="text-3xl text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-800 font-semibold text-sm">
                      Chào bạn! Tôi là GoShip Assistant
                    </p>
                    <p className="text-gray-500 text-xs mt-1 max-w-xs">
                      Tôi có thể giúp bạn theo dõi đơn hàng, đặt dịch vụ vận chuyển, báo giá và hỗ trợ khác.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium shadow-sm break-words ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }`}
                    style={{ 
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {m.role === "assistant"
                      ? renderMessageContent(m.content)
                      : m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 text-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2 shadow-sm">
                    <FaSpinner className="animate-spin text-blue-500" size={14} />
                    <span className="text-sm font-medium">Đang xử lý...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input - Responsive */}
            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={2}
                  className="flex-1 resize-none border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 bg-gray-50"
                  placeholder="Nhập mã vận đơn, câu hỏi về vận chuyển..."
                  style={{ 
                    minHeight: '44px',
                    maxHeight: '120px'
                  }}
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 flex-shrink-0 h-[44px]"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  title="Gửi"
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-600">
              <FaPhone size={12} className="text-blue-600" />
              <span>Hotline hỗ trợ: 1800-XXXX</span>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <div className="group relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 duration-300 active:scale-95 relative overflow-hidden"
            title="Mở trợ lý ảo GoShip"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            {messages.length === 0 ? (
              <FaTruck size={24} className="relative z-10" />
            ) : (
              <FaComments size={24} className="relative z-10" />
            )}

            {messages.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {Math.min(messages.length, 9)}
              </div>
            )}
          </button>

          {/* Text Label */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg shadow-lg font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:block">
            GoShip Assistant
          </div>
        </div>
      </div>
    </div>
  );
}