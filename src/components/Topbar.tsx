import { LayoutGrid, List, Focus, Download, LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { exportJSON } from "../utils/exportData"

interface TopbarProps {
  page: 'tasks' | 'lists'
  setPage: (page: 'tasks' | 'lists') => void
  onFocus: () => void
}

export default function Topbar({ page, setPage, onFocus }: TopbarProps) {
  return (
    <header style={styles.header}>
      <span style={styles.logo}>
        <img src="/favicon.svg" alt="iris" style={styles.logoImg} />
        Iris
      </span>
      <nav style={styles.nav}>
        <TabBtn
          active={page === "tasks"}
          onClick={() => setPage("tasks")}
          icon={<LayoutGrid size={14} />}
        >
          Cards
        </TabBtn>
        <TabBtn
          active={page === "lists"}
          onClick={() => setPage("lists")}
          icon={<List size={14} />}
        >
          Lists
        </TabBtn>
      </nav>
      <div style={styles.actions}>
        <ActionBtn
          onClick={onFocus}
          icon={<Focus size={14} />}
          label="Focus"
          accent
        />
        <ActionBtn
          onClick={exportJSON}
          icon={<Download size={14} />}
          label="Export"
        />
      </div>
    </header>
  )
}

interface TabBtnProps {
  active: boolean
  onClick: () => void
  icon: ReactNode
  children: ReactNode
}

function TabBtn({ active, onClick, icon, children }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        color: active ? "var(--jade)" : "var(--muted)",
        borderBottom: active
          ? "2px solid var(--jade)"
          : "2px solid transparent",
      }}
    >
      {icon}
      {children}
    </button>
  )
}

interface ActionBtnProps {
  onClick: () => void
  icon: ReactNode
  label: string
  accent?: boolean
}

function ActionBtn({ onClick, icon, label, accent }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.action,
        background: accent ? "var(--jade-glow)" : "none",
        border: accent ? "1px solid var(--jade)" : "1px solid var(--border)",
        color: accent ? "var(--jade)" : "var(--muted)",
      }}
    >
      {icon} {label}
    </button>
  )
}

const styles = {
  header: {
    height: 52,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: "0 24px",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  },
  logo: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 8,
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    color: "var(--muted)",
    letterSpacing: "0.08em",
  },
  logoImg: {
    height: 28,
    width: 28,
  },
  nav: { display: "flex" as const, gap: 4 },
  tab: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 6,
    background: "none",
    border: "none",
    padding: "0 14px",
    height: 52,
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    transition: "color 0.15s",
    cursor: "pointer" as const,
  },
  actions: { display: "flex" as const, gap: 8, alignItems: "center" as const },
  action: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 6,
    borderRadius: "var(--radius)",
    padding: "6px 12px",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer" as const,
    letterSpacing: "0.03em",
  },
}
