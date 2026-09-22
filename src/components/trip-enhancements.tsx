import { useEffect, useMemo, useState } from "react";
import { CloudSun, ExternalLink, Hotel, Search, Utensils, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function amapUrl(keyword: string, city: string) {
  const query = encodeURIComponent(`${city} ${keyword}`);
  return `https://uri.amap.com/search?keyword=${query}&city=${encodeURIComponent(city)}&view=map&src=family-roadbook`;
}

export function AmapButton({ keyword, city, label = "高德导航" }: { keyword: string; city: string; label?: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="h-9 min-w-0 px-2.5 text-xs">
      <a href={amapUrl(keyword, city)} target="_blank" rel="noopener noreferrer">
        <Search className="h-3.5 w-3.5" />{label}
      </a>
    </Button>
  );
}

type HotelDetails = { name: string; address: string; parking: string; breakfast: string; phone: string };
const emptyHotel: HotelDetails = { name: "", address: "", parking: "", breakfast: "", phone: "" };

export function HotelEditor({ day, city, recommendation, searchKeyword }: { day: number; city: string; recommendation: string; searchKeyword: string }) {
  const key = `roadbook-hotel-day-${day}-v1`;
  const [details, setDetails] = useState<HotelDetails>(emptyHotel);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setDetails({ ...emptyHotel, ...(JSON.parse(stored) as Partial<HotelDetails>) });
    } catch { window.localStorage.removeItem(key); }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(key, JSON.stringify(details));
  }, [details, key, ready]);

  const update = (field: keyof HotelDetails, value: string) => setDetails((current) => ({ ...current, [field]: value }));
  return (
    <div className="mt-4 rounded-md border border-primary/20 bg-primary-soft/50 p-3.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0"><h4 className="flex items-center gap-2 text-sm font-bold"><Hotel className="h-4 w-4 text-primary" />今晚住宿</h4><p className="mt-1 text-xs leading-5 text-muted-foreground">{recommendation}</p></div>
        <AmapButton keyword={searchKeyword} city={city} label="搜索附近酒店" />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Input aria-label={`${city}酒店名称`} value={details.name} onChange={(event) => update("name", event.target.value)} placeholder="酒店名称" />
        <Input aria-label={`${city}联系电话`} value={details.phone} onChange={(event) => update("phone", event.target.value)} placeholder="联系电话" inputMode="tel" />
        <Input aria-label={`${city}地址备注`} value={details.address} onChange={(event) => update("address", event.target.value)} placeholder="地址 / 备注" className="sm:col-span-2" />
        <Input aria-label={`${city}停车情况`} value={details.parking} onChange={(event) => update("parking", event.target.value)} placeholder="停车情况" />
        <Input aria-label={`${city}早餐情况`} value={details.breakfast} onChange={(event) => update("breakfast", event.target.value)} placeholder="早餐" />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">填写后自动保存在当前设备</p>
    </div>
  );
}

type WeatherStop = { date: string; label: string; city: string; latitude: number; longitude: number; coastal?: boolean };
const stops: WeatherStop[] = [
  { date: "2026-09-25", label: "9/25", city: "日照", latitude: 35.4164, longitude: 119.5269, coastal: true },
  { date: "2026-09-26", label: "9/26", city: "威海", latitude: 37.5131, longitude: 122.1204, coastal: true },
  { date: "2026-09-27", label: "9/27", city: "威海", latitude: 37.5131, longitude: 122.1204, coastal: true },
  { date: "2026-09-28", label: "9/28", city: "烟台", latitude: 37.4638, longitude: 121.4479, coastal: true },
  { date: "2026-09-29", label: "9/29", city: "北京", latitude: 39.9042, longitude: 116.4074 },
  { date: "2026-09-30", label: "9/30", city: "北京", latitude: 39.9042, longitude: 116.4074 },
  { date: "2026-10-01", label: "10/1", city: "北京", latitude: 39.9042, longitude: 116.4074 },
  { date: "2026-10-02", label: "10/2", city: "临沂", latitude: 35.1047, longitude: 118.3564 },
  { date: "2026-10-03", label: "10/3", city: "杭州临平", latitude: 30.4217, longitude: 120.2994 },
];

type WeatherData = { max: number; min: number; rain: number; wind: number; code: number };
const weatherText = (code: number) => code === 0 ? "晴" : code <= 3 ? "多云" : code <= 48 ? "雾" : code <= 67 ? "雨" : code <= 77 ? "雪" : code <= 82 ? "阵雨" : "雷雨";

