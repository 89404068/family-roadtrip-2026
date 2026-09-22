import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Baby,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flag,
  Hotel,
  Landmark,
  ListChecks,
  MapPin,
  Navigation,
  RotateCcw,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Type,
  TicketCheck,
  Users,
  Waves,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AmapButton, DepartureCountdown, FoodGuide, HotelEditor, WeatherStrip } from "@/components/trip-enhancements";

type TimelineItem = {
  time?: string;
  text: string;
  tone?: "must" | "optional" | "warning";
};

type Day = {
  day: number;
  date: string;
  route: string;
  summary: string;
  travel: string;
  level: "长途" | "海岸" | "北京重点" | "返程";
  items: TimelineItem[];
  stay: string;
  note?: string;
  navs: { keyword: string; city: string }[];
  hotel?: { city: string; recommendation: string; searchKeyword: string };
};

const days: Day[] = [
  {
    day: 1,
    date: "9/25 周五",
    route: "宁波 → 日照",
    summary: "首日长途 · 海边松弛收尾",
    travel: "约 750 km · 9–10h（含休息）",
    level: "长途",
    items: [
      { time: "05:30–06:00", text: "宁波出发", tone: "must" },
      { text: "长途过程中每 1.5–2 小时休息，12:00 左右午饭 + 较长休息" },
      { time: "15:30–16:30", text: "预计抵达日照" },
      { time: "16:30–18:00", text: "海龙湾 + 灯塔附近：宝宝玩沙，大人散步", tone: "must" },
      { text: "如果到得晚，海龙湾放到 9/26 早上短暂停留", tone: "optional" },
    ],
    stay: "日照｜海龙湾 / 灯塔 / 万平口南侧一带，停车方便优先",
    note: "不安排万平口、东夷小镇",
    navs: [{ keyword: "海龙湾", city: "日照" }, { keyword: "灯塔风景区", city: "日照" }],
    hotel: { city: "日照", recommendation: "海龙湾 / 灯塔 / 万平口南侧，停车方便优先", searchKeyword: "海龙湾 灯塔 万平口南侧 停车方便 酒店" },
  },
  {
    day: 2,
    date: "9/26 周六",
    route: "日照 → 那香海 → 布鲁威斯号 → 威海",
    summary: "风车海岸 · 沉船黄昏",
    travel: "约 390–430 km · 5–6h（含休息，不含游玩）",
    level: "海岸",
    items: [
      { time: "08:30", text: "日照出发" },
      { time: "13:30–14:00", text: "抵达那香海钻石沙滩" },
      { text: "游玩 1–1.5 小时：玩沙、风车、海岸拍照" },
      { time: "15:30", text: "前往布鲁威斯号，两处约 15 分钟车程" },
      { time: "15:50–17:30", text: "布鲁威斯号：重点拍照和黄昏光线", tone: "must" },
      { time: "约 19:00", text: "回威海市区入住" },
    ],
    stay: "威海｜国际海水浴场 / 高区附近，两晚不换酒店",
    navs: [{ keyword: "那香海钻石沙滩", city: "荣成" }, { keyword: "布鲁威斯号", city: "荣成" }],
    hotel: { city: "威海", recommendation: "国际海水浴场 / 高区附近，住两晚", searchKeyword: "国际海水浴场 高区 酒店" },
  },
  {
    day: 3,
    date: "9/27 周日",
    route: "威海海岸线",
    summary: "环海路观景 · 沙滩日落",
    travel: "市内短途 · 约 40–60 km",
    level: "海岸",
    items: [
      { time: "08:30", text: "酒店出发" },
      { time: "09:00–10:30", text: "猫头山 / 环海路观景", tone: "must" },
      { time: "10:30–11:10", text: "半月湾，宝宝累就删", tone: "optional" },
      { time: "11:30–15:00", text: "午饭 + 酒店午睡", tone: "must" },
      { time: "15:30–18:00", text: "国际海水浴场 + 日落", tone: "must" },
      { text: "火炬八街只作为顺路 20 分钟可选，不做硬任务", tone: "optional" },
    ],
    stay: "威海｜继续住国际海水浴场 / 高区附近",
    note: "威海公园不专门安排",
    navs: [{ keyword: "猫头山", city: "威海" }, { keyword: "半月湾", city: "威海" }, { keyword: "国际海水浴场", city: "威海" }, { keyword: "火炬八街", city: "威海" }],
    hotel: { city: "威海", recommendation: "国际海水浴场 / 高区附近，第二晚不换酒店", searchKeyword: "国际海水浴场 高区 酒店" },
  },
  {
    day: 4,
    date: "9/28 周一",
    route: "威海 → 养马岛 → 烟台",
    summary: "海岛慢游 · 老城散步",
    travel: "约 100–130 km",
    level: "海岸",
    items: [
      { time: "09:30", text: "威海退房" },
      { time: "10:30–13:00", text: "养马岛：选 2–3 个海岸停靠点，不追求全部", tone: "must" },
      { time: "13:00–15:00", text: "午饭 + 宝宝车上午睡" },
      { text: "下午到烟台入住" },
      { time: "16:00–18:30", text: "烟台山 / 朝阳街" },
    ],
    stay: "烟台｜芝罘区、烟台山附近",
    note: "不安排蓬莱阁",
    navs: [{ keyword: "养马岛", city: "烟台" }, { keyword: "烟台山", city: "烟台" }, { keyword: "朝阳街", city: "烟台" }],
    hotel: { city: "烟台", recommendation: "芝罘区 / 烟台山附近", searchKeyword: "芝罘区 烟台山附近 酒店" },
  },
  {
    day: 5,
    date: "9/29 周二",
    route: "烟台 → 北京",
    summary: "进京长途 · 车辆停酒店",
    travel: "约 730–760 km · 9.5–11h（含休息）",
    level: "长途",
    items: [
      { time: "09:00", text: "烟台出发，最晚不超过 10:00", tone: "must" },
      { text: "长途分段驾驶，宝宝每 1.5–2 小时活动一次" },
      { text: "晚间进入北京并入住" },
      { text: "北京游玩期间车尽量停酒店，市内地铁 + 打车", tone: "warning" },
    ],
    stay: "北京｜三环附近、有停车场、离地铁近",
    note: "提前办理进京通行证（六环内）；9/29 是工作日，关注早晚高峰及尾号限行",
    navs: [],
    hotel: { city: "北京", recommendation: "三环附近、有停车场、步行近地铁", searchKeyword: "三环 地铁 停车场 酒店" },
  },
  {
    day: 6,
    date: "9/30 周三",
    route: "北京 Day 1｜天安门 + 故宫",
    summary: "北京核心 · 预约优先",
    travel: "北京市内 · 以地铁 / 打车为主",
    level: "北京重点",
    items: [
      { time: "07:00–08:00", text: "早餐和前往天安门地区" },
      { text: "上午：天安门广场 → 故宫午门", tone: "must" },
      { time: "08:30–13:30", text: "故宫中轴线：太和殿 → 中和殿 → 保和殿 → 乾清宫 → 坤宁宫 → 御花园 → 神武门", tone: "must" },
      { text: "下午回酒店午休" },
      { text: "景山只作为体力特别好时可选", tone: "optional" },
    ],
    stay: "北京｜原酒店连住",
    note: "故宫提前 7 天 20:00 开票；9/30 参观重点盯 9/23 20:00。宝宝免票也要实名预约",
    navs: [{ keyword: "天安门广场", city: "北京" }, { keyword: "故宫博物院", city: "北京" }],
    hotel: { city: "北京", recommendation: "三环附近、有停车场、步行近地铁，继续连住", searchKeyword: "三环 地铁 停车场 酒店" },
  },
  {
    day: 7,
    date: "10/1 周四",
    route: "北京 Day 2｜慕田峪长城",
    summary: "国庆首日 · 尽早出发",
    travel: "往返约 140–170 km",
    level: "北京重点",
    items: [
      { time: "06:30 前后", text: "尽早出发，避开国庆首日客流", tone: "warning" },
      { text: "上午慕田峪长城", tone: "must" },
      { text: "带 1 岁半宝宝建议缆车上下，城墙只走一小段，不追求走很多敌楼" },
      { text: "长城上用背带 / 腰凳，不用推车", tone: "warning" },
      { time: "13:00–15:00", text: "返程 + 宝宝午睡" },
      { text: "傍晚鸟巢 / 水立方外观，全家累了直接取消", tone: "optional" },
    ],
    stay: "北京｜原酒店连住",
    note: "长城是明确想去的北京核心项目，优先保留长城，不硬塞颐和园",
    navs: [{ keyword: "慕田峪长城", city: "北京" }, { keyword: "鸟巢 国家体育场", city: "北京" }, { keyword: "水立方 国家游泳中心", city: "北京" }],
    hotel: { city: "北京", recommendation: "三环附近、有停车场、步行近地铁，最后一晚", searchKeyword: "三环 地铁 停车场 酒店" },
  },
  {
    day: 8,
    date: "10/2 周五",
    route: "北京 Day 3｜天坛 → 临沂",
    summary: "上午天坛 · 午后返程",
    travel: "约 630–660 km · 国庆需额外预留",
    level: "返程",
    items: [
      { time: "07:30–10:30", text: "天坛：祈年殿 → 皇穹宇 / 回音壁 → 圜丘", tone: "must" },
      { time: "10:30–12:00", text: "午饭 / 回酒店取车" },
      { time: "12:00–13:00", text: "必须离开北京，前往临沂", tone: "warning" },
      { text: "晚间入住临沂高速口附近酒店，只为过夜" },
    ],
    stay: "临沂｜高速口附近，便于次日早出发",
    note: "不要临时加颐和园，避免国庆高速返程风险",
    navs: [{ keyword: "天坛公园", city: "北京" }, { keyword: "临沂京沪高速出入口附近酒店", city: "临沂" }],
    hotel: { city: "临沂", recommendation: "G2 京沪高速出入口附近，只为过夜", searchKeyword: "G2京沪高速出入口附近酒店" },
  },
  {
    day: 9,
    date: "10/3 周六",
    route: "临沂 → 杭州临平",
    summary: "分段驾驶 · 留足缓冲",
    travel: "约 630–670 km · 国庆需额外预留",
    level: "返程",
    items: [
      { time: "06:30–07:00", text: "临沂出发", tone: "must" },
      { text: "全程分段驾驶" },
      { time: "17:00–20:00", text: "正常目标抵达杭州临平" },
      { text: "若国庆拥堵，仍预留到 10/4 凌晨的缓冲", tone: "warning" },
    ],
    stay: "终点｜杭州临平，回家",
    navs: [],
  },
];

