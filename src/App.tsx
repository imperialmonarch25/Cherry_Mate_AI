import { useEffect, useRef, useState, type ReactNode } from "react";

type BubbleButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "quiet" | "light";
  className?: string;
  type?: "button" | "submit";
  "aria-pressed"?: boolean;
  "aria-label"?: string;
};

type FullscreenIframe = HTMLIFrameElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitCancelFullScreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

function getFullscreenElement(doc: FullscreenDocument) {
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  );
}

function requestIframeFullscreen(frame: HTMLIFrameElement) {
  if (frame.requestFullscreen) return frame.requestFullscreen();

  const prefixedFrame = frame as FullscreenIframe;
  if (prefixedFrame.webkitRequestFullscreen) return prefixedFrame.webkitRequestFullscreen();
  if (prefixedFrame.webkitRequestFullScreen) return prefixedFrame.webkitRequestFullScreen();
  if (prefixedFrame.mozRequestFullScreen) return prefixedFrame.mozRequestFullScreen();
  if (prefixedFrame.msRequestFullscreen) return prefixedFrame.msRequestFullscreen();
}

function canRequestIframeFullscreen(frame: HTMLIFrameElement) {
  const prefixedFrame = frame as FullscreenIframe;
  return Boolean(
    frame.requestFullscreen ||
      prefixedFrame.webkitRequestFullscreen ||
      prefixedFrame.webkitRequestFullScreen ||
      prefixedFrame.mozRequestFullScreen ||
      prefixedFrame.msRequestFullscreen,
  );
}

function exitDocumentFullscreen(doc: FullscreenDocument) {
  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.webkitCancelFullScreen) return doc.webkitCancelFullScreen();
  if (doc.mozCancelFullScreen) return doc.mozCancelFullScreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
}

function canExitDocumentFullscreen(doc: FullscreenDocument) {
  return Boolean(
    doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.webkitCancelFullScreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen,
  );
}

function BubbleButton({
  children,
  href,
  onClick,
  variant = "quiet",
  className = "",
  type = "button",
  ...ariaProps
}: BubbleButtonProps) {
  const classes = `bubble-button bubble-${variant} ${className}`;

  if (href) {
    return (
      <a className={classes} href={href} {...ariaProps}>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} {...ariaProps}>
      <span>{children}</span>
    </button>
  );
}

const featureGroups = [
  {
    id: "check-ins",
    icon: "☼",
    title: "Emotional & energy check-ins",
    description:
      "Notice what is here without judging it. Five mood chips, a gentle 1–5 energy slider, and one small daily intention make space for how today actually feels.",
    tools: ["Mood check-in", "Energy 1–5", "Daily intention"],
  },
  {
    id: "grounding",
    icon: "◌",
    title: "Calming & grounding tools",
    description:
      "Follow a one-minute breathing orb, move through the 5–4–3–2–1 sensory path, or choose a short self-care or quiet-focus timer that fits your moment.",
    tools: ["Breathing orb", "5–4–3–2–1 path", "2 / 5 / 10 min self-care", "1–15 min focus"],
  },
  {
    id: "reflection",
    icon: "✧",
    title: "Guided reflection & private notes",
    description:
      "A supportive reflection chat, themed affirmations, up to three gratitude notes, and a private journal saved locally in your browser help you make room for your thoughts.",
    tools: ["Cherry Mate chat", "Affirmation Temple", "Gratitude Papyrus", "Device-local journal"],
  },
  {
    id: "mindful-breaks",
    icon: "𓂀",
    title: "Low-pressure mindful breaks",
    description:
      "Try a symbol-matching memory game, a 30-second Stargazer pause, or a tiny ancient Egypt quiz. There are no scores to chase—just a moment to reset.",
    tools: ["Calm Quest", "30-second Stargazer", "Mini wisdom quiz"],
  },
];

