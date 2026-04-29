@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Lora:wght@400;600;700&family=Playfair+Display:wght@400;600;700;900&display=swap');
@import "tailwindcss";

@theme {
  --font-display: 'Playfair Display', 'Times New Roman', serif;
  --font-serif: 'Lora', Georgia, serif;
  --font-sans: 'Inter', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --color-cream: #F9F9F7;
  --color-parchment: #F5F5F2;
  --color-warm-white: #F9F9F7;
  --color-charcoal: #111111;
  --color-charcoal-light: #202020;
  --color-ink: #404040;
  --color-muted: #525252;
  --color-subtle: #737373;
  --color-ghost: #A3A3A3;
  --color-gold: #CC0000;
  --color-gold-light: #CC0000;
  --color-gold-pale: #F2E4E4;
  --color-rust: #CC0000;
  --color-rust-light: #A80000;
  --color-rust-pale: #F7E2E2;
  --color-border: #111111;
  --color-border-light: #E5E5E0;

  --color-primary: var(--color-charcoal);
  --color-primary-light: var(--color-charcoal-light);
  --color-accent: var(--color-rust);
  --color-accent-light: var(--color-rust-light);
  --color-background: var(--color-cream);
  --color-surface: var(--color-warm-white);
  --color-surface-secondary: var(--color-parchment);
  --color-surface-hover: #F5F5F5;
  --color-text-main: var(--color-charcoal);
  --color-text-muted: var(--color-muted);
  --color-text-subtle: var(--color-subtle);
  --color-text-light: var(--color-ghost);
  --color-secondary: var(--color-rust);
  --color-secondary-light: var(--color-rust-pale);
  --color-secondary-dark: var(--color-rust-light);
}

@layer base {
  :root {
    color-scheme: light;
    --shadow-xs: 0 0 0 1px rgba(17, 17, 17, 0.08);
    --shadow-soft: 0 0 0 1px rgba(17, 17, 17, 0.12);
    --shadow-medium: 4px 4px 0 0 #111111;
    --shadow-lg: 6px 6px 0 0 #111111;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    background-color: var(--color-background);
    color: var(--color-text-main);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow-x: hidden;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23111111' fill-opacity='0.04' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'/%3E%3C/svg%3E");
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(0deg, transparent 98%, rgba(0, 0, 0, 0.02) 100%),
      linear-gradient(90deg, transparent 98%, rgba(0, 0, 0, 0.02) 100%);
    background-size: 3px 3px;
    opacity: 0.55;
    pointer-events: none;
    z-index: 0;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: var(--font-display);
    color: var(--color-charcoal);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  h1 { font-size: clamp(3rem, 6vw, 7rem); }
  h2 { font-size: clamp(2rem, 4vw, 4rem); }
  h3 { font-size: clamp(1.4rem, 2.6vw, 2rem); }
  h4 { font-size: clamp(1.1rem, 2vw, 1.5rem); }

  p {
    margin: 0;
    font-family: var(--font-serif);
  }

  a, button, input, select, textarea {
    font: inherit;
  }

  input, select, textarea, button {
    border-radius: 0 !important;
  }
}

.card-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, background 0.2s ease-out;
  position: relative;
  overflow: hidden;
}

.card-panel:hover {
  background: var(--color-surface-hover);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-medium);
}

.input-base,
.input-field {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-bottom: 2px solid var(--color-border);
  padding: 0.85rem 0.9rem;
  color: var(--color-text-main);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  outline: none;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-base::placeholder,
.input-field::placeholder {
  color: var(--color-text-subtle);
}

.input-base:focus,
.input-field:focus {
  background: #F0F0F0;
  border-color: var(--color-border);
  box-shadow: inset 0 -2px 0 0 var(--color-rust);
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: 1px solid var(--color-border);
  text-decoration: none;
}

.btn-primary {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

.btn-primary:hover {
  background: var(--color-surface);
  color: var(--color-charcoal);
  box-shadow: var(--shadow-medium);
  transform: translate(-2px, -2px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-charcoal);
}

.btn-secondary:hover {
  background: var(--color-charcoal);
  color: var(--color-cream);
  box-shadow: var(--shadow-medium);
  transform: translate(-2px, -2px);
}

.navbar-soft {
  background: rgba(249, 249, 247, 0.95);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.micro-label,
.section-number,
.news-kicker {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-text-subtle);
}

.accent-line,
.organic-line {
  height: 1px;
  background: var(--color-border);
}

.category-pill,
.signature-badge,
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-main);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s ease-out;
}