const checklistGroups = [
  {
    title: "证件 / 预约",
    icon: TicketCheck,
    items: ["身份证", "宝宝证件", "进京证", "故宫", "慕田峪", "酒店"],
  },
  {
    title: "宝宝",
    icon: Baby,
    items: ["安全座椅", "轻便推车", "背带 / 腰凳", "奶 / 水 / 零食", "纸尿裤 / 湿巾 / 备用衣物", "防风衣"],
  },
  {
    title: "自驾",
    icon: CarFront,
    items: ["胎压 / 机油 / 玻璃水 / 雨刮 / 刹车 / 备胎", "ETC", "充电线", "手机支架", "常用药"],
  },
];

const officialLinks = [
  { label: "故宫购票", href: "https://ticket.dpm.org.cn/" },
  { label: "天安门预约", href: "https://yuyue2026.tamgw.beijing.gov.cn/web/index.html#/index" },
  { label: "慕田峪官网", href: "https://www.mutianyugreatwall.com/" },
  { label: "北京进京证指南", href: "https://www.beijing.gov.cn/fuwu/bmfw/bmzt/jjz/" },
];

const storageKey = "ningbo-beijing-roadbook-checklist-v1";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6 md:mb-8">
      <p className="mb-2 text-xs font-bold uppercase text-primary">{eyebrow}</p>
      <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p> : null}
    </div>
  );
}

