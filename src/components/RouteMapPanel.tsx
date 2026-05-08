import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { Clock3, MapPin, Navigation } from 'lucide-react';
import { ROUTE_GEOMETRY } from '@/data/routeGeometry';
import type { Route } from '@/data/routes';
import { getCityCoordinates, getDistanceKm, type Coordinates } from '@/utils/geo';

interface RouteMapPanelProps {
  selectedCity: string;
  userLocation: Coordinates | null;
  routes: Route[];
  isLocating: boolean;
  onSelectRoute: (route: Route) => void;
}

const ROUTE_COLORS = ['#f54e00', '#cf2d56', '#c08532', '#9fbbe0', '#9fc9a2'];

function MapViewSync({ center }: { center: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

export default function RouteMapPanel({
  selectedCity,
  userLocation,
  routes,
  isLocating,
  onSelectRoute,
}: RouteMapPanelProps) {
  const cityCenter = getCityCoordinates(selectedCity) ?? { lat: 30.2741, lng: 120.1551 };
  const anchorPoint = userLocation ?? cityCenter;

  const recommendedRoutes = useMemo(() => {
    return routes
      .map((route) => {
        const geometry = ROUTE_GEOMETRY.find((item) => item.routeId === route.id);
        if (!geometry) {
          return null;
        }

        return {
          route,
          geometry,
          distanceKm: getDistanceKm(anchorPoint, geometry.center),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 4);
  }, [anchorPoint, routes]);

  if (recommendedRoutes.length === 0) {
    return null;
  }

  return (
    <section className="mx-4 mt-5 rounded-2xl border border-[rgba(38,37,30,0.1)] bg-[#e6e5e0] p-3 shadow-[rgba(0,0,0,0.08)_0px_14px_30px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg leading-tight text-[#26251e]">离你最近的游玩路线</h2>
          <p className="mt-1 text-xs text-[rgba(38,37,30,0.6)]">
            当前位置：{selectedCity}
            {userLocation ? ' · 已定位' : ' · 使用城市中心估算'}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#ebeae5] px-3 py-1 text-xs text-[rgba(38,37,30,0.72)]">
          <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-pulse text-[#cf2d56]' : 'text-[#f54e00]'}`} />
          {isLocating ? '定位中' : '路线推荐'}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[rgba(38,37,30,0.12)]">
        <MapContainer
          center={[anchorPoint.lat, anchorPoint.lng]}
          zoom={9}
          scrollWheelZoom={false}
          className="h-[290px] w-full"
        >
          <MapViewSync center={anchorPoint} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={[anchorPoint.lat, anchorPoint.lng]}
            radius={8}
            pathOptions={{ color: '#26251e', fillColor: '#26251e', fillOpacity: 0.8, weight: 2 }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
              你当前所在附近
            </Tooltip>
          </CircleMarker>

          {recommendedRoutes.map(({ route, geometry }, index) => (
            <Polyline
              key={route.id}
              pathOptions={{
                color: ROUTE_COLORS[index % ROUTE_COLORS.length],
                weight: 5,
                opacity: 0.85,
              }}
              positions={geometry.path.map((point) => [point.lat, point.lng] as [number, number])}
              eventHandlers={{
                click: () => onSelectRoute(route),
              }}
            >
              <Tooltip sticky>{route.name}</Tooltip>
            </Polyline>
          ))}
        </MapContainer>
      </div>

      <div className="mt-3 space-y-2">
        {recommendedRoutes.map(({ route, distanceKm }, index) => (
          <button
            type="button"
            key={route.id}
            onClick={() => onSelectRoute(route)}
            className="flex w-full items-center justify-between rounded-xl border border-[rgba(38,37,30,0.1)] bg-[#f2f1ed] px-3 py-2 text-left transition-colors hover:bg-[#ebeae5]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#26251e]">{route.name}</p>
              <p className="mt-0.5 truncate text-xs text-[rgba(38,37,30,0.6)]">{route.subtitle}</p>
            </div>
            <div className="ml-3 shrink-0 text-right">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                style={{ backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }}
              >
                TOP {index + 1}
              </span>
              <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[rgba(38,37,30,0.65)]">
                <MapPin className="h-3 w-3" />
                约 {Math.round(distanceKm)}km
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1 text-[11px] text-[rgba(38,37,30,0.5)]">
        <Clock3 className="h-3.5 w-3.5" />
        点击地图折线或路线卡片即可查看完整行程详情
      </div>
    </section>
  );
}
