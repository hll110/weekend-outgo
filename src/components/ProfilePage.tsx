import { useEffect, useMemo, useState } from 'react';
import {
  Settings, Bell, Shield, FileText, HelpCircle, ChevronRight, MapPin, Heart, Compass, Award, Star, TrendingUp,
  Zap, History, Trash2, Clock3, Edit3, Save
} from 'lucide-react';
import { ROUTES } from '@/data/routes';
import type { Route } from '@/data/routes';
import { useFavorites } from '@/hooks/useFavorites';
import { useRouteHistory } from '@/hooks/useRouteHistory';
import { useUserProfile } from '@/hooks/useUserProfile';
import { isSupabaseConfigured } from '@/lib/supabase';
import RouteDetail from './RouteDetail';

const MENU_ITEMS = [
  { icon: FileText, label: '我的行程', desc: '查看已规划的出行计划', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Bell, label: '消息通知', desc: '路线更新、优惠活动', color: 'text-amber-500', bg: 'bg-amber-50', badge: '2' },
  { icon: Shield, label: '隐私设置', desc: '管理位置权限与数据', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Settings, label: '通用设置', desc: '主题、语言、缓存', color: 'text-gray-500', bg: 'bg-gray-50' },
  { icon: HelpCircle, label: '帮助反馈', desc: '常见问题与客服', color: 'text-purple-500', bg: 'bg-purple-50' },
];

interface ProfilePageProps {
  onOpenRoute: (routeId: string) => void;
}

export default function ProfilePage({ onOpenRoute }: ProfilePageProps) {
  const { favorites, toggle } = useFavorites();
  const { history, loaded, clearHistory } = useRouteHistory();
  const { profile, saving, updateProfile } = useUserProfile();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState(profile);

  useEffect(() => {
    setDraftProfile(profile);
  }, [profile]);

  const historyRoutes = useMemo(
    () =>
      history
        .map((entry) => ({
          entry,
          route: ROUTES.find((item) => item.id === entry.routeId),
        }))
        .filter((item): item is { entry: (typeof history)[number]; route: Route } => Boolean(item.route)),
    [history]
  );

  const recentHistory = historyRoutes.slice(0, 5);

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
      unlocked: history.length >= 10,
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-bold text-gray-900">{profile.nickname}</h1>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {isSupabaseConfigured ? '云端同步已开启' : '本地模式（未配置 Supabase）'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-600 transition-colors hover:bg-gray-200"
              >
                <Edit3 className="w-3 h-3" />
                {isEditingProfile ? '收起' : '编辑资料'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{profile.bio}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-500">LV.{Math.min(1 + Math.floor(favorites.length / 2), 10)} 旅行达人</span>
            </div>
          </div>
        </div>

        {isEditingProfile && (
          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <label className="mb-2 block text-xs font-medium text-gray-500">昵称</label>
            <input
              value={draftProfile.nickname}
              onChange={(e) =>
                setDraftProfile((prev) => ({
                  ...prev,
                  nickname: e.target.value,
                }))
              }
              placeholder="请输入昵称"
              className="mb-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#FF4D00] focus:outline-none"
            />
            <label className="mb-2 block text-xs font-medium text-gray-500">个人简介</label>
            <textarea
              value={draftProfile.bio}
              onChange={(e) =>
                setDraftProfile((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              placeholder="说一句你的旅行宣言"
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#FF4D00] focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftProfile(profile);
                  setIsEditingProfile(false);
                }}
                className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={async () => {
                  const safeProfile = {
                    nickname: draftProfile.nickname.trim() || '周末旅行者',
                    bio: draftProfile.bio.trim() || '探索周边，发现精彩',
                  };
                  await updateProfile(safeProfile);
                  setIsEditingProfile(false);
                }}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full bg-[#FF4D00] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#E04400] disabled:opacity-60"
              >
                <Save className="w-3 h-3" />
                {saving ? '保存中...' : '保存资料'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="mx-5 -mt-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{history.length}</span>
            <span className="text-xs text-gray-500 mt-0.5">探索路线</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{favorites.length}</span>
            <span className="text-xs text-gray-500 mt-0.5">收藏路线</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{new Set(history.map((item) => item.city)).size}</span>
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
                <span className="text-2xl font-bold text-gray-900">{history.length || 1}</span>
              </div>
              <span className="text-xs text-gray-500">规划行程数</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route History */}
      <div className="px-5 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">最近游玩路线</h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:bg-gray-200"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!loaded ? (
            <div className="px-4 py-6 text-xs text-gray-400">加载历史中...</div>
          ) : recentHistory.length > 0 ? (
            recentHistory.map(({ route, entry }, index) => (
              <button
                type="button"
                key={`${route.id}-${entry.viewedAt}`}
                onClick={() => {
                  onOpenRoute(route.id);
                  setSelectedRoute(route);
                }}
                className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                  index < recentHistory.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{route.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 text-[#FF4D00]" />
                      {entry.city}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock3 className="w-3 h-3" />
                  {new Date(entry.viewedAt).toLocaleString('zh-CN', { hour12: false })}
                </p>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <History className="mx-auto mb-2 h-6 w-6 text-gray-300" />
              <p className="text-sm text-gray-500">还没有历史路线记录</p>
              <p className="mt-1 text-xs text-gray-400">去首页点击任意路线，即可自动记录</p>
            </div>
          )}
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

      {selectedRoute && (
        <RouteDetail
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
          isFavorited={favorites.includes(selectedRoute.id)}
          onToggleFavorite={toggle}
        />
      )}
    </div>
  );
}