function DayBadge({ level }: { level: Day["level"] }) {
  const styles = {
    长途: "bg-route-long text-route-long-foreground",
    海岸: "bg-route-coast text-route-coast-foreground",
    北京重点: "bg-route-focus text-route-focus-foreground",
    返程: "bg-route-return text-route-return-foreground",
  };
  return <Badge className={`border-0 shadow-none ${styles[level]}`}>{level}</Badge>;
}

function DayCard({ day, completed, onToggle }: { day: Day; completed: boolean; onToggle: () => void }) {
  return (
    <Card className={`overflow-hidden border-border/80 shadow-card transition-colors ${completed ? "border-primary/40 ring-1 ring-primary/15" : ""}`}>
      <div className="border-b border-border bg-card-highlight px-4 py-4 md:px-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="text-[10px] font-bold leading-none">DAY</span>
            <span className="font-display text-xl font-bold leading-none">{day.day}</span>
          </div>
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-primary">{day.date}</p>
                <DayBadge level={day.level} />
              </div>
              <Button type="button" variant={completed ? "secondary" : "outline"} size="sm" className="h-8 shrink-0 px-2 text-[11px]" onClick={onToggle} aria-pressed={completed}>
                <CheckCircle2 className="h-3.5 w-3.5" />{completed ? "已完成" : "完成今日"}
              </Button>
            </div>
            <h3 className="mt-1 font-display text-lg font-bold leading-snug text-foreground md:text-xl">{day.route}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{day.summary}</p>
            <p className="mt-2 inline-flex rounded-md bg-background/70 px-2 py-1 text-[11px] font-semibold text-primary">{day.travel}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
        <ol className="relative ml-2 border-l border-border pl-5">
          {day.items.map((item, index) => (
            <li className="relative pb-5 last:pb-1" key={`${day.day}-${index}`}>
              <span className={`absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card ${item.tone === "must" ? "bg-primary" : item.tone === "warning" ? "bg-warning" : "bg-muted-foreground"}`} />
              {item.time ? <p className="mb-1 font-mono text-xs font-semibold text-primary">{item.time}</p> : null}
              <div className="flex items-start gap-2">
                <p className="text-sm leading-6 text-foreground">{item.text}</p>
                {item.tone === "must" ? <Badge variant="outline" className="mt-0.5 shrink-0 border-primary/30 px-1.5 text-[10px] text-primary">必玩</Badge> : null}
                {item.tone === "optional" ? <Badge variant="outline" className="mt-0.5 shrink-0 px-1.5 text-[10px] text-muted-foreground">可选</Badge> : null}
              </div>
            </li>
          ))}
        </ol>
        {day.navs.length > 0 ? (
          <div className="mt-4 rounded-md border border-border bg-muted/50 p-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold"><MapPin className="h-3.5 w-3.5 text-primary" />景点一键导航</p>
            <div className="flex flex-wrap gap-2">{day.navs.map((nav) => <AmapButton key={`${nav.city}-${nav.keyword}`} keyword={nav.keyword} city={nav.city} label={`${nav.keyword} · 高德导航`} />)}</div>
          </div>
        ) : null}
        <div className="mt-4 flex items-start gap-3 rounded-md bg-muted p-3">
          <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs font-medium leading-5 text-foreground">{day.stay}</p>
        </div>
        {day.note ? (
          <div className="mt-3 flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs font-medium leading-5 text-warning-foreground">{day.note}</p>
          </div>
        ) : null}
        {day.hotel ? <HotelEditor day={day.day} city={day.hotel.city} recommendation={day.hotel.recommendation} searchKeyword={day.hotel.searchKeyword} /> : null}
      </CardContent>
    </Card>
  );
}

