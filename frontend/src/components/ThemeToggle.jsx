function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme}>
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}

export default ThemeToggle;
