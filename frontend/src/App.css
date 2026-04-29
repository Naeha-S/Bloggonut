/* ── Page enter animation ── */
.page-enter {
  animation: fadeInUp 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* ── Magazine grid layouts ── */
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.mg-featured   { grid-column: span 12; }
.mg-medium     { grid-column: span 6; }
.mg-compact    { grid-column: span 4; }

@media (max-width: 1280px) {
  .mg-medium  { grid-column: span 12; }
  .mg-compact { grid-column: span 6; }
}
@media (max-width: 768px) {
  .mg-medium  { grid-column: span 12; }
  .mg-compact { grid-column: span 12; }
}

/* ── Offset rhythm ── */
.offset-left  { transform: translateX(-1.5%); }
.offset-right { transform: translateX( 1.5%); }

@media (max-width: 768px) {
  .offset-left, .offset-right { transform: none; }
}

/* ── Section soft gradient ── */
.section-soft-gradient {
  background: linear-gradient(135deg,
    rgba(247, 242, 234, 0.6) 0%,
    rgba(239, 232, 218, 0.3) 100%
  );
}

/* ── Card matte ── */
.card-matte {
  background: linear-gradient(to bottom right,
    rgba(253, 250, 245, 0.97),
    rgba(247, 242, 234, 0.9)
  );
  backdrop-filter: blur(10px);
}

/* ── Blob decorations ── */
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(12px, -12px) scale(1.04); }
  66%       { transform: translate(-8px,  8px)  scale(0.97); }
}

.shape-blob-top::before {
  content: '';
  position: absolute;
  top: -80px; right: -60px;
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(181,135,60,0.1) 0%, transparent 70%);
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  filter: blur(40px);
  z-index: -1;
  animation: blobFloat 9s ease-in-out infinite;
}

/* ── Navbar nav link underline animation ── */
.nav-link {
  position: relative;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
  padding-bottom: 2px;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1.5px;
  background: var(--color-gold);
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-link:hover { color: var(--color-charcoal); }
.nav-link:hover::after { width: 100%; }

/* ── Search animated focus ── */
.search-wrap { position: relative; }
.search-wrap .search-glow {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  box-shadow: 0 0 0 0px rgba(181, 135, 60, 0);
  transition: box-shadow 0.3s ease;
  pointer-events: none;
}
.search-wrap:focus-within .search-glow {
  box-shadow: 0 0 0 3px rgba(181, 135, 60, 0.14);
}

/* ── Sidebar context rail items ── */
.rail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border-light);
  transition: opacity 0.2s ease;
}
.rail-item:last-child { border-bottom: none; }
.rail-item:hover { opacity: 0.8; }

.rail-number {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--color-gold);
  min-width: 1.5rem;
  margin-top: 2px;
}

/* ── Tag chips ── */
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  background: var(--color-parchment);
  color: var(--color-muted);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  cursor: pointer;
}
.tag-chip:hover {
  background: var(--color-gold-pale);
  border-color: var(--color-gold);
  color: var(--color-rust);
}
.tag-chip.active {
  background: var(--color-charcoal);
  color: var(--color-gold-pale);
  border-color: var(--color-charcoal);
}

/* ── Activity feed dot ── */
.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-gold);
  flex-shrink: 0;
  margin-top: 5px;
}
.activity-dot.live {
  animation: livePulse 2s ease-in-out infinite;
}
@keyframes livePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(181, 135, 60, 0.4); }
  50%       { box-shadow: 0 0 0 5px rgba(181, 135, 60, 0); }
}

/* ── Reading progress bar ── */
.reading-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-rust));
  z-index: 200;
  transition: width 0.1s linear;
}

/* ── Tactile button ── */
.btn-tactile {
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease;
  cursor: pointer;
}
.btn-tactile:hover  { transform: scale(1.04) translateY(-2px); }
.btn-tactile:active { transform: scale(0.97); }

/* ── Hover metadata reveal ── */
.meta-reveal {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.group:hover .meta-reveal {
  opacity: 1;
  transform: translateY(0);
}

/* ── Section header with editorial number ── */
.section-number {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--color-gold);
  letter-spacing: 0.1em;
  opacity: 0.7;
}

/* ── Loader ── */
@keyframes editorSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.editor-loader {
  width: 28px; height: 28px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: editorSpin 1s linear infinite;
}

/* ── Cursor ripple ── */
@keyframes rippleOut {
  from { transform: translate(-50%,-50%) scale(0); opacity: 0.35; }
  to   { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
}
.cursor-ripple {
  position: fixed;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(181, 135, 60, 0.15);
  pointer-events: none;
  animation: rippleOut 0.65s ease-out forwards;
  z-index: 9999;
}

/* ── Sticky sidebar ── */
.sticky-rail {
  position: sticky;
  top: 5.5rem;
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
.sticky-rail::-webkit-scrollbar { width: 3px; }
.sticky-rail::-webkit-scrollbar-track { background: transparent; }
.sticky-rail::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

/* ── Spacing rhythm ── */
.spacing-rhythm-tight  { gap: 1rem; }
.spacing-rhythm-loose  { gap: 3rem; }
.spacing-cozy          { gap: 1.5rem; }
.spacing-generous      { gap: 2.5rem; }
