"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { guideSuggestions } from "@/data/guide";
import type { Era, EventFeature, HistoricalFigure } from "@/lib/atlas/types";
import type { GuideLanguage, GuideTurn } from "@/lib/guide/validation";
import { MAX_QUESTION_LENGTH } from "@/lib/guide/validation";

type Citation = { id: string; title: string; url: string };
type Message = { role: "user" | "assistant"; text: string; citations?: Citation[]; supported?: boolean };
type PendingQuestion = { question: string; history: GuideTurn[] };
type GuidePanelProps = {
  open: boolean;
  onClose: () => void;
  era: Era;
  event?: EventFeature;
  figure?: HistoricalFigure;
  loadState: "loading" | "ready" | "empty" | "error";
};

const ERROR_TEXT: Record<string, string> = {
  MISSING_API_KEY: "Гид пока не настроен. Администратору нужно добавить GEMINI_API_KEY на сервере.",
  RATE_LIMITED: "Слишком много запросов. Подождите минуту и повторите.",
  PROVIDER_RATE_LIMITED: "Gemini временно ограничил запросы. Повторите позже.",
  PROVIDER_TIMEOUT: "Ответ занимает слишком много времени. Попробуйте ещё раз.",
  DATA_UNAVAILABLE: "Исторические данные сейчас недоступны. Попробуйте ещё раз позже.",
  INVALID_PROVIDER_RESPONSE: "Не удалось проверить ответ и ссылки. Повторите запрос.",
  PROVIDER_UNAVAILABLE: "Gemini сейчас недоступен. Повторите запрос позже.",
};

