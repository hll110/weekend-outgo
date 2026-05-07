import {
  Settings, Bell, Shield, FileText, HelpCircle,
  ChevronRight, MapPin, Heart, Compass, Award,
  Star, TrendingUp, Zap
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

const MENU_ITEMS = [
  { icon: FileText, label: '我的行程', desc: '查看已规划的出行计划', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Bell, label: '消息通知', desc: '路线更新、优惠活动', color: 'text-amber-500', bg: 'bg-amber-50', badge: '2' },
  { icon: Shield, label: '隐私设置', desc: '管理位置权限与数据', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Settings, label: '通用设置', desc: '主题、语言、缓存', color: 'text-gray-500', bg: 'bg-gray-50' },
  { icon: HelpCircle, label: '帮助反馈', desc: '常见问题与客服', color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function ProfilePage() {
  const { favorites } = useFavorites();

  const badges = [
    {
      icon: MapPin,
      label: '初次出发',
      desc: '收藏第1条',
      unlocked: favorites.length >= 1,
      color: 'from-blue-400 to-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      icon: Heart,
      label: '收藏家',
      desc: '收藏5条路线',
      unlocked: favorites.length >= 5,
      color: 'from-red-400 to-red-600',
      iconColor: 'text-red-500',
    },
    {
      icon: Compass,
      label: '探索家',
      desc: '查看10条路线',
      unlocked: true,
      color: 'from-amber-400 to-amber-600',
      iconColor: 'text-amber-500',
    },
    {
      icon: Award,
      label: '美食家',
      desc: '收藏美食路线',
      unlocked: favorites.includes('shaoxing-food') || favorites.includes('xitang-night'),
      color: 'from-orange-400 to-orange-600',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* User Card */}
      <div className="bg-white px-5 pt-8 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#FF4D00] to-[#FF8C42] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-200 w-[72px] h-[72px]">
              旅
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-gray-900">周末旅行者</h1>
            <p className="text-sm text-gray-500 mt-0.5">探索周边，发现精彩</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-500">LV.{Math.min(1 + Math.floor(favorites.length / 2), 10)} 旅行达人</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-5 -mt-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">6</span>
            <span className="text-xs text-gray-500 mt-0.5">探索路线</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{favorites.length}</span>
            <span className="text-xs text-gray-500 mt-0.5">收藏路线</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">3</span>
            <span className="text-xs text-gray-500 mt-0.5">已访城市</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">成就徽章</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      badge.unlocked
                        ? `bg-gradient-to-br ${badge.color} shadow-md`
                        : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        badge.unlocked ? 'text-white' : 'text-gray-300'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      badge.unlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{badge.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">旅行数据</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-[#FF4D00]" />
                <span className="text-2xl font-bold text-gray-900">{favorites.length * 15 + 30}km</span>
              </div>
              <span className="text-xs text-gray-500">累计探索里程</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex-1">
              <div className="flex items-baseline gap-1 mb-1">
                <Compass className="w-4 h-4 text-[#FF4D00]" />
                <span className="text-2xl font-bold text-gray-900">{favorites.length + 1}</span>
              </div>
              <span className="text-xs text-gray-500">规划行程数</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">设置与服务</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-all ${
                  index < MENU_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    {'badge' in item && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Version */}
      <div className="px-5 pt-8 pb-4 text-center">
        <p className="text-xs text-gray-300">周末短途游 v1.0.0</p>
      </div>
    </div>
  );
}
