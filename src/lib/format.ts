export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.round(days / 7)}w ago`;
}

export const modeCopy: Record<string, { label: string; hint: string }> = {
  open: { label: "Open", hint: "Anyone can contribute anything." },
  guided: { label: "Guided", hint: "Contributions answer the central prompt." },
  collaborative: { label: "Collaborative", hint: "Build on what others started." },
  reflective: { label: "Reflective", hint: "Respond with perspectives, not verdicts." },
  challenge: { label: "Challenge", hint: "Contribute an action or a solution." },
};

export const tileTypeCopy: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "var(--idea)" },
  question: { label: "Question", color: "var(--question)" },
  perspective: { label: "Perspective", color: "var(--perspective)" },
  story: { label: "Story", color: "var(--story)" },
  challenge: { label: "Challenge", color: "var(--challenge)" },
  resource: { label: "Resource", color: "var(--resource)" },
};
