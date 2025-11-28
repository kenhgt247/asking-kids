import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    // Updated margin-top (mt-32 md:mt-60 lg:mt-80) to push footer down enough for the wave SVG
    <footer className="relative bg-white pt-12 mt-32 md:mt-60 lg:mt-80 pb-24 md:pb-12 text-gray-600 border-t border-gray-100">
      {/* Decorative Wave Top - Added pointer-events-none so it doesn't block clicks if it overlaps */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full pointer-events-none w-full leading-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-white fill-current drop-shadow-sm block">
           <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-kid-pink rounded-xl flex items-center justify-center text-white font-black text-xl rotate-3">A</div>
              <div className="w-10 h-10 bg-kid-yellow rounded-xl flex items-center justify-center text-white font-black text-xl -rotate-3">K</div>
              <span className="text-2xl font-black text-gray-800 tracking-tight">Asking Kids</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Nền tảng giáo dục & giải trí toàn diện dành cho trẻ em Việt Nam. Giúp bé học mà chơi, chơi mà học cùng công nghệ AI tiên tiến.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon Icon={Facebook} color="hover:text-blue-600" />
              <SocialIcon Icon={Instagram} color="hover:text-pink-600" />
              <SocialIcon Icon={Youtube} color="hover:text-red-600" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-6">Khám Phá</h4>
            <ul className="space-y-3">
              <FooterLink label="Trò chơi giáo dục" onClick={() => onNavigate('GAMES')} />
              <FooterLink label="Kho tài liệu PDF" onClick={() => onNavigate('WORKSHEETS')} />
              <FooterLink label="Blog cha mẹ" onClick={() => onNavigate('BLOG')} />
              <FooterLink label="Hỏi đáp cộng đồng" onClick={() => onNavigate('QNA')} />
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-6">Thông Tin & Hỗ Trợ</h4>
            <ul className="space-y-3">
              <FooterLink label="Về chúng tôi" onClick={() => onNavigate('ABOUT')} />
              <FooterLink label="Điều khoản sử dụng" onClick={() => onNavigate('TERMS')} />
              <FooterLink label="Chính sách bảo mật" onClick={() => onNavigate('PRIVACY')} />
              <FooterLink label="Liên hệ quảng cáo" onClick={() => onNavigate('CONTACT')} />
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-6">Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-kid-blue mt-1" size={20} />
                <span>Tầng 12, Tòa nhà Innovation, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-kid-green" size={20} />
                <span className="font-bold">1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-kid-pink" size={20} />
                <span>hotro@askingkids.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-16 pt-8 text-center text-sm text-gray-400">
           <p className="flex items-center justify-center gap-1 mb-2">
             Made with <Heart size={14} className="text-red-500 fill-current" /> for Vietnamese Kids
           </p>
           <p>&copy; {new Date().getFullYear()} Asking Kids. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon, color }: { Icon: any, color: string }) => (
  <button className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-all transform hover:scale-110 ${color}`}>
    <Icon size={20} />
  </button>
);

const FooterLink = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <li>
    <button onClick={onClick} className="hover:text-kid-blue hover:translate-x-1 transition-all flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {label}
    </button>
  </li>
);
