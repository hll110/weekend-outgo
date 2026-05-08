import type { Coordinates } from '@/utils/geo';

export interface RouteGeometry {
  routeId: string;
  city: string;
  center: Coordinates;
  path: Coordinates[];
}

export const ROUTE_GEOMETRY: RouteGeometry[] = [
  {
    routeId: 'shaoxing-food',
    city: '绍兴市',
    center: { lat: 30.002, lng: 120.579 },
    path: [
      { lat: 30.006, lng: 120.579 },
      { lat: 30.001, lng: 120.571 },
      { lat: 29.998, lng: 120.575 },
      { lat: 30.004, lng: 120.587 },
      { lat: 30.001, lng: 120.595 },
    ],
  },
  {
    routeId: 'mogan-hike',
    city: '湖州市',
    center: { lat: 30.604, lng: 119.877 },
    path: [
      { lat: 30.55, lng: 119.86 },
      { lat: 30.596, lng: 119.882 },
      { lat: 30.608, lng: 119.895 },
      { lat: 30.621, lng: 119.874 },
      { lat: 30.633, lng: 119.901 },
    ],
  },
  {
    routeId: 'xihu-scenic',
    city: '杭州市',
    center: { lat: 30.247, lng: 120.149 },
    path: [
      { lat: 30.259, lng: 120.145 },
      { lat: 30.255, lng: 120.137 },
      { lat: 30.246, lng: 120.127 },
      { lat: 30.237, lng: 120.136 },
      { lat: 30.229, lng: 120.148 },
      { lat: 30.244, lng: 120.164 },
      { lat: 30.257, lng: 120.156 },
    ],
  },
  {
    routeId: 'tongli-water',
    city: '苏州市',
    center: { lat: 31.159, lng: 120.718 },
    path: [
      { lat: 31.16, lng: 120.71 },
      { lat: 31.164, lng: 120.715 },
      { lat: 31.161, lng: 120.724 },
      { lat: 31.155, lng: 120.726 },
      { lat: 31.151, lng: 120.718 },
    ],
  },
  {
    routeId: 'anj-forest',
    city: '湖州市',
    center: { lat: 30.678, lng: 119.699 },
    path: [
      { lat: 30.636, lng: 119.664 },
      { lat: 30.661, lng: 119.691 },
      { lat: 30.686, lng: 119.719 },
      { lat: 30.704, lng: 119.744 },
      { lat: 30.689, lng: 119.706 },
    ],
  },
  {
    routeId: 'xitang-night',
    city: '嘉兴市',
    center: { lat: 30.944, lng: 120.892 },
    path: [
      { lat: 30.951, lng: 120.888 },
      { lat: 30.946, lng: 120.881 },
      { lat: 30.939, lng: 120.885 },
      { lat: 30.935, lng: 120.894 },
      { lat: 30.941, lng: 120.903 },
    ],
  },
];
