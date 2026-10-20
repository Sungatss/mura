import type { LearningQuestion } from "../../data/learning";

export type LearningScope = { kind: "all" } | { kind: "era"; id: string } | { kind: "figure"; id: string };

export function questionsForScope(questions: readonly LearningQuestion[], scope: LearningScope): LearningQuestion[] {
  if (scope.kind === "all") return [...questions];
  return questions.filter((question) => scope.kind === "era"
    ? question.eraId === scope.id
    : question.figureIds.includes(scope.id));
}

export function scoreAnswers(questions: readonly LearningQuestion[], answers: readonly (number | null)[]): number {
  return questions.reduce((score, question, index) => score + (answers[index] === question.correctIndex ? 1 : 0), 0);
}

export function activityId(mode: "quiz" | "cards", scope: LearningScope): string {
  return `${mode}:${scope.kind === "all" ? "all" : `${scope.kind}:${scope.id}`}`;
}
