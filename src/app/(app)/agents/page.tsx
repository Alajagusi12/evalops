import { Bot, Clock } from "lucide-react";

const agents = [
  { name: "Accuracy & Factuality", status: "Active", desc: "Evaluating factual correctness and identifying incorrect statements.", latency: "1.2s" },
  { name: "Hallucination Detection", status: "Active", desc: "Detecting fabricated information and imaginary APIs.", latency: "0.8s" },
  { name: "Reasoning Evaluation", status: "Idle", desc: "Assessing logical consistency and flawed assumptions.", latency: "-" },
  { name: "Instruction-Following", status: "Active", desc: "Determining if the AI followed formatting and constraints.", latency: "0.4s" },
  { name: "Safety & Policy", status: "Completed", desc: "Checking for harmful advice and privacy violations.", latency: "1.5s" },
  { name: "Code Evaluation", status: "Idle", desc: "Reviewing AI-generated code for syntax and logic bugs.", latency: "-" },
  { name: "AI Judge", status: "Active", desc: "Consolidating findings and calculating overall scores.", latency: "2.1s" },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-sm text-muted mt-1">Specialized agents performing autonomous evaluation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.name} className="p-5 rounded border border-border bg-surface flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-pass" />
                <h3 className="font-medium text-sm">{agent.name}</h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded border uppercase tracking-wider ${
                agent.status === "Active" ? "bg-pass/10 text-pass border-pass/20" :
                agent.status === "Idle" ? "bg-bg text-muted border-border" :
                "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {agent.status}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed flex-1">{agent.desc}</p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Latency</span>
              <span>{agent.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}