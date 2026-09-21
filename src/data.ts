export type Tone = "must" | "optional" | "warning" | "";
export type TimelineItem = [string, string, Tone?];
export type NavPoint = [string, string];

export type HotelPlan = {
  city: string;
  recommendation: string;
  searchKeyword: string;
};

export type Day = {
  day: number;
  date: string;
  route: string;
  summary: string;
  travel: string;
  stay: string;
  items: TimelineItem[];
  note?: string;
  navs: NavPoint[];
  hotel?: HotelPlan;
};

export type WeatherStop = {
  date: string;
  label: string;
  city: string;
  lat: number;
  lon: number;
  coastal?: boolean;
};

export const DAYS: Day[] = [
  {day:1,date:"9/25 周五",route:"宁波 → 日照",summary:"海龙湾 / 灯塔，第一天只放松",travel:"约 750 km · 9–10h（含休息）",stay:"日照｜海龙湾 / 灯塔 / 万平口南侧，停车方便优先",items:[["05:30–06:00","宁波出发","must"],["","每 1.5–2 小时服务区休息；12:00 左右午饭 + 较长休息"],["15:30–16:30","预计抵达日照"],["16:30–18:00","海龙湾 + 灯塔附近：宝宝玩沙，大人散步","must"],["","如果到得晚，海龙湾放到 9/26 早上短暂停留","optional"]],note:"不安排万平口、东夷小镇",navs:[["海龙湾","日照"],["灯塔风景区","日照"]],hotel:{city:"日照",recommendation:"海龙湾 / 灯塔 / 万平口南侧，停车方便优先",searchKeyword:"海龙湾 灯塔 万平口南侧 停车方便 酒店"}},
  {day:2,date:"9/26 周六",route:"日照 → 那香海 → 布鲁威斯号 → 威海",summary:"风车海岸 + 沉船黄昏",travel:"约 390–430 km · 5–6h（含休息，不含游玩）",stay:"威海｜国际海水浴场 / 高区附近，两晚不换",items:[["08:30","日照出发"],["13:30–14:00","那香海钻石沙滩","must"],["","玩 1–1.5 小时：玩沙、风车、海岸拍照"],["15:30","前往布鲁威斯号，两处约 15 分钟"],["15:50–17:30","布鲁威斯号：重点拍照和黄昏光线","must"],["约 19:00","威海酒店入住"]],navs:[["那香海钻石沙滩","荣成"],["布鲁威斯号","荣成"]],hotel:{city:"威海",recommendation:"国际海水浴场 / 高区附近，住两晚",searchKeyword:"国际海水浴场 高区 酒店"}},
  {day:3,date:"9/27 周日",route:"威海海岸线",summary:"猫头山 + 国际海水浴场日落",travel:"市内短途 · 约 40–60 km",stay:"威海｜继续住国际海水浴场 / 高区",items:[["08:30","酒店出发"],["09:00–10:30","猫头山 / 环海路观景","must"],["10:30–11:10","半月湾，宝宝累就删","optional"],["11:30–15:00","午饭 + 酒店午睡","must"],["15:30–18:00","国际海水浴场 + 日落","must"],["","火炬八街仅顺路 20 分钟可选","optional"]],note:"威海公园不专门安排",navs:[["猫头山","威海"],["半月湾","威海"],["国际海水浴场","威海"],["火炬八街","威海"]],hotel:{city:"威海",recommendation:"国际海水浴场 / 高区附近，第二晚不换",searchKeyword:"国际海水浴场 高区 酒店"}},
  {day:4,date:"9/28 周一",route:"威海 → 养马岛 → 烟台",summary:"养马岛 + 烟台山 / 朝阳街",travel:"约 100–130 km",stay:"烟台｜芝罘区 / 烟台山附近",items:[["09:30","威海退房"],["10:30–13:00","养马岛：选 2–3 个海岸停靠点，不追求全部","must"],["13:00–15:00","午饭 + 宝宝车上午睡"],["下午","烟台入住"],["16:00–18:30","烟台山 / 朝阳街"]],note:"不安排蓬莱阁",navs:[["养马岛","烟台"],["烟台山","烟台"],["朝阳街","烟台"]],hotel:{city:"烟台",recommendation:"芝罘区 / 烟台山附近",searchKeyword:"芝罘区 烟台山附近 酒店"}},
  {day:5,date:"9/29 周二",route:"烟台 → 北京",summary:"长途进京，晚间入住",travel:"约 730–760 km · 9.5–11h（含休息）",stay:"北京｜三环附近、有停车场、近地铁",items:[["09:00 左右","烟台出发，最晚 10:00","must"],["","分段驾驶，宝宝每 1.5–2 小时活动一次"],["晚间","进入北京并入住"],["","北京期间车尽量停酒店，市内地铁 + 打车","warning"]],note:"提前办进京通行证（六环内）；9/29 工作日，出发前核对高峰与尾号限行",navs:[],hotel:{city:"北京",recommendation:"三环附近、有停车场、步行近地铁",searchKeyword:"三环 地铁 停车场 酒店"}},
  {day:6,date:"9/30 周三",route:"北京 Day 1｜天安门 + 故宫",summary:"北京核心①",travel:"北京市内 · 地铁 / 打车为主",stay:"北京｜原酒店连住",items:[["07:00–08:00","早餐 + 前往天安门地区"],["上午","天安门广场 → 故宫午门","must"],["08:30–13:30","故宫中轴线：太和殿 → 中和殿 → 保和殿 → 乾清宫 → 坤宁宫 → 御花园 → 神武门","must"],["下午","回酒店午休"],["","景山仅体力特别好时可选","optional"]],note:"故宫按现行规则提前 7 天 20:00 开票；9/30 参观重点盯 9/23 20:00，宝宝免票也要实名预约",navs:[["天安门广场","北京"],["故宫博物院","北京"]],hotel:{city:"北京",recommendation:"三环附近、有停车场、步行近地铁，继续连住",searchKeyword:"三环 地铁 停车场 酒店"}},
  {day:7,date:"10/1 周四",route:"北京 Day 2｜慕田峪长城",summary:"北京核心②",travel:"往返约 140–170 km",stay:"北京｜原酒店连住",items:[["06:30 前后","尽早出发，国庆首日客流大","warning"],["上午","慕田峪长城","must"],["","建议缆车上下，城墙只走一小段，不追求敌楼数量"],["","宝宝用背带 / 腰凳，不用推车","warning"],["13:00–15:00","返程 + 宝宝午睡"],["傍晚","鸟巢 / 水立方外观可选，累了直接取消","optional"]],note:"长城是明确想去的核心项目，因此优先长城，不硬塞颐和园",navs:[["慕田峪长城","北京"],["鸟巢 国家体育场","北京"],["水立方 国家游泳中心","北京"]],hotel:{city:"北京",recommendation:"三环附近、有停车场、步行近地铁，最后一晚",searchKeyword:"三环 地铁 停车场 酒店"}},
  {day:8,date:"10/2 周五",route:"北京 Day 3｜天坛 → 临沂",summary:"北京核心③ + 开始返程",travel:"约 630–660 km · 国庆需额外预留",stay:"临沂｜G2 京沪高速出入口附近",items:[["07:30–10:30","天坛：祈年殿 → 皇穹宇 / 回音壁 → 圜丘","must"],["10:30–12:00","午饭 / 回酒店取车"],["12:00–13:00","必须离开北京，前往临沂","warning"],["晚间","临沂高速口附近酒店，只为过夜"]],note:"不要临时加颐和园，避免国庆高速返程风险",navs:[["天坛公园","北京"],["临沂京沪高速出入口附近酒店","临沂"]],hotel:{city:"临沂",recommendation:"G2 京沪高速出入口附近，只为过夜",searchKeyword:"G2京沪高速出入口附近酒店"}},
  {day:9,date:"10/3 周六",route:"临沂 → 杭州临平",summary:"返程缓冲日",travel:"约 630–670 km · 国庆需额外预留",stay:"终点｜杭州临平，到家",items:[["06:30–07:00","临沂出发","must"],["","全程分段驾驶"],["17:00–20:00","正常目标抵达临平"],["","若明显拥堵，仍预留到 10/4 凌晨的缓冲","warning"]],navs:[]}
];

