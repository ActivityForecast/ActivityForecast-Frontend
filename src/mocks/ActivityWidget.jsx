// src/components/ActivityWidget.jsx
import React, { useMemo } from "react";

export default function ActivityWidget({
  accent = "#22C55E", // 크루 색상 (자동 전달됨)
  total = 4,           // 총 횟수
  segments = [
    { label: "축구", count: 2 },
    { label: "러닝", count: 1 },
    { label: "농구", count: 1 },
  ],
  withBorder = true,
  gapClass = "gap-44",
}) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const innerRadius = 28;
  const outerRadius = 56;
  const gapDeg = 1.5;

  // ✅ 조각 정보 계산
  const { totalCount, segs } = useMemo(() => {
    const totalCount = segments.reduce((a, b) => a + (b.count || 0), 0) || 1;
    let start = -90;
    const segs = segments.map((d) => {
      const sweep = (d.count / totalCount) * 360;
      const s = start + gapDeg / 2;
      const e = start + sweep - gapDeg / 2;
      start += sweep;
      return { ...d, start: s, end: e, mid: (s + e) / 2 };
    });
    return { totalCount, segs };
  }, [segments, gapDeg]);


  const arcPath = (r1, r2, a0, a1) => {
    const A0 = (Math.PI / 180) * a0;
    const A1 = (Math.PI / 180) * a1;
    const x0 = cx + r2 * Math.cos(A0);
    const y0 = cy + r2 * Math.sin(A0);
    const x1 = cx + r2 * Math.cos(A1);
    const y1 = cy + r2 * Math.sin(A1);
    const x2 = cx + r1 * Math.cos(A1);
    const y2 = cy + r1 * Math.sin(A1);
    const x3 = cx + r1 * Math.cos(A0);
    const y3 = cy + r1 * Math.sin(A0);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `
      M ${x0} ${y0}
      A ${r2} ${r2} 0 ${large} 1 ${x1} ${y1}
      L ${x2} ${y2}
      A ${r1} ${r1} 0 ${large} 0 ${x3} ${y3}
      Z
    `;
  };

  const leader = (angleDeg) => {
    const rad = (Math.PI / 180) * angleDeg;
    const r = outerRadius + 4;
    const x0 = cx + r * Math.cos(rad);
    const y0 = cy + r * Math.sin(rad);
    const x1 = cx + (r + 8) * Math.cos(rad);
    const y1 = cy + (r + 8) * Math.sin(rad);
    const isRight = Math.cos(rad) >= 0;
    let x2 = x1 + (isRight ? 8 : -8);
    const y2 = y1;
    // clamp to keep label inside svg bounds
    const margin = 6;
    const minX = margin;
    const maxX = size - margin;
    x2 = Math.max(minX, Math.min(maxX, x2));
    return { x0, y0, x1, y1, x2, y2, isRight };
  };

  const summary = useMemo(() => {
    return segments
      .map(
        (s) =>
          `${s.label} ${s.count}회 (${Math.round(
            (s.count / totalCount) * 100
          )}%)`
      )
      .join(", ");
  }, [segments, totalCount]);

  return (
    <div
      className={`rounded-2xl bg-white p-4 sm:p-5 ${withBorder ? "border" : ""}`}
      style={withBorder ? { borderColor: accent, borderWidth: 1, borderOpacity: 0.3 } : undefined}
    >
      {/* 타이틀 */}
      <div className="text-center text-lg font-semibold mb-3">활동 횟수</div>

      <div className={`grid grid-cols-[auto_auto] items-center justify-center ${gapClass}`}>
        {/* 왼쪽 큰 숫자 */}
        <div className="flex items-center gap-1">
          <span className="text-6xl font-extrabold" style={{ color: accent }}>
            {total}
          </span>
          <span className="text-2xl font-extrabold text-black relative top-3 leading-none">회</span>
        </div>

        {/* 오른쪽 도넛 그래프 */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {segs.map((s, i) => (
            <path
              key={i}
              d={arcPath(innerRadius, outerRadius, s.start, s.end)}
              fill={accent}
              opacity={0.95}
            />
          ))}

          {/* 중앙 구멍 */}
          <circle cx={cx} cy={cy} r={innerRadius} fill="#fff" />

          {/* ✅ 보조선 + 숫자도 크루 색상으로 통일 */}
          {segs.map((s, i) => {
            const { x0, y0, x1, y1, x2, y2, isRight } = leader(s.mid);
            const labelText = `${s.label ?? ''} ${s.count}회`;
            return (
              <g key={`lbl-${i}`}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={accent} strokeWidth="1.5" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1.5" />
                <text
                  x={x2 + (isRight ? 6 : -6)}
                  y={y2 - 2}
                  textAnchor={isRight ? "start" : "end"}
                  fontSize="11"
                  fontWeight="600"
                  fill={accent}
                >
                  {labelText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 하단 요약 */}
      <div className="mt-3 text-sm text-gray-500 text-center">{summary}</div>
    </div>
  );
}