function App() {
  const [activeFeature, setActiveFeature] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [launchStatus, setLaunchStatus] = useState("");
  const sanctuaryRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = getFullscreenElement(document as FullscreenDocument) === iframeRef.current;
      setIsFullscreen(fullscreen);
      setLaunchStatus(
        fullscreen
          ? "The sanctuary HTML is fullscreen. Press Esc to return to the showcase."
          : "Sanctuary fullscreen closed. The showcase is ready below.",
      );
    };

    const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];
    events.forEach((event) => document.addEventListener(event, handleFullscreenChange));
    return () => events.forEach((event) => document.removeEventListener(event, handleFullscreenChange));
  }, []);

  const enterFullscreen = () => {
    const frame = iframeRef.current;
    if (!frame) {
      setIsExpanded(true);
      setLaunchStatus("The sanctuary is still loading. Use the spacious preview below or try fullscreen again.");
      return;
    }

    try {
      if (!canRequestIframeFullscreen(frame)) {
        setIsExpanded(true);
        setLaunchStatus("This browser doesn't support fullscreen for the sanctuary. Use the spacious preview below.");
        return;
      }

      const request = requestIframeFullscreen(frame);
      void Promise.resolve(request).catch(() => {
        setIsExpanded(true);
        setLaunchStatus("Fullscreen was blocked. Use HTTPS and allow fullscreen for this site, or use the spacious preview.");
      });
    } catch {
      setIsExpanded(true);
      setLaunchStatus("Fullscreen was blocked. Use HTTPS and allow fullscreen for this site, or use the spacious preview.");
    }
  };

  const launchSanctuary = () => {
    setLaunchStatus("");
    enterFullscreen();
    setIsExpanded(true);
    sanctuaryRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const toggleFullscreen = () => {
    const doc = document as FullscreenDocument;
    if (getFullscreenElement(doc) === iframeRef.current) {
      if (!canExitDocumentFullscreen(doc)) {
        setLaunchStatus("Use Esc to exit sanctuary fullscreen in this browser.");
        return;
      }

      try {
        const exit = exitDocumentFullscreen(doc);
        void Promise.resolve(exit).catch(() => {
          setLaunchStatus("Couldn't close sanctuary fullscreen. Press Esc to return to the showcase.");
        });
      } catch {
        setLaunchStatus("Couldn't close sanctuary fullscreen. Press Esc to return to the showcase.");
      }
      return;
    }

    enterFullscreen();
  };

  const visibleFeatures =
    activeFeature === "all"
      ? featureGroups
      : featureGroups.filter((feature) => feature.id === activeFeature);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Cherry Mate home">
          <span className="wordmark-flower">✿</span>
          <span>cherry mate</span>
          <span className="wordmark-ai">AI</span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="#features">The little tools</a>
          <a href="#sanctuary">Live sanctuary</a>
        </nav>
        <BubbleButton href="#sanctuary" variant="light" className="nav-cta">
          Take a soft pause <span aria-hidden="true">↗</span>
        </BubbleButton>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span /> A little room to come back to yourself</div>
            <h1>
              Make space for
              <br />
              <em>how you feel.</em>
            </h1>
            <p className="hero-description">
              Cherry Mate is a moonlit mind sanctuary for gentle check-ins,
              grounding, and reflection. No fixing, no pressure—just small
              moments that belong to you.
            </p>
            <div className="hero-actions">
              <BubbleButton onClick={launchSanctuary} variant="primary" className="float-bubble">
                Launch sanctuary below <span aria-hidden="true">↓</span>
              </BubbleButton>
              <BubbleButton href="#features" variant="quiet">
                Explore the little tools <span aria-hidden="true">↘</span>
              </BubbleButton>
            </div>
            <div className="hero-note">
              <span className="note-star">✳</span> A supportive wellbeing project—not clinical therapy or diagnosis.
            </div>
          </div>
          <div className="moon-scene" aria-hidden="true">
            <div className="scene-stars">
              <i>✦</i><i>·</i><i>✧</i><i>·</i><i>✦</i><i>·</i><i>✧</i>
            </div>
            <div className="moon-halo"><div className="moon" /></div>
            <div className="dune dune-back" />
            <div className="pyramid pyramid-back" />
            <div className="pyramid pyramid-front" />
            <div className="dune dune-front" />
            <div className="scene-caption">𓋹 &nbsp; a softer place to land &nbsp; 𓋹</div>
          </div>
          <div className="hero-decoration" aria-hidden="true">✦</div>
        </section>

        <section className="intro-strip" aria-label="A gentle introduction">
          <div className="intro-mark">☾</div>
          <p>
            Some days call for a breath. Some days call for words. <strong>Start wherever you are.</strong>
          </p>
          <div className="intro-line" />
          <span className="intro-caption">A QUIET MOMENT, JUST FOR YOU</span>
        </section>

        <section className="features-section section-wrap" id="features">
          <div className="section-heading">
            <div>
              <div className="eyebrow dark-eyebrow"><span /> A small toolkit for real life</div>
              <h2>Find the kind of pause<br /><em>you need today.</em></h2>
            </div>
            <p>
              Each tool is an invitation, not an instruction. Browse a little,
              choose one, or simply keep scrolling.
            </p>
          </div>

          <div className="feature-filter" aria-label="Filter feature highlights">
            <BubbleButton
              variant={activeFeature === "all" ? "primary" : "light"}
              onClick={() => setActiveFeature("all")}
              aria-pressed={activeFeature === "all"}
            >
              All little tools
            </BubbleButton>
            {featureGroups.map((feature) => (
              <BubbleButton
                key={feature.id}
                variant={activeFeature === feature.id ? "primary" : "light"}
                onClick={() => setActiveFeature(feature.id)}
                aria-pressed={activeFeature === feature.id}
              >
                {feature.title}
              </BubbleButton>
            ))}
          </div>

          <div className={`feature-grid ${visibleFeatures.length === 1 ? "single-feature" : ""}`}>
            {visibleFeatures.map((feature, index) => (
              <article className="feature-card" key={feature.id}>
                <div className="feature-card-top">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-index">0{featureGroups.indexOf(feature) + 1}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="tool-pills">
                  {feature.tools.map((tool) => (
                    <span className="tool-pill" key={tool}>{tool}</span>
                  ))}
                </div>
                <a className="card-link" href="#sanctuary">
                  Try this in the sanctuary <span aria-hidden="true">↗</span>
                </a>
                <span className="card-watermark" aria-hidden="true">{index === 0 ? "✧" : "◌"}</span>
              </article>
            ))}
          </div>
          <div className="features-footnote">
            <span>✦</span> Your pace is the right pace. You can leave any exercise at any time.
          </div>
        </section>

        <section className="sanctuary-section" id="sanctuary" ref={sanctuaryRef}>
          <div className="sanctuary-heading section-wrap">
            <div>
              <div className="eyebrow"><span /> Step inside</div>
              <h2>The Moonlit Mind<br /><em>Sanctuary</em></h2>
              <p>
                Explore the original Cherry Mate experience right here. Your
                journal and saved notes stay in this browser on this device.
              </p>
            </div>
            <div className="sanctuary-side-note">
              <div className="side-note-orbit">✧</div>
              <span>Take what helps.<br />Leave the rest.</span>
            </div>
          </div>

          <div className={`sanctuary-frame section-wrap ${isExpanded ? "frame-expanded" : ""}`}>
            <div className="frame-toolbar">
              <div className="frame-label">
                <span className="live-dot" />
                <span>CHERRY MATE <b>·</b> LIVE PREVIEW</span>
              </div>
              <div className="frame-controls">
                <BubbleButton
                  variant="light"
                  href="#features"
                  className="frame-control"
                >
                  Feature guide <span aria-hidden="true">↑</span>
                </BubbleButton>
                <BubbleButton
                  variant="light"
                  onClick={() => setIsExpanded((expanded) => !expanded)}
                  className="frame-control"
                  aria-pressed={isExpanded}
                  aria-label={isExpanded ? "Collapse sanctuary view" : "Expand sanctuary view"}
                >
                  {isExpanded ? "Cozy view" : "Spacious view"} <span aria-hidden="true">{isExpanded ? "↙" : "↗"}</span>
                </BubbleButton>
                <BubbleButton
                  variant="light"
                  onClick={toggleFullscreen}
                  className="frame-control"
                  aria-pressed={isFullscreen}
                  aria-label={isFullscreen ? "Exit sanctuary fullscreen" : "Open sanctuary HTML fullscreen"}
                >
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen HTML"} <span aria-hidden="true">⛶</span>
                </BubbleButton>
              </div>
            </div>
            {launchStatus && <p className="launch-status" role="status">{launchStatus}</p>}
            <iframe
              ref={iframeRef}
              className="sanctuary-iframe"
              src="./cherry-mate-sanctuary.html"
              title="Interactive Cherry Mate AI Moonlit Egyptian Sanctuary"
              sandbox="allow-scripts allow-same-origin"
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
            />
            <div className="frame-footer">
              <span>Made for gentle pauses, not perfect ones.</span>
              <span>Scroll inside the frame to explore every tool <span aria-hidden="true">↓</span></span>
            </div>
          </div>
        </section>

        <section className="support-section section-wrap" id="support">
          <div className="support-icon" aria-hidden="true">♡</div>
          <div className="support-copy">
            <div className="eyebrow dark-eyebrow"><span /> You deserve real support, too</div>
            <h2>You don't have to<br /><em>hold it alone.</em></h2>
            <p>
              Cherry Mate is a supportive wellbeing project, not clinical
              therapy, diagnosis, or emergency care. If you feel unsafe or
              someone is hurting you, tell a trusted person and contact local
              emergency services. In India, call <strong>112</strong>.
            </p>
            <div className="privacy-note">
              <span>✧</span> Please avoid entering identifying or highly private information.
              Journal entries are stored locally in this browser.
            </div>
          </div>
          <div className="support-aside">
            <span className="aside-sun">☼</span>
            <p>Asking for help is a brave and human thing to do.</p>
            <BubbleButton href="#sanctuary" variant="quiet">
              Return to the sanctuary <span aria-hidden="true">↑</span>
            </BubbleButton>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-mark" href="#home">
          <span className="wordmark-flower">✿</span>
          <span>cherry mate</span>
          <span className="wordmark-ai">AI</span>
        </a>
        <span>A moonlit mind sanctuary · Made for softer moments</span>
        <a href="#home" className="back-top">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;
