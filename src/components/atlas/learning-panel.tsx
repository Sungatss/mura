"use client";

import { useEffect, useRef, useState } from "react";
import { eras, sources } from "@/data/atlas";
import { learningQuestions, type LearningQuestion } from "@/data/learning";
import { ui } from "@/data/ui-translations";
import { eraText, eventText, figureText, sourceTitle } from "@/data/historical-translations";
import type { Era, EventFeature, HistoricalFigure } from "@/lib/atlas/types";
import { validateEraData } from "@/lib/atlas/validate";
import type { Locale } from "@/lib/i18n";
import { activityId, questionsForScope, scoreAnswers, type LearningScope } from "@/lib/learning/quiz";
import { completeActivity, maxLearningXp, useLearningProgress } from "@/lib/learning/progress";
import { achievements, levelProgress, unlockedAchievements } from "@/lib/learning/milestones";

type LearningPanelProps = {
  open: boolean;
  onClose: () => void;
  era: Era;
  figure?: HistoricalFigure;
  locale: Locale;
};

type EventIndex = Record<string, EventFeature>;

function Evidence({ question, event, locale }: { question: LearningQuestion; event: EventFeature; locale: Locale }) {
  const copy = ui[locale];
  const ids = [...new Set([...event.properties.sourceIds, ...(event.properties.coordinateSourceIds ?? [])])];
  return <div className="learn-evidence">
    <h3>{copy.learnExplanation}</h3>
    <p>{eventText(event.properties, "description", locale)}</p>
    {event.properties.uncertaintyNote && <p className="learn-uncertainty">{eventText(event.properties, "uncertaintyNote", locale)}</p>}
    {question.id === "ordabasy-marker" && event.properties.coordinateNote && <p className="learn-uncertainty">{eventText(event.properties, "coordinateNote", locale)}</p>}
    <h3>{copy.sources}</h3>
    <ul>{ids.map((id) => {
      const source = sources.find((item) => item.id === id);
      return source ? <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}>{sourceTitle(id, source.title, locale).replaceAll(" — ", ": ")} <span aria-hidden="true">↗</span></a></li> : null;
    })}</ul>
  </div>;
}

function AchievementIcon({ icon }: { icon: (typeof achievements)[number]["icon"] }) {
  const paths = {
    spark: <><path d="M20 6v28M6 20h28M10 10l20 20M30 10 10 30" /><circle cx="20" cy="20" r="5" /></>,
    book: <><path d="M20 10c-5-3-10-3-14-1v21c5-2 10-2 14 1 4-3 9-3 14-1V9c-4-2-9-2-14 1Z" /><path d="M20 10v21M9 14c3-1 5-.5 8 .5M23 14c3-1 5-1.5 8-.5" /></>,
    compass: <><circle cx="20" cy="20" r="14" /><path d="m24 16-3 8-5 1 3-9 5-1ZM20 3v4M20 33v4M3 20h4M33 20h4" /></>,
    layers: <><path d="m20 5 14 8-14 8L6 13l14-8ZM6 20l14 8 14-8M6 27l14 8 14-8" /></>,
    archive: <><path d="M8 7h24v6H8zM10 13v20h20V13M15 20h10M17 25h6" /><path d="M5 10h3M32 10h3" /></>,
    portrait: <><path d="M7 6h26v28H7zM14 29c0-5 3-7 6-7s6 2 6 7M20 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M12 6V3M28 6V3" /></>,
  };
  return <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[icon]}</svg>;
}

function LearningDashboard({ xp, locale }: { xp: number; locale: Locale }) {
  const copy = ui[locale];
  const level = levelProgress(xp, maxLearningXp);
  return <section className="learn-dashboard" aria-label={copy.learnProgress}>
    <div className="learn-dashboard-top"><span>{copy.learnProgress}</span><strong>{xp} XP</strong></div>
    <div className="learn-level-line"><strong>{copy.learnLevel} {level.level}</strong><span>{level.complete ? copy.learnLevelComplete : `${level.current} / ${level.target} XP`}</span></div>
    <div className="learn-level-track" role="progressbar" aria-label={copy.learnLevel} aria-valuenow={level.current} aria-valuemin={0} aria-valuemax={level.target}>
      <span style={{ width: `${level.current / level.target * 100}%` }} />
    </div>
  </section>;
}