.category-pill:hover,
.tag-chip:hover {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

.signature-badge {
  background: var(--color-rust);
  color: var(--color-cream);
  border-color: var(--color-rust);
}

.tag-chip.active {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

.divider-playful {
  position: relative;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-playful::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.divider-playful::after {
  content: '✧ ✧ ✧';
  position: relative;
  padding: 0 1rem;
  background: var(--color-background);
  color: var(--color-ghost);
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.45em;
}

.text-gradient-warm {
  color: var(--color-charcoal);
}

.img-zoom-wrap {
  overflow: hidden;
}

.img-zoom-wrap img {
  transition: transform 0.25s ease-out, filter 0.25s ease-out;
}

.img-zoom-wrap:hover img {
  transform: scale(1.05);
  filter: grayscale(1) sepia(0.5);
}

.prose-premium {
  line-height: 1.8;
  color: var(--color-ink);
  font-family: var(--font-serif);
}

.prose-premium p:first-child::first-letter {
  float: left;
  font-family: var(--font-display);
  font-size: 4.5rem;
  line-height: 0.8;
  padding-right: 0.45rem;
  padding-top: 0.2rem;
  color: var(--color-rust);
}

.nav-link {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--color-text-main);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: var(--color-rust);
  transition: width 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-rust);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.search-wrap {
  position: relative;
}

.search-wrap .search-glow {
  display: none;
}

.rail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--color-border-light);
}

.rail-number {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-rust);
}

.activity-dot {
  width: 6px;
  height: 6px;
  background: var(--color-rust);
  flex-shrink: 0;
  margin-top: 0.45rem;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.activity-dot.live {
  animation: livePulse 1.8s ease-in-out infinite;
}

.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--color-rust);
  z-index: 200;
  transition: width 0.1s linear;
}

.btn-tactile {
  transition: transform 0.2s ease-out;
}

.btn-tactile:hover {
  transform: translate(-2px, -2px);
}

.meta-reveal {
  opacity: 1;
  transform: none;
}

.editor-loader {
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-rust);
  animation: editorSpin 1s linear infinite;
}

@keyframes editorSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cursor-ripple {
  position: fixed;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(17, 17, 17, 0.2);
  background: rgba(17, 17, 17, 0.06);
  pointer-events: none;
  animation: rippleOut 0.5s ease-out forwards;
  z-index: 9999;
}

@keyframes rippleOut {
  from { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
  to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

.newsprint-shell {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.newsprint-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.25rem;
  margin-bottom: 1.75rem;
}

.newsprint-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 6.5rem);
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.newsprint-dek {
  max-width: 48rem;
  margin-top: 1rem;
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-muted);
  text-align: justify;
}

.newsprint-panel {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.newsprint-invert {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

.newsprint-invert h1,
.newsprint-invert h2,
.newsprint-invert h3,
.newsprint-invert h4,
.newsprint-invert p,
.newsprint-invert span,
.newsprint-invert a {
  color: inherit;
}

.newsprint-form label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-text-subtle);
}

.newsprint-prose {
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.85;
  color: var(--color-ink);
  text-align: justify;
}

@media (max-width: 1023px) {
  .newsprint-shell {
    border-left: none;
    border-right: none;
  }
}

@media (max-width: 767px) {
  .divider-playful::after {
    letter-spacing: 0.2em;
  }
}
