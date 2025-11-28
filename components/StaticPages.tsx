import React, { useState } from 'react';
import { ShieldCheck, Info, FileText, ArrowLeft, Send } from 'lucide-react';

interface StaticPagesProps {
  pageId: string; // 'ABOUT' | 'TERMS' | 'PRIVACY' | 'CONTACT'
  onBack: () => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ pageId, onBack }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
        alert("Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
        setSent(false);
        setContactName('');
        setContactEmail('');
        setContactMsg('');
    }, 1500);
  };

  const renderContent = () => {
    switch (pageId) {
      case 'ABOUT':
        return (
          <>
            <div className="text-center mb-10">
               <div className="w-20 h-20 bg-kid-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-kid-blue">
                 <Info size={40} />
               </div>
               <h1 className="text-4xl font-black text-gray-800 mb-4">Về Asking Kids</h1>
               <p className="text-xl text-gray-500">Sứ mệnh kiến tạo tương lai cho trẻ em Việt</p>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>Asking Kids là nền tảng giáo dục trực tuyến hàng đầu kết hợp giữa phương pháp học tập hiện đại và công nghệ AI tiên tiến, được thiết kế dành riêng cho trẻ em từ 2 đến 10 tuổi.</p>
              <h3>Tầm nhìn của chúng tôi</h3>
              <p>Chúng tôi tin rằng việc học tập không nên là áp lực mà phải là niềm vui. Asking Kids hướng tới việc xây dựng một môi trường nơi trẻ em có thể tự do khám phá, đặt câu hỏi và tìm thấy câu trả lời cho riêng mình.</p>
              <h3>Đội ngũ phát triển</h3>
              <p>Được thành lập bởi các chuyên gia giáo dục, kỹ sư công nghệ và những bậc phụ huynh tâm huyết, chúng tôi hiểu rõ trẻ em cần gì để phát triển toàn diện trong kỷ nguyên số.</p>
            </div>
          </>
        );
      case 'TERMS':
        return (
          <>
            <div className="text-center mb-10">
               <div className="w-20 h-20 bg-kid-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 text-kid-yellow">
                 <FileText size={40} />
               </div>
               <h1 className="text-4xl font-black text-gray-800 mb-4">Điều Khoản Sử Dụng</h1>
               <p className="text-xl text-gray-500">Quy định chung khi sử dụng nền tảng</p>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>Chào mừng bạn đến với Asking Kids. Khi truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản sau:</p>
              <h3>1. Tài khoản người dùng</h3>
              <p>Người dùng chịu trách nhiệm bảo mật thông tin tài khoản của mình. Phụ huynh nên giám sát khi trẻ em sử dụng tài khoản.</p>
              <h3>2. Nội dung</h3>
              <p>Mọi nội dung trên Asking Kids (hình ảnh, bài viết, trò chơi) thuộc bản quyền của chúng tôi. Nghiêm cấm sao chép vì mục đích thương mại khi chưa có sự đồng ý.</p>
              <h3>3. Quy tắc ứng xử</h3>
              <p>Chúng tôi cam kết xây dựng cộng đồng văn minh. Các hành vi ngôn ngữ không phù hợp, quấy rối sẽ bị khóa tài khoản vĩnh viễn.</p>
            </div>
          </>
        );
      case 'PRIVACY':
        return (
          <>
            <div className="text-center mb-10">
               <div className="w-20 h-20 bg-kid-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-kid-green">
                 <ShieldCheck size={40} />
               </div>
               <h1 className="text-4xl font-black text-gray-800 mb-4">Chính Sách Bảo Mật</h1>
               <p className="text-xl text-gray-500">Cam kết bảo vệ thông tin của bạn</p>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>Tại Asking Kids, quyền riêng tư của trẻ em và gia đình là ưu tiên hàng đầu.</p>
              <h3>1. Thu thập thông tin</h3>
              <p>Chúng tôi chỉ thu thập các thông tin cần thiết (tên, email, độ tuổi của bé) để cá nhân hóa trải nghiệm học tập.</p>
              <h3>2. Sử dụng thông tin</h3>
              <p>Thông tin của bạn KHÔNG BAO GIỜ được bán cho bên thứ ba. Chúng tôi sử dụng dữ liệu để cải thiện nội dung và gửi các thông báo quan trọng.</p>
              <h3>3. An toàn cho trẻ em</h3>
              <p>Asking Kids tuân thủ các quy định về bảo vệ trẻ em trên môi trường mạng (COPPA). Chúng tôi không thu thập thông tin cá nhân chi tiết từ trẻ em dưới 13 tuổi mà không có sự đồng ý của phụ huynh.</p>
            </div>
          </>
        );
      case 'CONTACT':
          return (
            <>
               <div className="text-center mb-10">
                 <h1 className="text-4xl font-black text-gray-800 mb-4">Liên Hệ</h1>
                 <p className="text-xl text-gray-500">Chúng tôi luôn lắng nghe bạn</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-gray-50 p-8 rounded-2xl">
                      <h3 className="font-bold text-xl mb-4 text-gray-800">Thông tin liên hệ</h3>
                      <p className="mb-4"><strong>Email:</strong> hotro@askingkids.vn</p>
                      <p className="mb-4"><strong>Hotline:</strong> 1900 123 456</p>
                      <p className="mb-4"><strong>Địa chỉ:</strong> Tầng 12, Tòa nhà Innovation, Quận 1, TP. Hồ Chí Minh</p>
                      <p className="text-sm text-gray-500 mt-6">Giờ làm việc: Thứ 2 - Thứ 6 (8:00 - 17:30)</p>
                   </div>

                   <form onSubmit={handleSendContact} className="space-y-4">
                      <h3 className="font-bold text-xl mb-4 text-gray-800">Gửi tin nhắn cho chúng tôi</h3>
                      <input 
                        type="text" required 
                        placeholder="Họ tên của bạn"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                      />
                      <input 
                        type="email" required 
                        placeholder="Email liên hệ"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                      />
                      <textarea 
                        required 
                        rows={4}
                        placeholder="Nội dung tin nhắn..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-kid-blue focus:outline-none"
                        value={contactMsg}
                        onChange={e => setContactMsg(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        disabled={sent}
                        className="w-full bg-kid-blue text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                         <Send size={18} /> {sent ? "Đang gửi..." : "Gửi Tin Nhắn"}
                      </button>
                   </form>
               </div>
            </>
          )
      default:
        return <div>Nội dung đang cập nhật...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white min-h-[600px] shadow-sm rounded-3xl border border-gray-100 mt-8">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-kid-blue font-bold transition-colors"
      >
        <ArrowLeft size={20} /> Quay lại trang chủ
      </button>
      
      {renderContent()}
    </div>
  );
};