
"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GameType, IWindow, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';
import { generateSpeakingWord, evaluatePronunciation } from '../services/geminiService';
import { Sparkles, Mic, Volume2, ArrowRight, CheckCircle, XCircle, RefreshCw, Search } from 'lucide-react';

// --- Sub Game Components Definitions (Placed at top or bottom) ---

const ColorGame: React.FC = () => {
  const colors = [
    { name: 'Red', hex: '#EF4444', label: 'Đỏ' },
    { name: 'Blue', hex: '#3B82F6', label: 'Xanh Dương' },
    { name: 'Green', hex: '#22C55E', label: 'Xanh Lá' },
    { name: 'Yellow', hex: '#EAB308', label: 'Vàng' },
    { name: 'Purple', hex: '#A855F7', label: 'Tím' },
    { name: 'Orange', hex: '#F97316', label: 'Cam' },
  ];

  const [target, setTarget] = useState(colors[0]);
  const [options, setOptions] = useState(colors.slice(0, 3));
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const newRound = () => {
    const shuffled = [...colors].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    const newTarget = selected[Math.floor(Math.random() * selected.length)];
    setTarget(newTarget);
    setOptions(selected);
    setMessage('');
  };

  useEffect(() => { newRound(); }, []);

  const handleGuess = (c: typeof colors[0]) => {
    if (c.name === target.name) {
      setMessage('🎉 Đúng rồi! Giỏi quá!');
      setScore(s => s + 1);
      setTimeout(newRound, 1500);
    } else {
      setMessage('😅 Sai rồi, thử lại nhé!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Màu nào là màu...</h2>
      <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-wider">{target.label}?</h1>
      <div className="flex gap-8 mb-8 justify-center flex-wrap">
        {options.map((c) => (
          <button
            key={c.name}
            onClick={() => handleGuess(c)}
            className="w-32 h-32 rounded-full shadow-lg transform hover:scale-110 transition-transform ring-4 ring-white"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
      <div className="h-12 text-2xl font-bold text-kid-blue">{message}</div>
      <div className="mt-8 text-gray-400 font-bold">Điểm: {score}</div>
    </div>
  );
};

const MathGame: React.FC = () => {
  const [problem, setProblem] = useState({ a: 1, b: 1, op: '+' });
  const [options, setOptions] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const isPlus = Math.random() > 0.5;
    const finalA = isPlus ? a : (a > b ? a : b);
    const finalB = isPlus ? b : (a > b ? b : a);
    const finalOp = isPlus ? '+' : '-';
    
    const correct = isPlus ? finalA + finalB : finalA - finalB;
    let wrong1 = correct + Math.floor(Math.random() * 3) + 1;
    let wrong2 = correct - Math.floor(Math.random() * 3) - 1;
    const opts = [correct, wrong1, wrong2].sort(() => 0.5 - Math.random());
    
    setProblem({ a: finalA, b: finalB, op: finalOp });
    setOptions(opts);
    setMessage('');
  };

  useEffect(() => { generateProblem(); }, []);

  const handleAnswer = (ans: number) => {
    const correct = problem.op === '+' ? problem.a + problem.b : problem.a - problem.b;
    if (ans === correct) {
      setMessage('🌟 Tuyệt vời!');
      setScore(s => s + 1);
      setTimeout(generateProblem, 1500);
    } else {
      setMessage('🤔 Tính lại xem nào!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-yellow-50">
      <div className="text-xl text-gray-500 font-bold mb-4">TOÁN HỌC VUI NHỘN</div>
      <div className="flex items-center gap-4 text-8xl font-black text-kid-blue mb-12 bg-white px-12 py-6 rounded-2xl shadow-sm">
        <span>{problem.a}</span>
        <span className="text-kid-pink">{problem.op}</span>
        <span>{problem.b}</span>
        <span className="text-gray-300">=</span>
        <span className="text-gray-400">?</span>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-lg">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="py-6 text-4xl font-bold bg-white text-gray-700 rounded-xl shadow-md border-b-4 border-gray-200 hover:border-kid-green hover:bg-green-50 transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="h-16 flex items-center justify-center mt-8">
        <p className="text-2xl font-bold text-kid-purple animate-bounce">{message}</p>
      </div>
      <div className="text-gray-400 font-bold">Điểm: {score}</div>
    </div>
  );
};

const SpeakingGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<{word: string, hint: string} | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'EVALUATING' | 'SUCCESS' | 'RETRY'>('IDLE');
  const [feedback, setFeedback] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { loadNewWord(); }, []);

  const loadNewWord = async () => {
    setIsLoading(true);
    setStatus('IDLE');
    setFeedback('');
    setSpokenText('');
    const data = await generateSpeakingWord();
    setCurrentWord(data);
    setIsLoading(false);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói (Chỉ hỗ trợ Chrome/Edge/Safari mới).");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setStatus('LISTENING');
    recognition.start();

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const text = event.results[event.results.length - 1][0].transcript;
      setSpokenText(text);
      setStatus('EVALUATING');
      
      if (currentWord) {
        const result = await evaluatePronunciation(currentWord.word, text);
        setFeedback(result.feedback);
        setStatus(result.isCorrect ? 'SUCCESS' : 'RETRY');
      }
    };

    recognition.onerror = () => {
      setStatus('IDLE');
      setFeedback('Không nghe rõ, bé nói lại nhé!');
    };
  };

  const playWord = () => {
    if(!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-purple-50">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-4">English Speaking</h2>
        {isLoading ? (
          <div className="animate-pulse h-16 w-48 bg-gray-200 rounded mb-4"></div>
        ) : currentWord ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-kid-purple relative">
             <button onClick={playWord} className="absolute top-2 right-2 text-gray-400 hover:text-kid-purple">
               <Volume2 size={24} />
             </button>
            <h1 className="text-6xl font-black text-gray-800 mb-2">{currentWord.word}</h1>
            <p className="text-xl text-gray-500 font-medium">({currentWord.hint})</p>
          </div>
        ) : null}
      </div>

      <div className="h-24 flex items-center justify-center w-full max-w-md mb-6">
        {status === 'LISTENING' && <div className="text-kid-pink font-bold flex flex-col items-center"><Mic className="animate-pulse w-10 h-10"/>Đang nghe...</div>}
        {status === 'EVALUATING' && <span className="text-gray-500">Đang chấm điểm...</span>}
        {(status === 'SUCCESS' || status === 'RETRY') && (
          <div className={`p-4 rounded-xl border-l-4 w-full ${status === 'SUCCESS' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
             <p className="font-bold text-lg">"{spokenText}"</p>
             <p className="text-sm text-gray-700">{feedback}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={startListening}
          disabled={status === 'LISTENING' || isLoading}
          className={`flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold text-white shadow-lg ${status === 'LISTENING' ? 'bg-gray-400' : 'bg-kid-purple hover:bg-purple-600'}`}
        >
          <Mic size={24} /> {status === 'RETRY' ? 'Thử lại' : 'Nói ngay'}
        </button>
        {(status === 'SUCCESS' || status === 'RETRY') && (
           <button onClick={loadNewWord} className="flex items-center gap-2 px-6 py-4 rounded-full text-xl font-bold bg-white text-gray-700 border-2 border-gray-200 hover:border-kid-blue">
             Từ tiếp theo <ArrowRight size={20}/>
           </button>
        )}
      </div>
    </div>
  );
};

// --- Main GameHub Component ---

interface GameHubProps {
  initialGame?: GameType;
}

export const GameHub: React.FC<GameHubProps> = ({ initialGame = GameType.NONE }) => {
  const { user } = useApp(); // Use Context
  const [activeGame, setActiveGame] = useState<GameType>(GameType.NONE);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialGame && initialGame !== GameType.NONE) {
      setActiveGame(initialGame);
    }
  }, [initialGame]);

  const games = [
    { type: GameType.COLOR, title: 'Học Màu Sắc', desc: 'Chọn đúng màu sắc theo tên gọi!', icon: '🎨', color: 'border-kid-pink', bg: 'bg-kid-pink' },
    { type: GameType.MATH, title: 'Toán Lớp 1', desc: 'Phép cộng trừ đơn giản cho bé.', icon: '🔢', color: 'border-kid-blue', bg: 'bg-kid-blue' },
    { type: GameType.SPEAKING, title: 'Luyện Phát Âm', desc: 'Bé nói tiếng Anh cùng AI nào!', icon: <Mic className="text-white w-12 h-12" />, color: 'border-kid-purple', bg: 'bg-kid-purple' }
  ];

  const filteredGames = games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (activeGame === GameType.NONE) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="max-w-md mx-auto mb-10 relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm trò chơi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-kid-blue focus:outline-none shadow-sm text-lg font-bold"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredGames.map((game, index) => (
            <div 
              key={index}
              onClick={() => setActiveGame(game.type)}
              className={`bg-white rounded-3xl shadow-xl border-b-8 ${game.color} p-8 cursor-pointer transform hover:-translate-y-2 transition-all hover:shadow-2xl flex flex-col items-center group`}
            >
              <div className={`w-24 h-24 ${game.bg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">{game.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-500 text-center">{game.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => setActiveGame(GameType.NONE)} className="mb-6 flex items-center text-gray-600 hover:text-kid-blue font-bold group">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md mr-3 group-hover:bg-kid-blue group-hover:text-white transition-colors">←</div>
        Quay lại chọn trò chơi
      </button>
      
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px] border-4 border-gray-100">
        {activeGame === GameType.COLOR && <ColorGame />}
        {activeGame === GameType.MATH && <MathGame />}
        {activeGame === GameType.SPEAKING && <SpeakingGame />}
      </div>
    </div>
  );
};
