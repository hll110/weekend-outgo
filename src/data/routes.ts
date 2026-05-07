export interface Spot {
  name: string;
  type: 'food' | 'scenic' | 'activity';
  description: string;
  mustTry?: string;
}

export interface Route {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  tags: string[];
  duration: '1日' | '2日';
  distance: string;
  budget: string;
  filters: string[];
  spots: Spot[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    items: string[];
  }[];
}

export const FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'food', label: '美食优先' },
  { id: 'hike', label: '徒步路线' },
  { id: 'scenic', label: '景区优先' },
  { id: '1day', label: '1日游' },
  { id: '2day', label: '2日游' },
] as const;

export const CITIES = [
  { name: '杭州市', lat: 30.2741, lng: 120.1551 },
  { name: '上海市', lat: 31.2304, lng: 121.4737 },
  { name: '苏州市', lat: 31.2989, lng: 120.5853 },
  { name: '南京市', lat: 32.0603, lng: 118.7969 },
  { name: '宁波市', lat: 29.8683, lng: 121.544 },
  { name: '无锡市', lat: 31.5683, lng: 120.299 },
];

export const ROUTES: Route[] = [
  {
    id: 'shaoxing-food',
    name: '绍兴鲁迅故里·寻味一日',
    subtitle: '从百草园到三味书屋，品黄酒棒冰与醉蟹',
    image: '/route-food.jpg',
    tags: ['免门票', '高铁直达', '美食密集'],
    duration: '1日',
    distance: '8km',
    budget: '人均 ¥150',
    filters: ['food', '1day'],
    spots: [
      { name: '咸亨酒店', type: 'food', description: '百年老店，孔乙己同款茴香豆', mustTry: '茴香豆、黄酒' },
      { name: '鲁迅故里', type: 'scenic', description: '从百草园到三味书屋' },
      { name: '仓桥直街', type: 'scenic', description: '江南水乡古街' },
      { name: '寻宝记', type: 'food', description: '地道绍兴菜', mustTry: '醉蟹、臭豆腐' },
      { name: '黄酒棒冰', type: 'food', description: '网红文创美食', mustTry: '黄酒棒冰' },
    ],
    highlights: ['鲁迅故里免费参观', '仓桥直街逛吃', '黄酒博物馆品鉴'],
    itinerary: [
      {
        day: 1,
        title: '鲁迅故里 → 仓桥直街 → 八字桥',
        items: [
          '09:00 抵达绍兴北站，地铁或打车至鲁迅故里',
          '10:00 参观鲁迅故居、三味书屋（免费，需预约）',
          '12:00 咸亨酒店午餐，品茴香豆、黄酒',
          '14:00 仓桥直街漫步，打卡黄酒棒冰',
          '16:00 八字桥历史街区，感受原住民生活',
          '18:00 寻宝记晚餐，尝醉蟹、臭豆腐',
        ],
      },
    ],
  },
  {
    id: 'mogan-hike',
    name: '莫干山·竹海徒步',
    subtitle: '漫步万亩竹林，呼吸负氧离子',
    image: '/route-hike.jpg',
    tags: ['避暑胜地', '天然氧吧', '轻徒步'],
    duration: '1日',
    distance: '12km',
    budget: '人均 ¥200',
    filters: ['hike', 'scenic', '1day'],
    spots: [
      { name: '剑池', type: 'scenic', description: '干将莫邪铸剑之地，飞瀑流泉' },
      { name: '芦花荡公园', type: 'scenic', description: '山顶花园，视野开阔' },
      { name: '大坑景区', type: 'scenic', description: '怪石嶙峋，云海翻涌' },
      { name: '裸心谷', type: 'food', description: '山野间的精致餐饮', mustTry: '竹林鸡汤' },
    ],
    highlights: ['万亩竹海穿行', '山顶日出云海', '民国别墅群'],
    itinerary: [
      {
        day: 1,
        title: '庾村 → 剑池 → 芦花荡 → 大坑',
        items: [
          '08:00 自驾或大巴抵达莫干山庾村',
          '09:00 从庾村出发，徒步至剑池景区',
          '11:00 参观剑池飞瀑，感受清凉',
          '12:30 山顶农家午餐，尝竹林鸡汤',
          '14:00 游览芦花荡公园，俯瞰群山',
          '16:00 大坑景区看怪石云海',
          '18:00 返回庾村，逛民国风情街',
        ],
      },
    ],
  },
  {
    id: 'xihu-scenic',
    name: '西湖·经典环湖',
    subtitle: '断桥残雪到雷峰夕照，一日看尽西湖景',
    image: '/route-scenic.jpg',
    tags: ['世界遗产', '免费', '四季皆宜'],
    duration: '1日',
    distance: '10km',
    budget: '人均 ¥100',
    filters: ['scenic', '1day'],
    spots: [
      { name: '断桥', type: 'scenic', description: '白娘子与许仙相会之地' },
      { name: '平湖秋月', type: 'scenic', description: '西湖十景之一' },
      { name: '楼外楼', type: 'food', description: '百年名店', mustTry: '西湖醋鱼、龙井虾仁' },
      { name: '雷峰塔', type: 'scenic', description: '夕照雷峰，登塔俯瞰西湖' },
      { name: '知味观', type: 'food', description: '杭帮菜老字号', mustTry: '小笼包、猫耳朵' },
    ],
    highlights: ['断桥残雪打卡', '楼外楼品西湖醋鱼', '雷峰塔看夕阳'],
    itinerary: [
      {
        day: 1,
        title: '断桥 → 白堤 → 苏堤 → 雷峰塔',
        items: [
          '08:30 抵达断桥，晨雾中的西湖最美',
          '09:30 漫步白堤，看平湖秋月',
          '11:00 浙江省博物馆（孤山馆区）',
          '12:00 楼外楼午餐，必点西湖醋鱼',
          '14:00 苏堤春晓，六桥烟柳',
          '16:00 花港观鱼，喂锦鲤',
          '17:30 雷峰塔登塔，等夕阳',
          '19:00 知味观晚餐，尝地道小吃',
        ],
      },
    ],
  },
  {
    id: 'tongli-water',
    name: '同里古镇·水乡慢生活',
    subtitle: '退思园里听昆曲，三桥上过摇橹船',
    image: '/route-food.jpg',
    tags: ['江南水乡', '非遗体验', '慢生活'],
    duration: '2日',
    distance: '15km',
    budget: '人均 ¥400',
    filters: ['scenic', 'food', '2day'],
    spots: [
      { name: '退思园', type: 'scenic', description: '世界文化遗产，晚清园林精品' },
      { name: '三桥', type: 'scenic', description: '太平、吉利、长庆三座古桥' },
      { name: '珍珠塔', type: 'scenic', description: '锡剧《珍珠塔》故事发生地' },
      { name: '酒坛子饭馆', type: 'food', description: '地道苏帮菜', mustTry: '太湖三白、状元蹄' },
      { name: '南园茶社', type: 'food', description: '百年茶社，听评弹', mustTry: '碧螺春、袜底酥' },
    ],
    highlights: ['退思园赏园林', '三桥祈福走三桥', '摇橹船听船娘唱歌'],
    itinerary: [
      {
        day: 1,
        title: '古镇漫步·园林与三桥',
        items: [
          '10:00 抵达同里，入住古镇客栈',
          '11:00 漫步明清街，感受古早味',
          '12:00 酒坛子饭馆午餐',
          '14:00 游览退思园，品园林之美',
          '16:00 走三桥（太平→吉利→长庆）',
          '18:00 古镇河边看夕阳',
          '19:30 南园茶社，听评弹品茶',
        ],
      },
      {
        day: 2,
        title: '罗星洲·摇橹船',
        items: [
          '08:00 早起看古镇晨雾',
          '09:00 乘摇橹船游古镇水道',
          '10:30 罗星洲小岛，登临远眺',
          '12:00 古镇小吃午餐',
          '14:00 珍珠塔景点参观',
          '15:00 购买芡实糕、袜底酥等伴手礼',
        ],
      },
    ],
  },
  {
    id: 'anj-forest',
    name: '安吉·竹海星空露营',
    subtitle: '卧虎藏龙取景地，竹林深处有人家',
    image: '/route-hike.jpg',
    tags: ['露营', '亲子', '避暑'],
    duration: '2日',
    distance: '120km',
    budget: '人均 ¥350',
    filters: ['hike', 'scenic', '2day'],
    spots: [
      { name: '中国大竹海', type: 'scenic', description: '《卧虎藏龙》取景地' },
      { name: '天荒坪', type: 'scenic', description: '江南天池，盘山公路绝美' },
      { name: '安吉竹博园', type: 'scenic', description: '熊猫馆看大熊猫' },
      { name: '老李家', type: 'food', description: '安吉土菜', mustTry: '竹林鸡、笋干烧肉' },
    ],
    highlights: ['大竹海玻璃栈道', '天荒坪盘山公路自驾', '竹林间露营看星空'],
    itinerary: [
      {
        day: 1,
        title: '大竹海 → 天荒坪',
        items: [
          '08:00 自驾出发，前往安吉',
          '10:30 游览中国大竹海，走玻璃栈道',
          '12:30 老李家午餐，品竹林鸡',
          '14:30 自驾天荒坪盘山公路',
          '16:00 江南天池，看高山湖泊',
          '18:00 天池边露营基地安营扎寨',
          '20:00 篝火晚会，看满天繁星',
        ],
      },
      {
        day: 2,
        title: '竹博园 → 返程',
        items: [
          '08:00 早起看日出云海',
          '09:30 收拾营地，前往竹博园',
          '11:00 竹博园看大熊猫',
          '12:30 返程，途中品尝农家菜',
        ],
      },
    ],
  },
  {
    id: 'xitang-night',
    name: '西塘·夜色与美食',
    subtitle: '廊棚下听雨，酒吧街听歌，小吃街吃到撑',
    image: '/route-food.jpg',
    tags: ['夜景', '美食', '文艺'],
    duration: '1日',
    distance: '60km',
    budget: '人均 ¥180',
    filters: ['food', '1day'],
    spots: [
      { name: '烟雨长廊', type: 'scenic', description: '千米廊棚，雨天最美' },
      { name: '送子来凤桥', type: 'scenic', description: '古桥祈福' },
      { name: '管老太臭豆腐', type: 'food', description: '西塘招牌小吃', mustTry: '臭豆腐' },
      { name: '森林芡实糕', type: 'food', description: '软糯香甜', mustTry: '芡实糕' },
      { name: '钱塘人家', type: 'food', description: '河边餐厅', mustTry: '清蒸白鱼' },
    ],
    highlights: ['烟雨长廊漫步', '管老太臭豆腐', '夜色酒吧街'],
    itinerary: [
      {
        day: 1,
        title: '西塘古镇·日游+夜游',
        items: [
          '10:00 抵达西塘，从烟雨长廊开始',
          '11:00 参观西园、种福堂',
          '12:00 钱塘人家午餐，临河而坐',
          '14:00 送子来凤桥，体验古桥文化',
          '15:00 石皮弄，西塘最窄的弄堂',
          '16:00 管老太臭豆腐，排队也要吃',
          '17:00 森林芡实糕，买手信',
          '18:00 河边晚餐，看灯笼亮起',
          '20:00 酒吧街感受西塘夜生活',
        ],
      },
    ],
  },
];