export function WeatherStrip() {
  const [weather, setWeather] = useState<Record<string, WeatherData | null>>({});
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(stops.map(async (stop) => {
      try {
        const params = new URLSearchParams({ latitude: String(stop.latitude), longitude: String(stop.longitude), daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max", timezone: "Asia/Shanghai", start_date: stop.date, end_date: stop.date });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
        if (!response.ok) return [stop.date, null] as const;
        const json = await response.json() as { daily?: { time?: string[]; weather_code?: number[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_probability_max?: number[]; wind_speed_10m_max?: number[] } };
        if (!json.daily?.time?.includes(stop.date)) return [stop.date, null] as const;
        const index = json.daily.time.indexOf(stop.date);
        const value = { code: json.daily.weather_code?.[index] ?? 0, max: json.daily.temperature_2m_max?.[index] ?? 0, min: json.daily.temperature_2m_min?.[index] ?? 0, rain: json.daily.precipitation_probability_max?.[index] ?? 0, wind: json.daily.wind_speed_10m_max?.[index] ?? 0 };
        return [stop.date, value] as const;
      } catch { return [stop.date, null] as const; }
    })).then((entries) => setWeather(Object.fromEntries(entries))).catch(() => setWeather({}));
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="weather-heading" className="border-b border-border bg-background py-5">
      <div className="mx-auto max-w-6xl px-4 md:px-8"><div className="mb-3 flex items-center justify-between"><h2 id="weather-heading" className="flex items-center gap-2 text-sm font-bold"><CloudSun className="h-4 w-4 text-primary" />行程天气</h2><span className="text-[11px] text-muted-foreground">出发前自动更新</span></div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {stops.map((stop) => { const item = weather[stop.date]; return <Card key={stop.date} className="w-36 shrink-0 border-border/80 shadow-none"><CardContent className="p-3"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-primary">{stop.label}</span><span className="text-xs font-semibold">{stop.city}</span></div>{item ? <><p className="mt-3 text-sm font-bold">{weatherText(item.code)} · {Math.round(item.max)}°/{Math.round(item.min)}°</p><p className="mt-1 text-[11px] text-muted-foreground">降雨 {Math.round(item.rain)}% · 风 {Math.round(item.wind)} km/h</p>{stop.coastal && item.wind >= 25 ? <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-warning-foreground"><Wind className="h-3 w-3" />小心海风</p> : null}</> : <><p className="mt-3 text-xs font-semibold text-muted-foreground">暂未到预报期</p><p className="mt-1 text-[11px] text-muted-foreground">点击出发前再看</p></>}</CardContent></Card>; })}
        </div>
      </div>
    </section>
  );
}

export function DepartureCountdown() {
  const [now, setNow] = useState<number>();
  useEffect(() => { setNow(Date.now()); const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const text = useMemo(() => {
    if (!now) return "计算中…";
    const start = Date.parse("2026-09-24T21:30:00Z");
    const dayEnd = Date.parse("2026-09-25T16:00:00Z");
    if (now < start) { const hours = Math.floor((start - now) / 3600000); return `还有 ${Math.floor(hours / 24)} 天 ${hours % 24} 小时`; }
    if (now < dayEnd) return "今天出发 🚗";
    return "旅途中 · 注意休息";
  }, [now]);
  return <div className="mt-5 inline-flex items-center rounded-md border border-hero-accent/40 bg-hero-foreground/10 px-4 py-2 text-sm font-bold text-hero-accent">{text}</div>;
}

const foods: Array<[string, string, string, string]> = [
  ["日照", "海鲜、鲅鱼水饺", "第一天长途后别排队太久", "日照"],
  ["威海", "鲅鱼水饺、韩餐、海鲜", "韩乐坊可作为吃饭区域，不作为景点任务", "威海"],
  ["烟台", "海肠捞饭、焖子、鲅鱼水饺、海鲜", "优先住宿附近或芝罘区", "烟台"],
  ["北京", "炸酱面、北京烤鸭、铜锅涮肉", "带娃优先商场或酒店附近，减少排队", "北京"],
  ["临沂", "糁、临沂炒鸡", "到得晚就以酒店附近清淡为主", "临沂"],
];

export function FoodGuide() {
  return <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{foods.map(([city, food, note, mapCity]) => <Card key={city} className="border-border/80 shadow-card"><CardContent className="p-4"><div className="flex items-center gap-2"><Utensils className="h-4 w-4 text-primary" /><h3 className="font-bold">{city}</h3></div><p className="mt-3 text-sm font-semibold">{food}</p><p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">{note}</p><div className="mt-3"><AmapButton keyword={`${city} 美食`} city={mapCity} label="附近吃什么" /></div></CardContent></Card>)}</div>;
}