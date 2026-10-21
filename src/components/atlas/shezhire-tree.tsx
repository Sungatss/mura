"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { shezhireZhuzes } from "@/data/shezhire";
import { ui } from "@/data/ui-translations";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  selectedZhuzId: string | null;
  selectedRuId: string | null;
  onSelect: (zhuzId: string, ruId: string | null) => void;
};

export function ShezhireTree({ locale, selectedZhuzId, selectedRuId, onSelect }: Props) {
  const copy = ui[locale];
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const results = query ? shezhireZhuzes.flatMap((zhuz) => {
    const nodes = zhuz.ru.filter((ru) => Object.values(ru.name).some((name) => name.toLocaleLowerCase().includes(query)));
    return [...(Object.values(zhuz.name).some((name) => name.toLocaleLowerCase().includes(query)) ? [{ zhuz, ru: null }] : []), ...nodes.map((ru) => ({ zhuz, ru }))];
  }) : [];

  function zoom(change: number) { setScale((current) => Math.max(0.65, Math.min(1.5, Math.round((current + change) * 100) / 100))); }
  function reset() { setScale(1); setOffset({ x: 0, y: 0 }); }
  function choose(zhuzId: string, ruId: string | null) {
    setCollapsed((current) => current.filter((id) => id !== zhuzId));
    onSelect(zhuzId, ruId);
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, input")) return;
    drag.current = { x: event.clientX, y: event.clientY, left: offset.x, top: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setOffset({ x: drag.current.left + event.clientX - drag.current.x, y: drag.current.top + event.clientY - drag.current.y });
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function onWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    zoom(event.deltaY < 0 ? 0.08 : -0.08);
  }

  return <section className="shezhire-visual" aria-label={copy.shezhireTitle}>
    <div className="shezhire-visual-top">
      <div><span className="panel-overline">{copy.shezhireOverline}</span><h2>{copy.shezhireZhuzes}</h2><p>{copy.shezhireCollective}</p></div>
      <div className="shezhire-visual-controls">
        <button type="button" onClick={() => zoom(0.1)} aria-label={copy.shezhireZoomIn}>+</button>
        <button type="button" onClick={() => zoom(-0.1)} aria-label={copy.shezhireZoomOut}>−</button>
        <button type="button" onClick={reset} aria-label={copy.shezhireResetView}>⌖</button>
      </div>
    </div>
    <label className="shezhire-visual-search">{copy.shezhireSearch}<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.shezhireSearchPlaceholder} /></label>
    {query && <div className="shezhire-visual-results" role="list" aria-label={copy.shezhireSearch}>
      {results.length ? results.map(({ zhuz, ru }) => <button key={`${zhuz.id}:${ru?.id ?? "all"}`} type="button" role="listitem" onClick={() => { choose(zhuz.id, ru?.id ?? null); setSearch(""); }}>
        {ru?.name[locale] ?? zhuz.name[locale]} <span>↗</span>
      </button>) : <p>{copy.shezhireNoResults}</p>}
    </div>}
    <div ref={viewport} className="shezhire-viewport" tabIndex={0} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onWheel={onWheel}>
      <div className="shezhire-graph" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}>
        <div className="shezhire-graph-root"><span className="shezhire-graph-symbol" aria-hidden="true">◇</span><strong>{copy.shezhireZhuzes}</strong></div>
        <div className="shezhire-graph-branches">
          {shezhireZhuzes.map((zhuz) => <div key={zhuz.id} className="shezhire-graph-branch">
            <div className="shezhire-graph-zhuz">
              <button type="button" className={`shezhire-graph-node${selectedZhuzId === zhuz.id && !selectedRuId ? " is-selected" : ""}`} onClick={() => choose(zhuz.id, null)}>{zhuz.name[locale]}</button>
              <button type="button" className="shezhire-branch-toggle" aria-label={collapsed.includes(zhuz.id) ? copy.shezhireExpand : copy.shezhireCollapse} aria-expanded={!collapsed.includes(zhuz.id)} onClick={() => setCollapsed((current) => current.includes(zhuz.id) ? current.filter((id) => id !== zhuz.id) : [...current, zhuz.id])}>{collapsed.includes(zhuz.id) ? "+" : "−"}</button>
            </div>
            {!collapsed.includes(zhuz.id) && <div className="shezhire-graph-ru-list">{zhuz.ru.map((ru) => <button key={ru.id} type="button" className={`shezhire-graph-ru${selectedRuId === ru.id ? " is-selected" : ""}`} onClick={() => choose(zhuz.id, ru.id)}>{ru.name[locale]}</button>)}</div>}
          </div>)}
        </div>
      </div>
    </div>
    <p className="shezhire-visual-hint">{copy.shezhireTreeHint}</p>
  </section>;
}