export function GuidePanel({ open, onClose, era, event, figure, loadState }: GuidePanelProps) {
  const [language, setLanguage] = useState<GuideLanguage>("ru");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [retryQuestion, setRetryQuestion] = useState<PendingQuestion | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const available = era.kind === "historical-reconstruction" && loadState === "ready";
  const suggestions = guideSuggestions(language, era.label.ru, event?.properties.name.ru, figure?.name.ru);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 960px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) {
      controllerRef.current?.abort();
      return;
    }
    const previousFocus = document.activeElement;
    panelRef.current?.querySelector<HTMLButtonElement>(".guide-close")?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !window.matchMedia("(max-width: 960px)").matches || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), textarea:not(:disabled), a[href]")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      controllerRef.current?.abort();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open, isMobile]);

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [messages, pending]);

  if (!open) return null;

  function changeLanguage(next: GuideLanguage) {
    if (next === language) return;
    controllerRef.current?.abort();
    setLanguage(next);
    setMessages([]);
    setErrorCode(null);
    setRetryQuestion(null);
    setPending(false);
  }

  async function ask(question: string, previous?: PendingQuestion) {
    const cleaned = question.trim();
    if (!available || pending || cleaned.length < 3 || cleaned.length > MAX_QUESTION_LENGTH) return;
    const completed = messages.length % 2 === 0 ? messages : messages.slice(0, -1);
    const history = previous?.history ?? completed.slice(-4).map(({ role, text }) => ({ role, text }));
    const request = { question: cleaned, history };
    if (!previous) setMessages((current) => [...current, { role: "user", text: cleaned }]);
    setDraft("");
    setErrorCode(null);
    setRetryQuestion(null);
    setPending(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eraId: era.id,
          eventId: event?.properties.id ?? null,
          figureId: figure?.id ?? null,
          language,
          question: cleaned,
          history,
        }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result.code === "string" ? result.code : "PROVIDER_UNAVAILABLE");
      if (typeof result.answer !== "string" || !Array.isArray(result.citations)) throw new Error("INVALID_PROVIDER_RESPONSE");
      setMessages((current) => [...current, {
        role: "assistant",
        text: result.answer,
        citations: result.citations,
        supported: result.supported === true,
      }]);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setErrorCode(cause instanceof Error ? cause.message : "PROVIDER_UNAVAILABLE");
      setRetryQuestion(request);
    } finally {
      setPending(false);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(draft);
  }

  return <>
    {isMobile && <button className="guide-backdrop" type="button" tabIndex={-1} aria-label="Закрыть исторического гида" onClick={onClose} />}
    <section ref={panelRef} className="guide-panel" role={isMobile ? "dialog" : "region"}
      aria-modal={isMobile ? true : undefined} aria-labelledby="guide-title">
      <div className="guide-top">
        <div><span className="panel-overline">MURA / Источники и контекст</span><h2 id="guide-title">Исторический гид</h2></div>
        <button type="button" className="guide-close" onClick={onClose} aria-label="Закрыть гида">Закрыть</button>
      </div>
      <p className="guide-context">{era.label.ru}{event ? ` / ${event.properties.name.ru}` : figure ? ` / ${figure.name.ru}` : ""}</p>
      <div className="guide-language" role="group" aria-label="Язык ответа">
        <button type="button" aria-pressed={language === "ru"} onClick={() => changeLanguage("ru")}>Русский</button>
        <button type="button" aria-pressed={language === "kk"} onClick={() => changeLanguage("kk")}>Қазақша</button>
      </div>
      <div className="guide-messages" ref={listRef} role="log" aria-label="Разговор с историческим гидом" aria-live="polite">
        {!available && <p className="guide-empty">{era.kind === "technical-fixture"
          ? "Технический слой не содержит исторических данных для ответа."
          : loadState === "loading" ? "Загрузка исторических данных…"
            : loadState === "error" ? "Исторические данные не загрузились. Повторите загрузку в атласе."
              : "Для этого периода нет данных, на которые можно опереться."}</p>}
        {available && messages.length === 0 && <div className="guide-intro">
          <p>Задайте вопрос об этом периоде. Ответ опирается только на материалы атласа и показывает использованные источники.</p>
          <div className="guide-suggestions">{suggestions.map((question) => <button type="button" key={question} onClick={() => void ask(question)}>{question}</button>)}</div>
        </div>}
        {messages.map((message, index) => <article key={index} className={`guide-message guide-message-${message.role}`}>
          <span className="guide-message-label">{message.role === "user" ? "Вы" : "MURA"}</span>
          <p>{message.text}</p>
          {message.citations && message.citations.length > 0 && <div className="guide-citations">
            <strong>Источники</strong>
            <ul>{message.citations.map((citation) => <li key={citation.id}>
              <a href={citation.url} target="_blank" rel="noopener noreferrer">{citation.title.replaceAll(" — ", ": ")} <span aria-hidden="true">↗</span></a>
            </li>)}</ul>
          </div>}
          {message.role === "assistant" && !message.supported && <span className="guide-uncertainty">Недостаточно подтверждённых данных</span>}
        </article>)}
        {pending && <p className="guide-pending" role="status">Гид проверяет материалы периода…</p>}
        {errorCode && <div className="guide-error" role="alert">
          <p>{ERROR_TEXT[errorCode] ?? "Не удалось получить ответ. Попробуйте ещё раз."}</p>
          {retryQuestion && <button type="button" onClick={() => void ask(retryQuestion.question, retryQuestion)}>Повторить вопрос</button>}
        </div>}
      </div>
      <form className="guide-form" onSubmit={submit}>
        <label htmlFor="guide-question">Ваш вопрос</label>
        <textarea id="guide-question" rows={2} maxLength={MAX_QUESTION_LENGTH} value={draft}
          onChange={(event) => setDraft(event.target.value)} disabled={!available || pending}
          placeholder="Спросите о событиях, людях или точности карты" />
        <button type="submit" disabled={!available || pending || draft.trim().length < 3}>Отправить</button>
      </form>
      <p className="guide-disclaimer">{language === "kk"
        ? "Қазақша жауап орыс тіліндегі тексерілген қысқаша деректер негізінде жасалады. Түпнұсқа дереккөздерді тексеріңіз."
        : "Ответ сформирован по кратким проверенным материалам атласа. Для деталей откройте источники."}</p>
    </section>
  </>;
}
