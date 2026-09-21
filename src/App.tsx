import { useEffect, useMemo, useState } from "react";
import { CHECKS, DAYS, FOODS, OFFICIAL_LINKS, WEATHER_STOPS } from "./data";
import type { Day, HotelPlan } from "./data";

type HotelDetails = {
  name: string;
  phone: string;
  address: string;
  parking: string;
  breakfast: string;
};

type WeatherData = {
  code: number;
  max: number;
  min: number;
  rain: number;
  wind: number;
};

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function amapUrl(keyword: string, city: string) {
  return "https://uri.amap.com/search?keyword=" +
    encodeURIComponent(city + " " + keyword) +
    "&city=" + encodeURIComponent(city) +
    "&view=map&src=family-roadtrip";
}

function AmapButton(props: { keyword: string; city: string; label?: string }) {
  return (
    <a className="btn" href={amapUrl(props.keyword, props.city)} target="_blank" rel="noopener noreferrer">
      {props.label || props.keyword + " · 高德导航"} ↗
    </a>
  );
}

function weatherText(code: number) {
  if (code === 0) return "晴";
  if (code <= 3) return "多云";
  if (code <= 48) return "雾";
  if (code <= 67) return "雨";
  if (code <= 77) return "雪";
  if (code <= 82) return "阵雨";
  return "雷雨";
}

