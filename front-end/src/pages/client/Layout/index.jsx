import Header from "./Header";
import Footer from "./Footer";
import ChatBubble from "../../../components/chats/MessengerChat"; 
import Chatbot from "../../../components/chats/ChatWidget";

const MasterLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="p-6">
        {children}
      </main>
      <Footer />
      
      {/* Chat Bubbles - Hiển thị trên tất cả trang public */}
      <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 999, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}>
        <ChatBubble isStacked={true} />
        <Chatbot isStacked={true} />
      </div>
    </>
  );
};

export default MasterLayout;