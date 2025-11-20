import { Bell, CheckCircle, Clock, DollarSign, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ today: 0, total: 0, count: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNotification, setLastNotification] = useState(null);
  const [audioLocked, setAudioLocked] = useState(true);

  const audioContextRef = useRef(null);
  const vietnameseVoiceRef = useRef(null);

  // Khởi tạo Web Speech API
  useEffect(() => {
    if ('speechSynthesis' in window) {
      console.log('Text-to-Speech ready!');
    }
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      console.log('Speech synthesis is supported');
      const handleVoicesChanged = () => {
        const voices = window.speechSynthesis.getVoices();
        const vietnameseVoice = voices.find(voice => voice.lang.startsWith('vi')) || null;
        vietnameseVoiceRef.current = vietnameseVoice;
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      if (window.speechSynthesis.getVoices().length !== 0) {
        handleVoicesChanged();
      }
    }
  }, []);

  // Khởi tạo AudioContext và kiểm tra trạng thái khóa
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    if (audioContextRef.current.state === "running") {
      setAudioLocked(false);
    } else {
      setAudioLocked(true);
    }

    const checkState = () => {
      if (audioContextRef.current.state === "running") {
        setAudioLocked(false);
      }
    };

    audioContextRef.current.onstatechange = checkState;
  }, []);

  const unlockAudio = async () => {
    try {
      await audioContextRef.current.resume();
      setAudioLocked(false);
    } catch (e) {
      console.log("Unlock audio failed", e);
    }
  };

  // Simulate PayOS webhook data
  useEffect(() => {
    const demoInterval = setInterval(() => {
      const demoPayment = {
        id: Date.now(),
        amount: Math.floor(Math.random() * 800000) + 20000,
        description: `Đơn hàng #${Math.floor(Math.random() * 9999)}`,
        status: 'PAID',
        createdAt: new Date().toISOString(),
        customerName: 'Khách hàng'
      };
      handleNewPayment(demoPayment);
    }, 15000);

    return () => clearInterval(demoInterval);
  }, []);

  // Xử lý payment mới
  const handleNewPayment = (payment) => {
    setPayments(prev => [payment, ...prev].slice(0, 50));

    const today = new Date().toLocaleDateString('vi-VN');
    const paymentDate = new Date(payment.createdAt).toLocaleDateString('vi-VN');
    const isToday = today === paymentDate;

    setStats(prev => ({
      today: isToday ? prev.today + payment.amount : prev.today,
      total: prev.total + payment.amount,
      count: prev.count + 1
    }));

    setLastNotification(payment);
    setTimeout(() => setLastNotification(null), 6000);

    if (soundEnabled) {
      playNotificationSound(payment.amount);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💰 Nhận tiền mới!', {
        body: `${formatMoney(payment.amount)}đ – ${payment.description}`,
        icon: '💰',
      });
    }
  };

  const playNotificationSound = (amount) => {
    const moneyText = formatMoneyForSpeech(amount);
    const text = `Bạn đã nhận được ${moneyText} đồng`;
    playVietnameseTTS(text);
  };

  const playVietnameseTTS = (text) => {
    console.log('%cPlaying TTS: %c' + text, 'color: gray; font-weight: normal;', 'color: #00ee00; font-weight: bold;');

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (vietnameseVoiceRef.current) {
        utterance.voice = vietnameseVoiceRef.current;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      playBeep();
      window.speechSynthesis.speak(utterance);
    } else {
      playBeep();
    }
  };

  const playBeep = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(1000, ctx.currentTime);
    o.type = 'sine';
    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.2);
  };

  // Format tiền
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount);

  const formatMoneyForSpeech = (amount) => {
    if (amount >= 1000000) {
      const m = Math.floor(amount / 1000000);
      const rest = amount % 1000000;
      return rest ? `${numberToVietnamese(m)} triệu ${numberToVietnamese(rest)}` : `${numberToVietnamese(m)} triệu`;
    }
    if (amount >= 1000) {
      const k = Math.floor(amount / 1000);
      const rest = amount % 1000;
      return rest ? `${numberToVietnamese(k)} nghìn ${numberToVietnamese(rest)}` : `${numberToVietnamese(k)} nghìn`;
    }
    return numberToVietnamese(amount);
  };

  const numberToVietnamese = (num) => {
    if (num === 0) return 'không';
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const teens = ['mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];

    const readThree = (n) => {
      const h = Math.floor(n / 100);
      const t = Math.floor((n % 100) / 10);
      const u = n % 10;
      let str = '';

      if (h > 0) str += units[h] + ' trăm ';
      if (t === 1) str += teens[u];
      else if (t > 1) str += units[t] + ' mươi ' + (u === 1 ? 'mốt' : u === 5 ? 'lăm' : units[u]);
      else if (t === 0 && u > 0) str += (h > 0 ? 'lẻ ' : '') + (u === 1 ? 'mốt' : u === 5 ? 'lăm' : units[u]);
      else if (h > 0 && t === 0 && u === 0) str = str.trim();

      return str.trim();
    };

    let str = '';
    const mil = Math.floor(num / 1000000);
    const tho = Math.floor((num % 1000000) / 1000);
    const hun = num % 1000;

    if (mil) str += readThree(mil) + ' triệu ';
    if (tho) str += readThree(tho) + ' nghìn ';
    if (hun) str += readThree(hun);

    return str.trim() || 'không';
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const testSound = () => {
    if (audioLocked) return;
    playNotificationSound(123456);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Background gradient decoration */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-600/10" />
        </div>

        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  💰 Lụm Lúa Pro
                </h1>
                <span className="text-sm text-gray-500">@tuanlee.tech</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={testSound}
                  disabled={audioLocked}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔊 Test âm thanh
                </button>

                <button
                  onClick={() => audioLocked ? unlockAudio() : setSoundEnabled(!soundEnabled)}
                  className={`p-3 rounded-xl transition-all ${audioLocked
                    ? 'bg-gray-200 text-gray-500'
                    : soundEnabled
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {audioLocked ? <VolumeX size={24} /> : soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Stats Cards – Modern Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Hôm nay</p>
                  <p className="text-4xl font-bold mt-2">{formatMoney(stats.today)}₫</p>
                </div>
                <DollarSign size={48} className="opacity-90" />
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-20">
                <div className="w-40 h-40 bg-white rounded-full" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Tổng thu nhập</p>
                  <p className="text-4xl font-bold mt-2">{formatMoney(stats.total)}₫</p>
                </div>
                <CheckCircle size={48} className="opacity-90" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Số giao dịch</p>
                  <p className="text-4xl font-bold mt-2">{stats.count}</p>
                </div>
                <Bell size={48} className="opacity-90" />
              </div>
            </div>
          </div>

          {/* Floating Notification */}
          {lastNotification && (
            <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-500">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-96 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl text-white">
                    <DollarSign size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">💰 Nhận tiền mới!</h3>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                      {formatMoney(lastNotification.amount)}₫
                    </p>
                    <p className="text-gray-600 mt-2">{lastNotification.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(lastNotification.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction List */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Clock className="text-emerald-600" size={28} />
                Lịch sử giao dịch
              </h2>
            </div>

            <div className="max-h-screen overflow-y-auto">
              {payments.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Bell size={64} className="mx-auto mb-4 opacity-40" />
                  <p className="text-lg">Chưa có giao dịch nào</p>
                  <p className="text-sm mt-2">Hệ thống sẽ tự động thêm giao dịch demo mỗi 15 giây</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-6 hover:bg-gray-50/70 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-emerald-100 rounded-2xl">
                            <CheckCircle className="text-emerald-600" size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                Thành công
                              </span>
                              <span>{new Date(p.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                            <p className="text-lg font-medium text-gray-800 mt-1">{p.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-3xl font-bold text-emerald-600">
                            +{formatMoney(p.amount)}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PaymentDashboard;