export const WEATHER_STOPS: WeatherStop[] = [
  {date:"2026-09-25",label:"9/25",city:"日照",lat:35.4164,lon:119.5269,coastal:true},
  {date:"2026-09-26",label:"9/26",city:"威海",lat:37.5131,lon:122.1204,coastal:true},
  {date:"2026-09-27",label:"9/27",city:"威海",lat:37.5131,lon:122.1204,coastal:true},
  {date:"2026-09-28",label:"9/28",city:"烟台",lat:37.4638,lon:121.4479,coastal:true},
  {date:"2026-09-29",label:"9/29",city:"北京",lat:39.9042,lon:116.4074},
  {date:"2026-09-30",label:"9/30",city:"北京",lat:39.9042,lon:116.4074},
  {date:"2026-10-01",label:"10/1",city:"北京",lat:39.9042,lon:116.4074},
  {date:"2026-10-02",label:"10/2",city:"临沂",lat:35.1047,lon:118.3564},
  {date:"2026-10-03",label:"10/3",city:"临平",lat:30.4217,lon:120.2994}
];

export const FOODS = [
  ["日照","海鲜、鲅鱼水饺","第一天长途后别排队太久","日照"],
  ["威海","鲅鱼水饺、韩餐、海鲜","韩乐坊可作为吃饭区域，不作为景点任务","威海"],
  ["烟台","海肠捞饭、焖子、鲅鱼水饺、海鲜","优先芝罘区或酒店附近","烟台"],
  ["北京","炸酱面、北京烤鸭、铜锅涮肉","带娃优先商场 / 酒店附近，减少排队","北京"],
  ["临沂","糁、临沂炒鸡","到得晚就以酒店附近清淡为主","临沂"]
] as const;

export const CHECKS = [
  ["证件 / 预约",["身份证","宝宝证件","进京证","故宫预约","慕田峪门票 / 缆车","全部酒店确认"]],
  ["宝宝",["安全座椅","轻便推车","背带 / 腰凳","奶 / 水 / 零食","纸尿裤 / 湿巾 / 备用衣物","防风衣"]],
  ["自驾",["胎压 / 机油 / 玻璃水 / 雨刮 / 刹车 / 备胎","ETC","充电线","手机支架","常用药 / 体温计","垃圾袋 / 纸巾"]]
] as const;

export const OFFICIAL_LINKS = [
  ["故宫购票","https://ticket.dpm.org.cn/"],
  ["天安门预约","https://yuyue2026.tamgw.beijing.gov.cn/web/index.html#/index"],
  ["慕田峪官网","https://www.mutianyugreatwall.com/"],
  ["进京证指南","https://www.beijing.gov.cn/fuwu/bmfw/bmzt/jjz/"]
] as const;