function WeatherStrip() {
  const [data, setData] = useState<Record<string, WeatherData | null>>({});

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      WEATHER_STOPS.map(async (stop) => {
        try {
          const params = new URLSearchParams({
            latitude: String(stop.lat),
            longitude: String(stop.lon),
            daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
            timezone: "Asia/Shanghai",
            start_date: stop.date,
            end_date: stop.date,
          });

          const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?" + params.toString(),
            { signal: controller.signal },
          );

          if (!response.ok) return [stop.date, null] as const;

          const json = await response.json() as {
            daily?: {
              time?: string[];
              weather_code?: number[];
              temperature_2m_max?: number[];
              temperature_2m_min?: number[];
              precipitation_probability_max?: number[];
              wind_speed_10m_max?: number[];
            };
          };

          const index = json.daily?.time?.indexOf(stop.date) ?? -1;
          if (index < 0) return [stop.date, null] as const;

          const item: WeatherData = {
            code: json.daily?.weather_code?.[index] ?? 0,
            max: json.daily?.temperature_2m_max?.[index] ?? 0,
            min: json.daily?.temperature_2m_min?.[index] ?? 0,
            rain: json.daily?.precipitation_probability_max?.[index] ?? 0,
            wind: json.daily?.wind_speed_10m_max?.[index] ?? 0,
          };

          return [stop.date, item] as const;
        } catch {
          return [stop.date, null] as const;
        }
      }),
    )
      .then((entries) => setData(Object.fromEntries(entries)))
      .catch(() => setData({}));

    return () => controller.abort();
  }, []);

  return (
    <section id="weather">
      <h2 className="section-title">🌤️ 行程天气</h2>
      <p className="section-desc">无需定位，按行程城市自动获取天气；出发前再刷新一次最准确。</p>
      <div className="weather-row">
        {WEATHER_STOPS.map((stop) => {
          const item = data[stop.date];
          return (
            <div className="weather-card" key={stop.date}>
              <div className="weather-top">
                <span>{stop.label}</span>
                <span>{stop.city}</span>
              </div>
              {item ? (
                <>
                  <div className="weather-main">
                    {weatherText(item.code)} · {Math.round(item.max)}°/{Math.round(item.min)}°
                  </div>
                  <div className="weather-meta">
                    降雨 {Math.round(item.rain)}% · 风 {Math.round(item.wind)} km/h
                  </div>
                  {stop.coastal && item.wind >= 25 ? (
                    <div className="windwarn">🌬️ 小心海风</div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="weather-main weather-empty">暂未到预报期</div>
                  <div className="weather-meta">出发前再刷新查看</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const text = useMemo(() => {
    const start = new Date("2026-09-25T05:30:00+08:00").getTime();
    const dayStart = new Date("2026-09-25T00:00:00+08:00").getTime();
    const dayEnd = new Date("2026-09-26T00:00:00+08:00").getTime();

    if (now < dayStart) {
      const hours = Math.max(0, Math.floor((start - now) / 3_600_000));
      return "距离出发还有 " + Math.floor(hours / 24) + " 天 " + (hours % 24) + " 小时";
    }
    if (now < dayEnd) return "今天出发 🚗";
    return "旅途中 · 注意休息";
  }, [now]);

  return <div className="countdown">{text}</div>;
}

function HotelEditor(props: { day: number; hotel: HotelPlan }) {
  const empty: HotelDetails = {
    name: "",
    phone: "",
    address: "",
    parking: "",
    breakfast: "",
  };

  const [details, setDetails] = useStoredState<HotelDetails>(
    "roadtrip-hotel-day-" + props.day + "-v3",
    empty,
  );

  const update = (field: keyof HotelDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="hotelbox">
      <div className="hotel-actions">
        <div>
          <div className="box-title">🏨 今晚住宿</div>
          <div className="small">{props.hotel.recommendation}</div>
        </div>
        <AmapButton keyword={props.hotel.searchKeyword} city={props.hotel.city} label="搜索附近酒店" />
      </div>

      <div className="hotel-grid">
        <input value={details.name} onChange={(e) => update("name", e.target.value)} placeholder="酒店名称" />
        <input value={details.phone} onChange={(e) => update("phone", e.target.value)} placeholder="联系电话" inputMode="tel" />
        <input className="span2" value={details.address} onChange={(e) => update("address", e.target.value)} placeholder="地址 / 备注" />
        <input value={details.parking} onChange={(e) => update("parking", e.target.value)} placeholder="停车情况" />
        <input value={details.breakfast} onChange={(e) => update("breakfast", e.target.value)} placeholder="早餐" />
      </div>

      <div className="small saved-tip">填写后自动保存在当前手机浏览器</div>
    </div>
  );
}

function DayCard(props: { day: Day; done: boolean; toggle: () => void }) {
  const day = props.day;

  return (
    <article className={"card day-card " + (props.done ? "done" : "")}>
      <div className="day-head">
        <div className="day-num">
          <small>DAY</small>
          <strong>{day.day}</strong>
        </div>

        <div className="day-main">
          <div className="day-title-row">
            <div>
              <div className="day-date">{day.date}</div>
              <div className="day-route">{day.route}</div>
              <div className="day-summary">{day.summary}</div>
              <span className="travel-chip">{day.travel}</span>
            </div>
            <button className="done-btn" type="button" onClick={props.toggle}>
              {props.done ? "✓ 已完成" : "完成今日"}
            </button>
          </div>
        </div>
      </div>

      <div className="day-body">
        <ul className="timeline">
          {day.items.map(([time, text, tone], index) => (
            <li className={"tl " + (tone || "")} key={index}>
              {time ? <div className="tl-time">{time}</div> : null}
              <div className="tl-text">
                {text}
                {tone === "must" ? <span className="pill">必玩</span> : null}
                {tone === "optional" ? <span className="pill opt">可选</span> : null}
                {tone === "warning" ? <span className="pill warn">提醒</span> : null}
              </div>
            </li>
          ))}
        </ul>

        {day.navs.length ? (
          <div className="navbox">
            <div className="box-title">📍 景点一键导航</div>
            <div className="btnrow">
              {day.navs.map(([keyword, city]) => (
                <AmapButton key={city + keyword} keyword={keyword} city={city} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="navbox">
          <div className="box-title">🛏️ 住宿建议</div>
          <div className="small">{day.stay}</div>
        </div>

        {day.note ? <div className="notebox">⚠️ {day.note}</div> : null}
        {day.hotel ? <HotelEditor day={day.day} hotel={day.hotel} /> : null}
      </div>
    </article>
  );
}

function Checklist() {
  const [checked, setChecked] = useStoredState<Record<string, boolean>>(
    "roadtrip-checklist-v4",
    {},
  );

  const total = CHECKS.reduce((sum, group) => sum + group[1].length, 0);
  const completed = Object.values(checked).filter(Boolean).length;

  return (
    <div className="card">
      <h2 className="section-title">✅ 出发准备清单</h2>

      <div className="progress-wrap">
        <div>
          <b>准备进度 {completed}/{total}</b>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: String((completed / total) * 100) + "%" }}
            />
          </div>
        </div>
        <button className="btn subtle" type="button" onClick={() => setChecked({})}>
          清空勾选
        </button>
      </div>

      <div className="check-grid">
        {CHECKS.map(([title, items]) => (
          <div className="check-group" key={title}>
            <h3>{title}</h3>
            {items.map((item) => {
              const key = title + "-" + item;
              return (
                <label className="check-item" key={item}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[key])}
                    onChange={(e) =>
                      setChecked((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [completedDays, setCompletedDays] = useStoredState<Record<number, boolean>>(
    "roadtrip-day-progress-v3",
    {},
  );
  const [largeType, setLargeType] = useStoredState<boolean>(
    "roadtrip-large-type-v3",
    false,
  );

  const completedCount = Object.values(completedDays).filter(Boolean).length;

  const resetProgress = () => {
    if (window.confirm("确定重置全部 9 天的完成状态吗？")) {
      setCompletedDays({});
    }
  };

  return (
    <div className={"app " + (largeType ? "large-type" : "")}>
      <header>
        <div className="wrap">
          <div className="hero-tools">
            <div className="eyebrow">FAMILY ROADBOOK · 2026</div>
            <button className="ghost" type="button" onClick={() => setLargeType((v) => !v)}>
              {largeType ? "标准" : "大字"}
            </button>
          </div>

          <div className="eyebrow">9/25 — 10/3 · 4位成人 + 1位1岁半宝宝</div>
          <h1 className="hero-title">宁波 → 山东 → 北京 → 杭州临平</h1>
          <div className="hero-sub">
            海岸线慢慢玩，北京保留天安门、故宫、慕田峪长城和天坛；10月2日中午开始南下，给国庆返程留足缓冲。
          </div>
          <Countdown />

          <div className="stats">
            <div className="stat"><b>9天8晚</b><span>9/25 出发</span></div>
            <div className="stat"><b>4 + 1</b><span>四大一小</span></div>
            <div className="stat"><b>威海2晚</b><span>山海自驾为主</span></div>
            <div className="stat"><b>北京3晚</b><span>故宫 + 长城</span></div>
          </div>
        </div>
      </header>

      <nav>
        <a href="#weather">天气</a>
        <a href="#overview">总览</a>
        <a href="#days">每日行程</a>
        <a href="#beijing">北京重点</a>
        <a href="#food">吃什么</a>
        <a href="#checklist">准备清单</a>
        <a href="#notices">注意事项</a>
        <a href="#backup">备选</a>
      </nav>

      <main>
        <WeatherStrip />

        <section id="overview" className="card">
          <h2 className="section-title">🚗 九天总览</h2>

          <div className="progress-wrap">
            <div>
              <b>行程进度 {completedCount}/9</b>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: String((completedCount / 9) * 100) + "%" }}
                />
              </div>
            </div>
            {completedCount ? (
              <button className="btn subtle" type="button" onClick={resetProgress}>
                重置进度
              </button>
            ) : <span />}
          </div>

          <p className="small">预计里程仅用于规划，实际以当天高德导航与实时路况为准。</p>

          <div className="table-wrap">
            <table className="overview">
              <thead>
                <tr><th>日期</th><th>路线</th><th>核心安排</th><th>住宿</th></tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day.day}>
                    <td><b>{day.date.split(" ")[0]}</b></td>
                    <td><b>{day.route}</b><div className="small">{day.travel}</div></td>
                    <td>{day.summary}</td>
                    <td>{day.stay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="days">
          <h2 className="section-title">📅 每日详细行程</h2>
          <p className="section-desc">必玩优先；宝宝午睡、长途休息优先级高于普通打卡。</p>

          <div className="day-grid">
            {DAYS.map((day) => (
              <DayCard
                key={day.day}
                day={day}
                done={Boolean(completedDays[day.day])}
                toggle={() =>
                  setCompletedDays((prev) => ({
                    ...prev,
                    [day.day]: !prev[day.day],
                  }))
                }
              />
            ))}
          </div>
        </section>

        <section id="beijing" className="card">
          <h2 className="section-title">🏯 北京重点</h2>
          <p className="section-desc">第一次北京，三天守住四个核心项目，不追求景点数量。</p>

          <div className="grid2">
            <div className="notice"><h3>① 天安门</h3><p>9/30 上午，与故宫顺线衔接。核心区不建议自驾。</p></div>
            <div className="notice"><h3>② 故宫</h3><p>9/30 中轴线为主。按现行规则提前7天20:00开票，重点盯9/23 20:00；宝宝免票也要实名预约。</p></div>
            <div className="notice"><h3>③ 慕田峪长城</h3><p>10/1 尽早出发。带宝宝建议缆车上下，城墙只走一小段，用背带/腰凳。</p></div>
            <div className="notice"><h3>④ 天坛</h3><p>10/2 早上祈年殿 → 皇穹宇 / 回音壁 → 圜丘，10:30左右收尾，午饭后离京。</p></div>
          </div>

          <div className="notebox">
            <b>为什么颐和园改成备选？</b><br />
            长城是你们明确想去的核心项目。9/30故宫、10/1长城、10/2天坛后离京已经比较饱满；只有真的多出半天且不影响10/2中午离京，才补颐和园。
          </div>

          <div className="official">
            {OFFICIAL_LINKS.map(([label, url]) => (
              <a className="btn" key={url} target="_blank" rel="noopener noreferrer" href={url}>
                {label} ↗
              </a>
            ))}
          </div>
        </section>

        <section id="food">
          <h2 className="section-title">🥟 沿途吃什么</h2>
          <p className="section-desc">不绑定具体餐厅，避免攻略过时；优先酒店附近、少排队、方便带娃。</p>

          <div className="food-grid">
            {FOODS.map(([city, food, note, mapCity]) => (
              <div className="food-card" key={city}>
                <h3>{city}</h3>
                <b>{food}</b>
                <p>{note}</p>
                <AmapButton keyword={city + " 美食"} city={mapCity} label="附近吃什么" />
              </div>
            ))}
          </div>

          <div className="notebox">
            <b>宝宝饮食：</b>
            只吃以前确认不过敏且彻底熟透的食物，不在旅行中第一次大量尝试贝类、生腌等。
          </div>
        </section>

        <section id="checklist">
          <Checklist />
        </section>

        <section id="notices">
          <h2 className="section-title">⚠️ 注意事项</h2>

          <div className="notice-grid">
            <div className="notice"><h3>北京外地车</h3><p>提前办进京通行证（六环内）。9/29是工作日，出发前核对早晚高峰、尾号限行和核心区禁行规则。到北京后车尽量停酒店。</p></div>
            <div className="notice"><h3>国庆交通</h3><p>10/1起北京景区和高速客流会明显增加。10/2 12:00–13:00必须离京，10/3保留到10/4凌晨的缓冲。</p></div>
            <div className="notice"><h3>宝宝午睡</h3><p>午饭后尽量安排酒店或车上午睡；宝宝累时，先删半月湾、火炬八街、鸟巢等可选项。</p></div>
            <div className="notice"><h3>山东海风</h3><p>9月底海边早晚风明显，准备宝宝防风层；遇大风或降雨时缩短海岸停留，不为打卡硬撑。</p></div>
          </div>

          <div className="card t24">
            <div className="box-title">T−24 HOURS｜临行前24小时检查</div>
            <div className="grid2 small">
              <div>✓ 宁波→日照、日照→威海拥堵</div>
              <div>✓ 山东沿海降雨 / 大风</div>
              <div>✓ 猫头山环海路交通管控</div>
              <div>✓ 故宫 / 慕田峪 / 天坛开放与预约</div>
              <div>✓ 进京证与9/29限行</div>
            </div>
          </div>
        </section>

        <section id="backup" className="card">
          <h2 className="section-title">🔁 备选方案</h2>

          <div className="grid2">
            <div className="notice"><h3>威海有时间</h3><p>先加半月湾，再有时间才考虑威海公园。</p></div>
            <div className="notice"><h3>北京多出半天</h3><p>首选颐和园，但绝不能挤占10/2中午离京这个底线。</p></div>
            <div className="notice"><h3>9/26到荣成太晚</h3><p>优先布鲁威斯号黄昏，再考虑那香海。</p></div>
            <div className="notice"><h3>下雨 / 大风</h3><p>海边行程主动缩短；长城遇恶劣天气按官方公告调整。</p></div>
          </div>
        </section>

        <div className="footer">
          开放时间、预约方式和交通管控可能变化，以出发前官方最新公告为准。<br />
          2026 Family Road Trip · Ningbo · Shandong · Beijing · Hangzhou
        </div>
      </main>
    </div>
  );
}
