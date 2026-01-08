
import React, { useState, useEffect, useRef } from 'react';
import { THEMES } from './constants';
import { ThemeStyle, CommentData } from './types';
import { generateComment } from './services/deepseekService';

declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [teacherName, setTeacherName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeStyle>('classic');
  const [selectedBgIndex, setSelectedBgIndex] = useState(0);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<CommentData | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  const currentBg = (selectedBgIndex === -1 && customBg)
    ? customBg
    : (currentTheme.backgroundOptions[selectedBgIndex] || currentTheme.backgroundOptions[0]);

  useEffect(() => {
    if (result) {
      setEditedContent(result.content);
      setIsEditing(false);
    }
  }, [result]);

  useEffect(() => {
    setSelectedBgIndex(0);
  }, [selectedThemeId]);

  const handleGenerate = async () => {
    if (!teacherName || !studentName) {
      setError('请输入老师和学生的姓名哦！');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await generateComment(teacherName, studentName, selectedThemeId, keywords);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('魔法施展失败，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `【${result.badgeTitle}】\n\n${editedContent}\n\n—— ${result.signOff}`;
    navigator.clipboard.writeText(text);
    alert('评语文本已复制！');
  };

  const handleExport = async () => {
    if (!cardRef.current || !window.html2canvas) return;

    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await window.html2canvas(cardRef.current, {
        useCORS: true,
        scale: 3,
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${studentName}_魔法评语卡.png`;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("导出失败，可能是图片跨域导致的，请尝试直接截图。");
    } finally {
      setExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBg(reader.result as string);
        setSelectedBgIndex(-1);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCustomBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomBg(null);
    if (selectedBgIndex === -1) {
      setSelectedBgIndex(0);
    }
  };

  return (
    <div className={`transition-all duration-700 min-h-screen ${currentTheme.bgColor} py-12 px-4`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-black mb-4 flex items-center justify-center gap-4 ${currentTheme.accentColor} drop-shadow-sm`}>
            <span>{currentTheme.icon}</span>
            梦幻评语生成器
          </h1>
          <p className="text-slate-500 font-medium">给孩子一份可以珍藏的魔法回忆</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 px-1">老师大名</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="如：麦格教授"
                    className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 px-1">学生姓名</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="如：哈利"
                    className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 px-1">表现闪光点</label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="例如：对魔法生物有爱心，魔咒课表现优异..."
                  rows={3}
                  className="w-full px-5 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-400 outline-none transition-all shadow-sm resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-400 px-1 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
                  选择世界观
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`group relative py-3 px-2 rounded-2xl border-2 transition-all overflow-hidden ${selectedThemeId === theme.id
                          ? `${theme.borderColor} ${theme.bgColor} scale-105 shadow-lg`
                          : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                        }`}
                    >
                      <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{theme.icon}</div>
                      <div className={`text-[11px] font-bold ${selectedThemeId === theme.id ? theme.accentColor : 'text-slate-500'}`}>
                        {theme.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-sm font-bold text-slate-400 px-1 flex items-center gap-2">
                  <i className="fa-solid fa-image text-rose-500"></i>
                  定制背景图
                </label>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                  <div className="relative shrink-0 group">
                    <button
                      onClick={() => customBg ? setSelectedBgIndex(-1) : fileInputRef.current?.click()}
                      className={`w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center ${selectedBgIndex === -1 && customBg
                          ? `${currentTheme.borderColor} border-4 scale-110 shadow-xl`
                          : 'border-dashed border-slate-200 hover:border-indigo-300'
                        }`}
                    >
                      {customBg ? (
                        <div className="relative w-full h-full">
                          <img src={customBg} className="w-full h-full object-cover" alt="Custom background" loading="lazy" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className="fa-solid fa-arrows-rotate text-white text-sm"></i>
                          </div>
                        </div>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus text-slate-300 text-xl"></i>
                          <span className="text-[10px] font-bold text-slate-400 mt-1">上传</span>
                        </>
                      )}
                    </button>

                    {customBg && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button
                          onClick={handleDeleteCustomBg}
                          className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <i className="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <div className="w-[1px] h-12 bg-slate-100 shrink-0 mx-1" />

                  {currentTheme.backgroundOptions.map((bg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBgIndex(idx)}
                      className={`shrink-0 w-20 h-20 rounded-2xl border-4 transition-all overflow-hidden ${selectedBgIndex === idx ? `${currentTheme.borderColor} scale-110 shadow-xl` : 'border-white opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={bg} className="w-full h-full object-cover" alt={`Option ${idx}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i>{error}</div>}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-2xl transform transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-200'
                  }`}
              >
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                {loading ? '正在感应魔法能量...' : '生成魔法评语'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 sticky top-8">
            <div
              ref={cardRef}
              className={`relative aspect-[4/5] rounded-[2.5rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-1000 ${result ? 'animate-card-entry opacity-100' : 'opacity-90'} border-[12px] ${currentTheme.borderColor}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url('${currentBg}')` }}
              />
              <div className={`absolute inset-0 ${currentTheme.cardBg} backdrop-blur-[3px] opacity-85`} />

              <div className="relative h-full p-12 flex flex-col">
                {result ? (
                  <>
                    <div className="flex items-start gap-6 mb-10">
                      <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-5xl rotate-3 shrink-0">
                        {currentTheme.icon}
                      </div>
                      <div className="pt-2">
                        <div className={`text-sm font-black uppercase tracking-widest ${currentTheme.accentColor} opacity-60 mb-1`}>Award Achievement</div>
                        <h2 className={`text-3xl font-black ${currentTheme.accentColor} leading-tight`}>{result.badgeTitle}</h2>
                      </div>
                    </div>

                    <div className="flex-grow">
                      {isEditing ? (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className={`w-full h-full p-6 rounded-3xl bg-white/50 border-4 border-dashed ${currentTheme.borderColor} focus:outline-none text-xl leading-relaxed ${currentTheme.fontClass} ${currentTheme.textColor} resize-none`}
                          autoFocus
                        />
                      ) : (
                        <div
                          className={`text-2xl leading-relaxed whitespace-pre-wrap ${currentTheme.fontClass} ${currentTheme.textColor} cursor-text hover:bg-white/40 p-4 rounded-2xl transition-all`}
                          onClick={() => setIsEditing(true)}
                        >
                          {editedContent}
                        </div>
                      )}
                    </div>

                    <div className={`mt-8 text-right`}>
                      <p className={`text-3xl font-black ${currentTheme.accentColor} ${currentTheme.fontClass}`}>
                        {result.signOff}
                      </p>
                    </div>

                    {/* Action Bar with Fixed Icons */}
                    <div className="absolute top-8 right-8 flex flex-col gap-4" data-html2canvas-ignore="true">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all ${isEditing ? 'bg-green-500 text-white' : 'bg-white text-slate-700'}`}
                      >
                        <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pen-to-square'}`}></i>
                      </button>

                      <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all bg-white text-slate-700"
                      >
                        <i className={`fa-solid ${exporting ? 'fa-spinner animate-spin' : 'fa-image'}`}></i>
                      </button>

                      <button
                        onClick={handleCopy}
                        className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all bg-white text-slate-700"
                      >
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                    <div className="text-8xl animate-pulse opacity-20">✨</div>
                    <p className="font-black text-xl tracking-[0.2em] opacity-30">等待魔法评语诞生...</p>
                  </div>
                )}
              </div>
            </div>
            {result && (
              <p className="mt-6 text-center text-slate-400 font-bold animate-bounce">
                ✨ 提示：点击文字可以直接修改哦！
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes cardEntry {
          0% { opacity: 0; transform: perspective(1000px) rotateY(15deg) translateY(50px) scale(0.95); }
          100% { opacity: 1; transform: perspective(1000px) rotateY(0deg) translateY(0) scale(1); }
        }
        .animate-card-entry {
          animation: cardEntry 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
