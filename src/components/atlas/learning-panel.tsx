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
import { completeActivity, useLearningProgress } from "@/lib/learning/progress";

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

function QuizActivity({ questions, events, locale, scope }: { questions: LearningQuestion[]; events: EventIndex; locale: Locale; scope: LearningScope }) {
  const copy = ui[locale];
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [index, setIndex] = useState(0);
  const [award, setAward] = useState<boolean | null>(null);
  const question = questions[index];
  const done = index >= questions.length;
  const selected = answers[index];
  const correct = question && selected === question.correctIndex;

  function finish() {
    setAward(completeActivity(activityId("quiz", scope)));
    setIndex(questions.length);
  }

  if (done) return <div className="learn-result" role="status">
    <span className="panel-overline">{copy.learnResult}</span>
    <strong>{scoreAnswers(questions, answers)} / {questions.length}</strong>
    <p>{copy.learnScore}</p>
    <p>{award ? copy.learnXpAward : copy.learnXpRepeat}</p>
    <button type="button" className="learn-primary" onClick={() => { setAnswers(questions.map(() => null)); setIndex(0); setAward(null); }}>{copy.learnRestart}</button>
  </div>;

  return <article className="learn-activity" aria-labelledby="learn-current-question">
    <span className="learn-counter">{copy.learnQuestion} {index + 1} {copy.learnOf} {questions.length}</span>
    <h3 id="learn-current-question">{question.prompt[locale]}</h3>
    <div className="learn-choices" role="group" aria-label={copy.learnChoose}>
      {question.choices.map((choice, choiceIndex) => <button type="button" key={choiceIndex}
        disabled={selected !== null}
        className={selected !== null && choiceIndex === question.correctIndex ? "is-correct" : selected === choiceIndex ? "is-incorrect" : ""}
        onClick={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? choiceIndex : value))}>
        <span aria-hidden="true">{String.fromCharCode(65 + choiceIndex)}</span>{choice[locale]}
      </button>)}
    </div>
    {selected !== null && <div className="learn-feedback" role="status">
      <strong>{correct ? copy.learnCorrect : copy.learnIncorrect}</strong>
      {!correct && <p>{copy.learnAnswer}: {question.choices[question.correctIndex][locale]}</p>}
      <Evidence question={question} event={events[question.eventId]} locale={locale} />
      <button type="button" className="learn-primary" onClick={index === questions.length - 1 ? finish : () => setIndex(index + 1)}>
        {index === questions.length - 1 ? copy.learnFinish : copy.learnNext}
      </button>
    </div>}
  </article>;
}

function CardsActivity({ questions, events, locale, scope }: { questions: LearningQuestion[]; events: EventIndex; locale: Locale; scope: LearningScope }) {
  const copy = ui[locale];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [award, setAward] = useState<boolean | null>(null);
  const question = questions[index];

  if (done) return <div className="learn-result" role="status">
    <span className="panel-overline">{copy.learnCardsDone}</span>
    <strong>{questions.length} / {questions.length}</strong>
    <p>{award ? copy.learnXpAward : copy.learnXpRepeat}</p>
    <button type="button" className="learn-primary" onClick={() => { setIndex(0); setRevealed(false); setDone(false); setAward(null); }}>{copy.learnRestart}</button>
  </div>;

  return <article className="learn-activity" aria-labelledby="learn-card-question">
    <span className="learn-counter">{copy.learnCardFront} {index + 1} {copy.learnOf} {questions.length}</span>
    <h3 id="learn-card-question">{question.prompt[locale]}</h3>
    {!revealed ? <button type="button" className="learn-primary" onClick={() => setRevealed(true)}>{copy.learnReveal}</button> : <div className="learn-feedback" role="status">
      <span className="panel-overline">{copy.learnCardBack}</span>
      <p className="learn-card-answer">{question.choices[question.correctIndex][locale]}</p>
      <Evidence question={question} event={events[question.eventId]} locale={locale} />
    </div>}
    <div className="learn-navigation">
      <button type="button" disabled={index === 0} onClick={() => { setIndex(index - 1); setRevealed(false); }}>{copy.learnPrevious}</button>
      {index === questions.length - 1
        ? <button type="button" disabled={!revealed} onClick={() => { setAward(completeActivity(activityId("cards", scope))); setDone(true); }}>{copy.learnFinish}</button>
        : <button type="button" disabled={!revealed} onClick={() => { setIndex(index + 1); setRevealed(false); }}>{copy.learnNextCard}</button>}
    </div>
  </article>;
}

export function LearningPanel({ open, onClose, era, figure, locale }: LearningPanelProps) {
  const copy = ui[locale];
  const [scopeKind, setScopeKind] = useState<"all" | "era" | "figure">(figure ? "figure" : era.kind === "technical-fixture" ? "all" : "era");
  const [mode, setMode] = useState<"quiz" | "cards">("quiz");
  const [events, setEvents] = useState<EventIndex | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const progress = useLearningProgress();
  const actualScopeKind = scopeKind === "figure" && !figure ? "era" : scopeKind === "era" && era.kind === "technical-fixture" ? "all" : scopeKind;
  const scope: LearningScope = actualScopeKind === "all" ? { kind: "all" } : actualScopeKind === "figure" && figure ? { kind: "figure", id: figure.id } : { kind: "era", id: era.id };
  const questions = questionsForScope(learningQuestions, scope);
  const selectedScopeLabel = scope.kind === "all" ? copy.learnAll : scope.kind === "era" ? eraText(era, "label", locale) : figureText(figure!, "name", locale);

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
        <div className="learn-progress"><strong>{copy.learnProgress}</strong><span>{copy.learnXp}: {progress.xp}</span><p>{copy.learnLocalNote}</p></div>
        {locale !== "ru" && <p className="learn-review">{copy.translationReview}</p>}
      </div>
    </section>
  </>;
}