function AchievementGallery({ completed, locale, fresh }: { completed: readonly string[]; locale: Locale; fresh: readonly string[] }) {
  const copy = ui[locale];
  const unlocked = new Set(unlockedAchievements(completed));
  return <section className="learn-achievements" aria-labelledby="learn-achievements-title">
    <div className="section-heading"><h3 id="learn-achievements-title">{copy.learnAchievements}</h3><span>{unlocked.size} / {achievements.length}</span></div>
    <div className="learn-achievement-grid">{achievements.map((item) => <div key={item.id}
      className={`learn-achievement${unlocked.has(item.id) ? " is-unlocked" : ""}${fresh.includes(item.id) ? " is-new" : ""}`}>
      <span className="learn-achievement-icon"><AchievementIcon icon={item.icon} /></span>
      <span className="learn-achievement-copy"><strong>{item.title[locale]}</strong><span>{item.description[locale]}</span><small>{unlocked.has(item.id) ? copy.learnUnlocked : copy.learnLocked}</small></span>
    </div>)}</div>
    {fresh.length > 0 && <span className="learn-sr-only" role="status">{copy.learnUnlocked}: {achievements.filter((item) => fresh.includes(item.id)).map((item) => item.title[locale]).join(", ")}</span>}
  </section>;
}

function useStepScroll(step: string) {
  const ref = useRef<HTMLElement>(null);
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    const frame = window.requestAnimationFrame(() => {
      const target = ref.current;
      const scroller = target?.closest<HTMLElement>(".learn-body");
      if (!target || !scroller) return;
      const top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 10;
      scroller.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);
  return ref;
}

function QuizActivity({ questions, events, locale, scope }: { questions: LearningQuestion[]; events: EventIndex; locale: Locale; scope: LearningScope }) {
  const copy = ui[locale];
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [index, setIndex] = useState(0);
  const [award, setAward] = useState<boolean | null>(null);
  const question = questions[index];
  const done = index >= questions.length;
  const activityRef = useStepScroll(`${index}:${done}`);
  const selected = answers[index];
  const correct = question && selected === question.correctIndex;

  function finish() {
    setAward(completeActivity(activityId("quiz", scope)));
    setIndex(questions.length);
  }

  if (done) return <section ref={activityRef} className="learn-result" role="status">
    <span className="panel-overline">{copy.learnResult}</span>
    <div className="learn-result-score"><strong>{scoreAnswers(questions, answers)} <span>/ {questions.length}</span></strong><small>{copy.learnScore}</small></div>
    <div className="learn-result-metrics">
      <div><span>{copy.learnAccuracy}</span><strong>{Math.round(scoreAnswers(questions, answers) / questions.length * 100)}%</strong></div>
      <div><span>{copy.learnEarnedXp}</span><strong>+{award ? 10 : 0} XP</strong></div>
    </div>
    <p>{award ? copy.learnXpAward : copy.learnXpRepeat}</p>
    <button type="button" className="learn-primary" onClick={() => { setAnswers(questions.map(() => null)); setIndex(0); setAward(null); }}>{copy.learnRestart}</button>
  </section>;

  return <section ref={activityRef} className="learn-activity" aria-labelledby="learn-current-question">
    <span className="learn-counter">{copy.learnQuestion} {index + 1} {copy.learnOf} {questions.length}</span>
    <div className="learn-question-progress" role="progressbar" aria-label={copy.learnQuestion} aria-valuenow={index + (selected !== null ? 1 : 0)} aria-valuemin={0} aria-valuemax={questions.length}>
      {questions.map((item, itemIndex) => <span key={item.id} className={itemIndex < index || itemIndex === index && selected !== null ? "is-complete" : itemIndex === index ? "is-current" : ""} />)}
    </div>
    <h3 id="learn-current-question">{question.prompt[locale]}</h3>
    <div className="learn-choices" role="group" aria-label={copy.learnChoose}>
      {question.choices.map((choice, choiceIndex) => <button type="button" key={choiceIndex}
        disabled={selected !== null}
        className={selected !== null && choiceIndex === question.correctIndex ? "is-correct" : selected === choiceIndex ? "is-incorrect" : ""}
        onClick={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? choiceIndex : value))}>
        <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span>{choice[locale]}
      </button>)}
    </div>
    {selected !== null && <div className={`learn-feedback${correct ? " is-correct" : " is-incorrect"}`} role="status">
      <strong>{correct ? copy.learnCorrect : copy.learnIncorrect}</strong>
      {!correct && <p>{copy.learnAnswer}: {question.choices[question.correctIndex][locale]}</p>}
      <Evidence question={question} event={events[question.eventId]} locale={locale} />
      <button type="button" className="learn-primary" onClick={index === questions.length - 1 ? finish : () => setIndex(index + 1)}>
        {index === questions.length - 1 ? copy.learnFinish : copy.learnNext}
      </button>
    </div>}
  </section>;
}