function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, ready]);

  const total = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
  const completed = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div>
      <div className="mb-5 rounded-md border border-primary/20 bg-primary-soft p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">准备进度</p>
            <p className="mt-0.5 text-xs text-muted-foreground">已完成 {completed} / {total} 项</p>
          </div>
          <span className="font-display text-2xl font-bold text-primary">{percent}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {checklistGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.title} className="border-border/80 shadow-card">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="h-4 w-4" /></div>
                  <h3 className="font-bold text-foreground">{group.title}</h3>
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const id = `${group.title}-${item}`;
                    return (
                      <label key={id} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted">
                        <Checkbox id={id} checked={Boolean(checked[id])} onCheckedChange={(value) => setChecked((current) => ({ ...current, [id]: value === true }))} className="h-5 w-5" />
                        <span className={`text-sm leading-5 ${checked[id] ? "text-muted-foreground line-through" : "text-foreground"}`}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-5 flex justify-center">
        <Button type="button" variant="outline" onClick={() => setChecked({})}><RotateCcw />清空勾选</Button>
      </div>
    </div>
  );
}

export function TripRoadbook() {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [largeType, setLargeType] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  useEffect(() => {
    try {
      const progress = window.localStorage.getItem("roadbook-day-progress-v1");
      if (progress) setCompletedDays(JSON.parse(progress) as Record<number, boolean>);
      setLargeType(window.localStorage.getItem("roadbook-large-type-v1") === "true");
    } catch {
      window.localStorage.removeItem("roadbook-day-progress-v1");
      window.localStorage.removeItem("roadbook-large-type-v1");
    }
    setSettingsReady(true);
  }, []);
  useEffect(() => {
    if (!settingsReady) return;
    window.localStorage.setItem("roadbook-day-progress-v1", JSON.stringify(completedDays));
    window.localStorage.setItem("roadbook-large-type-v1", String(largeType));
  }, [completedDays, largeType, settingsReady]);
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const resetProgress = () => {
    if (window.confirm("确定重置全部 9 天的完成状态吗？")) setCompletedDays({});
  };
  const navItems = [
    ["总览", "overview"], ["每日行程", "days"], ["北京重点", "beijing"], ["吃什么", "food"], ["准备清单", "checklist"], ["注意事项", "notices"], ["备选", "backup"],
  ];

  return (
    <main className={`min-h-screen bg-background text-foreground ${largeType ? "large-type" : ""}`}>
      <header className="hero-grid relative overflow-hidden bg-hero text-hero-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
          <div className="mb-12 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:mb-20">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Navigation className="h-4 w-4" />
              <span>FAMILY ROADBOOK · 2026</span>
            </div>
            <Button type="button" variant="outline" size="sm" className="border-hero-foreground/30 bg-hero-foreground/10 text-hero-foreground hover:bg-hero-foreground/20 hover:text-hero-foreground" onClick={() => setLargeType((value) => !value)} aria-pressed={largeType}>
              <Type className="h-4 w-4" />{largeType ? "标准" : "大字"}
            </Button>
          </div>
          <div className="max-w-4xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-hero-muted"><Waves className="h-4 w-4" /> 山海之间，一家人的九日旅程</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-hero-foreground md:text-6xl">2026 宁波→山东→北京→杭州临平</h1>
            <p className="mt-3 font-display text-2xl font-bold text-hero-accent md:text-4xl">家庭自驾路书</p>
            <DepartureCountdown />
            <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <div className="flex items-center gap-2 rounded-md border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-2 text-xs"><CalendarDays className="h-4 w-4 text-hero-accent" />9/25—10/3</div>
              <div className="flex items-center gap-2 rounded-md border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-2 text-xs"><Users className="h-4 w-4 text-hero-accent" />4 位成人 + 1 位宝宝</div>
              <div className="flex items-center gap-2 rounded-md border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-2 text-xs"><Clock3 className="h-4 w-4 text-hero-accent" />9 天 8 晚</div>
              <div className="flex items-center gap-2 rounded-md border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-2 text-xs"><CarFront className="h-4 w-4 text-hero-accent" />家庭自驾</div>
            </div>
          </div>
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-2 text-xs font-semibold text-hero-muted">
              {["宁波", "日照", "威海 / 荣成", "烟台", "北京", "临沂", "杭州临平"].map((place, index, array) => (
                <div className="flex items-center gap-2" key={place}>
                  <span className={index === 0 || index === array.length - 1 ? "text-hero-accent" : ""}>{place}</span>
                  {index < array.length - 1 ? <ChevronRight className="h-3.5 w-3.5 opacity-50" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="页面导航" className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-nav backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 no-scrollbar md:justify-center md:px-8">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">{label}</a>)}
        </div>
      </nav>

      <WeatherStrip />

      <section id="overview" className="scroll-mt-16 border-b border-border bg-section py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="ROUTE OVERVIEW" title="九天行程总览" description="先看节奏，再看细节。海岸线安排放松，北京段保留核心项目，返程预留国庆拥堵缓冲。" />
          <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="rounded-md border border-primary/20 bg-primary-soft p-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><ListChecks className="h-5 w-5 text-primary" /><div className="min-w-0"><p className="text-sm font-bold">行程进度 {completedCount}/9</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${completedCount / 9 * 100}%` }} /></div></div>{completedCount > 0 ? <Button type="button" variant="ghost" size="sm" className="px-2 text-xs" onClick={resetProgress}><RotateCcw />重置</Button> : null}</div>
            </div>
            <div className="flex items-center rounded-md border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><CarFront className="mr-2 h-4 w-4 shrink-0 text-primary" />预计里程仅供规划，实际以当天导航和路况为准</div>
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-card">
            <div className="hidden grid-cols-[0.7fr_1.5fr_2fr_1.4fr] gap-4 border-b border-border bg-muted px-5 py-3 text-xs font-bold text-muted-foreground md:grid">
              <span>日期</span><span>路线</span><span>核心安排</span><span>住宿</span>
            </div>
            {days.map((day) => (
              <div key={day.day} className="grid gap-2 border-b border-border px-4 py-4 last:border-0 md:grid-cols-[0.7fr_1.5fr_2fr_1.4fr] md:items-center md:gap-4 md:px-5">
                <div className="flex items-center justify-between md:block"><span className="font-mono text-xs font-bold text-primary">D{day.day} · {day.date.split(" ")[0]}</span><DayBadge level={day.level} /></div>
                <p className="text-sm font-bold text-foreground">{day.route}</p>
                <p className="text-xs leading-5 text-muted-foreground">{day.travel}</p>
                <p className="flex items-start gap-1.5 text-xs leading-5 text-muted-foreground"><Hotel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{day.stay.split("｜")[1] ?? day.stay}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="days" className="scroll-mt-16 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="DAY BY DAY" title="每日详细行程" description="必玩项目优先，宝宝午睡和长途休息是固定节奏；可选项随体力和天气灵活删减。" />
          <div className="grid items-start gap-5 lg:grid-cols-2">
            {days.map((day) => <DayCard day={day} completed={Boolean(completedDays[day.day])} onToggle={() => setCompletedDays((current) => ({ ...current, [day.day]: !current[day.day] }))} key={day.day} />)}
          </div>
        </div>
      </section>

      <section id="beijing" className="scroll-mt-16 border-y border-border bg-beijing py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="BEIJING FOCUS" title="北京重点" description="三天只守住四个核心项目。预约、早出发和体力分配，比多去一个景点更重要。" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "天安门", "广场至故宫午门顺线衔接，提前完成实名预约。"],
              ["02", "故宫", "中轴线为主，9/23 20:00 重点抢 9/30 门票。"],
              ["03", "慕田峪长城", "缆车上下，只走一小段；宝宝用背带或腰凳。"],
              ["04", "天坛", "祈年殿至圜丘，10:30 后收尾取车离京。"],
            ].map(([number, title, text]) => (
              <Card key={title} className="border-border/80 bg-card shadow-card">
                <CardContent className="p-5">
                  <div className="mb-7 flex items-center justify-between"><span className="font-mono text-xs font-bold text-primary">{number}</span><Landmark className="h-5 w-5 text-primary" /></div>
                  <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-md border border-warning/30 bg-warning-soft p-5">
              <div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-warning" /><div><h3 className="font-bold text-warning-foreground">为什么颐和园改为备选？</h3><p className="mt-2 text-sm leading-6 text-warning-foreground/80">长城是全家明确想去的北京核心项目；9/30 故宫、10/1 长城、10/2 天坛后离京，已经构成稳妥节奏。只有北京多出半天且全家体力充足时再考虑颐和园，不占用国庆返程缓冲。</p></div></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {officialLinks.map((link) => <Button asChild variant="outline" className="h-auto min-h-12 justify-between whitespace-normal px-3 text-left" key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><ExternalLink className="shrink-0" /></a></Button>)}
            </div>
          </div>
        </div>
      </section>

      <section id="food" className="scroll-mt-16 border-b border-border bg-section py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="LOCAL FOOD" title="沿途吃什么" description="按城市和区域找当地主食，不绑定具体店名，优先离酒店近、少排队、方便带宝宝。" />
          <FoodGuide />
          <div className="mt-5 flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft p-4"><Baby className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><p className="text-sm leading-6 text-warning-foreground">宝宝只吃以前确认不过敏且彻底熟透的食物，不在旅行中首次大量尝试贝类、生腌等食物。</p></div>
        </div>
      </section>

      <section id="checklist" className="scroll-mt-16 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="READY TO GO" title="出发准备清单" description="勾选结果会自动保存在当前手机或浏览器，下次打开仍可继续。" />
          <Checklist />
        </div>
      </section>

      <section id="notices" className="scroll-mt-16 border-y border-border bg-section py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="TRAVEL NOTES" title="注意事项" />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [CarFront, "北京外地车", "提前办理进京通行证（六环内）。9/29 为工作日，核对早晚高峰和尾号限行；到京后车尽量停酒店。"],
              [RouteIcon, "国庆交通", "10/1 起客流和车流明显增加。10/2 中午必须离开北京，10/3 返程保留至 10/4 凌晨的缓冲。"],
              [Baby, "宝宝午睡优先", "午饭后尽量安排酒店或车上午睡。宝宝疲劳时，先删除半月湾、火炬八街、鸟巢等可选项。"],
              [Waves, "山东海边天气", "海边风大且天气变化快，准备防风衣；遇降雨或大风，缩短海岸停留，不赶拍照点。"],
              [ShieldCheck, "宝宝饮食", "海鲜只吃以前吃过且彻底熟透的品种，不在旅途中尝试新的高致敏食物。"],
            ].map(([Icon, title, text]) => {
              const NoteIcon = Icon as typeof CarFront;
              return <div key={title as string} className="flex items-start gap-4 rounded-md border border-border bg-card p-4 shadow-card"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary"><NoteIcon className="h-4 w-4" /></div><div><h3 className="font-bold text-foreground">{title as string}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text as string}</p></div></div>;
            })}
          </div>

          <div className="mt-10 rounded-md border border-primary/20 bg-card p-5 shadow-card md:p-6">
            <div className="mb-5 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-xs font-bold text-primary">T−24 HOURS</p><h3 className="font-display text-xl font-bold">临行前 24 小时检查</h3></div></div>
            <div className="grid gap-3 md:grid-cols-2">
              {["宁波→日照、日照→威海拥堵", "山东沿海降雨 / 大风", "猫头山交通管控", "故宫 / 慕田峪 / 天坛预约与开放公告", "北京进京证与 9/29 限行"].map((item) => <div key={item} className="flex items-center gap-3 rounded-md bg-muted px-3 py-3 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="backup" className="scroll-mt-16 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeading eyebrow="PLAN B" title="备选方案" description="不追求打卡数量，用这些规则快速做取舍。" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["威海有时间", "先加半月湾，再有时间才考虑威海公园。"],
              ["北京多出半天", "全家体力和交通条件都允许时，再安排颐和园。"],
              ["9/26 到荣成太晚", "布鲁威斯号优先于那香海，守住黄昏光线。"],
              ["下雨 / 大风", "缩短海边停留；长城行程按官方公告调整。"],
            ].map(([title, text], index) => <div key={title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-md border border-border bg-card p-4 shadow-card"><span className="font-mono text-sm font-bold text-primary">0{index + 1}</span><div className="min-w-0"><h3 className="font-bold text-foreground">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-footer py-10 text-footer-foreground">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
          <Flag className="mx-auto h-5 w-5 text-footer-accent" />
          <p className="mt-3 font-display text-lg font-bold">一路平安，慢慢看风景</p>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-footer-muted">开放时间、预约方式和交通管控可能变化，以出发前官方最新公告为准</p>
          <p className="mt-6 font-mono text-[10px] text-footer-muted">NINGBO · SHANDONG · BEIJING · HANGZHOU  /  2026</p>
        </div>
      </footer>
    </main>
  );
}