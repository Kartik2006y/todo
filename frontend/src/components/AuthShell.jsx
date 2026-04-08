import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

function AuthShell({
  title,
  subtitle,
  promptText,
  promptLink,
  promptLabel,
  theme,
  toggleTheme,
  children,
}) {
  return (
    <main className="auth-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="auth-hero">
        <div className="auth-hero-top">
          <span className="badge">Smart Task & Notes</span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="auth-copy">
          <p className="eyebrow">Full-stack MERN workspace</p>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          <div className="auth-points">
            <div>
              <strong>Track momentum</strong>
              <p>Handle pending work, completed tasks, and due dates in one flow.</p>
            </div>
            <div>
              <strong>Capture notes fast</strong>
              <p>Save quick references, ideas, and supporting details beside your tasks.</p>
            </div>
            {/* <div>
              <strong>Stay deployment-ready</strong>
              <p>Built for a clean split between the React client and Express API.</p>
            </div> */}
          </div>
        </div>
      </section>

      <section className="auth-card">
        {children}
        <p className="auth-switch">
          {promptText} <Link to={promptLink}>{promptLabel}</Link>
        </p>
      </section>
    </main>
  );
}

export default AuthShell;