function CardsActivity({ questions, events, locale, scope }: { questions: LearningQuestion[]; events: EventIndex; locale: Locale; scope: LearningScope }) {
  const copy = ui[locale];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [award, setAward] = useState<boolean | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const question = questions[index];
  const activityRef = useStepScroll(`${index}:${done}`);
  const previous = () => { if (index > 0) { setIndex(index - 1); setRevealed(false); } };
  const next = () => { if (revealed && index < questions.length - 1) { setIndex(index + 1); setRevealed(false); } };

  if (done) return <section ref={activityRef} className="learn-result" role="status">
    <span className="panel-overline">{copy.learnCardsDone}</span>
    <div className="learn-result-score"><strong>{questions.length} <span>/ {questions.length}</span></strong><small>{copy.learnCardsDone}</small></div>
    <div className="learn-result-metrics"><div><span>{copy.learnEarnedXp}</span><strong>+{award ? 10 : 0} XP</strong></div></div>
    <p>{award ? copy.learnXpAward : copy.learnXpRepeat}</p>
    <button type="button" className="learn-primary" onClick={() => { setIndex(0); setRevealed(false); setDone(false); setAward(null); }}>{copy.learnRestart}</button>
  </section>;

  return <section ref={activityRef} className="learn-activity" aria-labelledby="learn-card-question">
    <span className="learn-counter">{index + 1} {copy.learnOf} {questions.length}</span>
    <div className="learn-question-progress" role="progressbar" aria-label={copy.learnCards} aria-valuenow={index + (revealed ? 1 : 0)} aria-valuemin={0} aria-valuemax={questions.length}>
      {questions.map((item, itemIndex) => <span key={item.id} className={itemIndex < index || itemIndex === index && revealed ? "is-complete" : itemIndex === index ? "is-current" : ""} />)}
    </div>
    <button type="button" className={`learn-flashcard${revealed ? " is-revealed" : ""}`} aria-pressed={revealed}
      aria-label={revealed
        ? `${copy.learnCardBack}: ${question.choices[question.correctIndex][locale]}. ${copy.learnFlipBack}`
        : `${copy.learnCardFront}: ${question.prompt[locale]}. ${copy.learnFlip}`}
      onClick={() => setRevealed((current) => !current)}
      onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) < 60 || Math.abs(dy) > 45) return;
        event.preventDefault();
        if (dx > 0) previous(); else next();
      }}>
      <span className="learn-flashcard-inner">
        <span className="learn-flashcard-face learn-flashcard-front" aria-hidden={revealed}>
          <span className="learn-flashcard-kicker">{copy.learnCardFront}</span>
          <span id="learn-card-question" className="learn-flashcard-text">{question.prompt[locale]}</span>
          <span className="learn-flashcard-hint">{copy.learnFlip} <span aria-hidden="true">↗</span></span>
        </span>
        <span className="learn-flashcard-face learn-flashcard-back" aria-hidden={!revealed}>
          <span className="learn-flashcard-kicker">{copy.learnCardBack}</span>
          <span className="learn-flashcard-text">{question.choices[question.correctIndex][locale]}</span>
          <span className="learn-flashcard-hint">{copy.learnFlipBack} <span aria-hidden="true">↶</span></span>
        </span>
      </span>
    </button>
    {revealed && <div className="learn-feedback learn-card-evidence" role="status">
      <Evidence question={question} event={events[question.eventId]} locale={locale} />
    </div>}
    <div className="learn-navigation">
      <button type="button" disabled={index === 0} onClick={previous}>{copy.learnPrevious}</button>
      {index === questions.length - 1
        ? <button type="button" disabled={!revealed} onClick={() => { setAward(completeActivity(activityId("cards", scope))); setDone(true); }}>{copy.learnFinish}</button>
        : <button type="button" disabled={!revealed} onClick={next}>{copy.learnNextCard}</button>}
    </div>
    <p className="learn-swipe-hint">{copy.learnSwipe}</p>
  </section>;
}

export function LearningPanel({ open, onClose, era, figure, locale }: LearningPanelProps) {
  const copy = ui[locale];
  const [scopeKind, setScopeKind] = useState<"all" | "era" | "figure">(figure ? "figure" : era.kind === "technical-fixture" ? "all" : "era");
  const [mode, setMode] = useState<"quiz" | "cards">("quiz");
  const [events, setEvents] = useState<EventIndex | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [freshUnlocks, setFreshUnlocks] = useState<string[]>([]);
  const panelRef = useRef<HTMLElement>(null);
  const previousUnlocks = useRef<string[] | null>(null);
  const progress = useLearningProgress();
  const unlockedKey = unlockedAchievements(progress.completed).join("|");
  const actualScopeKind = scopeKind === "figure" && !figure ? "era" : scopeKind === "era" && era.kind === "technical-fixture" ? "all" : scopeKind;
  const scope: LearningScope = actualScopeKind === "all" ? { kind: "all" } : actualScopeKind === "figure" && figure ? { kind: "figure", id: figure.id } : { kind: "era", id: era.id };
  const questions = questionsForScope(learningQuestions, scope);
  const selectedScopeLabel = scope.kind === "all" ? copy.learnAll : scope.kind === "era" ? eraText(era, "label", locale) : figureText(figure!, "name", locale);

  useEffect(() => {
    if (!open) { previousUnlocks.current = null; return; }
    const current = unlockedKey ? unlockedKey.split("|") : [];
    if (previousUnlocks.current === null) { previousUnlocks.current = current; return; }
    const fresh = current.filter((id) => !previousUnlocks.current?.includes(id));
    previousUnlocks.current = current;
    if (!fresh.length) return;
    const show = window.setTimeout(() => setFreshUnlocks(fresh), 0);
    const hide = window.setTimeout(() => setFreshUnlocks([]), 2400);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, [open, unlockedKey]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 960px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    panelRef.current?.querySelector<HTMLButtonElement>(".guide-close")?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab" || !window.matchMedia("(max-width: 960px)").matches || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    async function load() {
      try {
        const knownSources = new Set(sources.map((source) => source.id));
        const datasets = await Promise.all(eras.filter((item) => item.kind === "historical-reconstruction").map(async (item) => {
          const [territoryResponse, eventResponse] = await Promise.all([
            fetch(item.territoryUrl, { signal: controller.signal }), fetch(item.eventUrl, { signal: controller.signal }),
          ]);
          if (!territoryResponse.ok || !eventResponse.ok) throw new Error("Historical data request failed");
          const [territories, eventData] = await Promise.all([territoryResponse.json(), eventResponse.json()]);
          return validateEraData(item, territories, eventData, knownSources).events.features;
        }));
        const index = Object.fromEntries(datasets.flat().map((feature) => [feature.properties.id, feature]));
        if (learningQuestions.some((question) => !index[question.eventId])) throw new Error("Learning event is missing");
        if (!controller.signal.aborted) { setEvents(index); setLoadState("ready"); }
      } catch {
        if (!controller.signal.aborted) setLoadState("error");
      }
    }
    void load();
    return () => controller.abort();
  }, [open, retry]);

  if (!open) return null;

  return <>
    {isMobile && <button className="guide-backdrop" type="button" tabIndex={-1} aria-label={copy.learnCloseLabel} onClick={onClose} />}
    <section ref={panelRef} className="guide-panel learn-panel" role={isMobile ? "dialog" : "region"} aria-modal={isMobile ? true : undefined} aria-labelledby="learn-title">
      <div className="guide-top"><div><span className="panel-overline">{copy.learnOverline}</span><h2 id="learn-title">{copy.learnTitle}</h2></div>
        <button type="button" className="guide-close" onClick={onClose} aria-label={copy.learnCloseLabel}>{copy.learnClose}</button></div>
      <div className="learn-body">
        <p className="learn-intro">{copy.learnIntro}</p>
        <LearningDashboard xp={progress.xp} locale={locale} />
        <div className="learn-mode" role="group" aria-label={copy.learnTitle}>
          <button type="button" aria-pressed={mode === "quiz"} onClick={() => setMode("quiz")}>{copy.learnQuiz}</button>
          <button type="button" aria-pressed={mode === "cards"} onClick={() => setMode("cards")}>{copy.learnCards}</button>
        </div>
        <div className="learn-scope"><span>{copy.learnScope}</span><div role="group" aria-label={copy.learnScope}>
          <button type="button" aria-pressed={actualScopeKind === "all"} onClick={() => setScopeKind("all")}>{copy.learnAll}</button>
          {era.kind === "historical-reconstruction" && <button type="button" aria-pressed={actualScopeKind === "era"} onClick={() => setScopeKind("era")}>{copy.learnEra}</button>}
          {figure && <button type="button" aria-pressed={actualScopeKind === "figure"} onClick={() => setScopeKind("figure")}>{copy.learnFigure}</button>}
        </div></div>
        <p className="learn-context">{selectedScopeLabel}</p>
        {loadState === "loading" && <p className="data-message" role="status">{copy.learnLoading}</p>}
        {loadState === "error" && <div className="data-message" role="alert"><p>{copy.learnError}</p><button type="button" className="retry-button" onClick={() => { setLoadState("loading"); setRetry((value) => value + 1); }}>{copy.retry}</button></div>}
        {loadState === "ready" && events && (questions.length === 0 ? <p className="data-message">{copy.learnEmpty}</p>
          : mode === "quiz"
            ? <QuizActivity key={activityId("quiz", scope)} questions={questions} events={events} locale={locale} scope={scope} />
            : <CardsActivity key={activityId("cards", scope)} questions={questions} events={events} locale={locale} scope={scope} />)}
        <AchievementGallery completed={progress.completed} locale={locale} fresh={freshUnlocks} />
        <p className="learn-local-note">{copy.learnLocalNote}</p>
        {locale !== "ru" && <p className="learn-review">{copy.translationReview}</p>}
      </div>
    </section>
  </>;
}
