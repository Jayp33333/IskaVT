import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PlayCircle,
  X,
} from "lucide-react";
import {
  findGuideArticle,
  getGuideCategories,
  getTourStepIndex,
  type GuideArticle,
  type GuideCategory,
} from "../../../data/campusGuideBook";
import { getGuideArticlePreview } from "../../../data/guideArticlePreviews";
import { useIsMobileDevice } from "../../../hooks/useIsMobileDevice";
import useWorld from "../../../hooks/useWorld";
import { GuidePreviewFrame, GuideTopicIcon } from "./GuidePreviewFrame";

type MobilePane = "topics" | "article";

export function CampusGuideBook() {
  const isMobile = useIsMobileDevice();
  const guideBookOpen = useWorld((s) => s.guideBookOpen);
  const guideBookFocus = useWorld((s) => s.guideBookFocus);
  const closeGuideBook = useWorld((s) => s.closeGuideBook);
  const openTourCoachFull = useWorld((s) => s.openTourCoachFull);
  const openTourCoachStep = useWorld((s) => s.openTourCoachStep);
  const requestOpenSettings = useWorld((s) => s.requestOpenSettings);

  const categories = useMemo(() => getGuideCategories(isMobile), [isMobile]);

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "basics");
  const [articleId, setArticleId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePane>("topics");
  const [isLandscapeCompact, setIsLandscapeCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape) and (max-height: 768px)");
    const update = () => setIsLandscapeCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const activeCategory: GuideCategory | undefined =
    categories.find((c) => c.id === categoryId) ?? categories[0];
  const activeArticle: GuideArticle | null =
    activeCategory?.articles.find((a) => a.id === articleId) ??
    activeCategory?.articles[0] ??
    null;

  const activePreview = useMemo(() => {
    if (!activeArticle || !activeCategory) return null;
    return getGuideArticlePreview(activeArticle.id, activeCategory.id);
  }, [activeArticle, activeCategory]);

  const articleIndex = activeCategory?.articles.findIndex(
    (a) => a.id === activeArticle?.id,
  ) ?? 0;
  const articleCount = activeCategory?.articles.length ?? 0;

  useEffect(() => {
    if (!guideBookOpen) return;

    const focus = findGuideArticle(
      isMobile,
      guideBookFocus?.categoryId,
      guideBookFocus?.articleId,
    );
    if (focus) {
      setCategoryId(focus.categoryId);
      setArticleId(focus.article.id);
      setMobilePane("article");
      return;
    }

    setCategoryId(categories[0]?.id ?? "basics");
    setArticleId(categories[0]?.articles[0]?.id ?? null);
    setMobilePane("topics");
  }, [guideBookOpen, guideBookFocus, isMobile, categories]);

  useEffect(() => {
    if (!guideBookOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobile && !isLandscapeCompact && mobilePane === "article") {
          setMobilePane("topics");
          return;
        }
        closeGuideBook();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [guideBookOpen, closeGuideBook, isMobile, isLandscapeCompact, mobilePane]);

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    const next = categories.find((c) => c.id === id);
    setArticleId(next?.articles[0]?.id ?? null);
    setMobilePane("topics");
  };

  const handleArticleSelect = (id: string) => {
    setArticleId(id);
    setMobilePane("article");
  };

  const goToArticle = useCallback(
    (offset: number) => {
      if (!activeCategory) return;
      const nextIndex = Math.max(
        0,
        Math.min(activeCategory.articles.length - 1, articleIndex + offset),
      );
      const next = activeCategory.articles[nextIndex];
      if (next) {
        setArticleId(next.id);
        setMobilePane("article");
      }
    },
    [activeCategory, articleIndex],
  );

  const handleShowInTour = () => {
    if (!activeArticle?.tourStepId) return;
    closeGuideBook();
    openTourCoachStep(getTourStepIndex(activeArticle.tourStepId, isMobile));
  };

  const handleOpenSettings = () => {
    if (!activeArticle?.settingsTab) return;
    closeGuideBook();
    requestOpenSettings(activeArticle.settingsTab);
  };

  const handleFullTour = () => {
    closeGuideBook();
    openTourCoachFull();
  };

  if (typeof document === "undefined" || !activeCategory || !activeArticle || !activePreview) {
    return null;
  }

  const useStackedMobile = isMobile && !isLandscapeCompact;
  const showTopicList = !useStackedMobile || mobilePane === "topics";
  const showArticle = !useStackedMobile || mobilePane === "article";
  const hasActions = !!(activeArticle.tourStepId || activeArticle.settingsTab);

  return createPortal(
    <AnimatePresence>
      {guideBookOpen && (
        <motion.div
          className="guide-book-overlay fixed inset-0 z-[2250] flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="campus-guide-title"
          onClick={closeGuideBook}
        >
          <motion.div
            className="guide-book-shell flex w-full max-w-[min(100%,52rem)] flex-col overflow-hidden border border-ink"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 30, stiffness: 360 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guide-book-handle mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-ink/20" aria-hidden />

            <header className="guide-book-header relative flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink bg-gold [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7">
                  <BookOpen className="h-3.5 w-3.5 text-maroon" strokeWidth={2.75} />
                </span>
                <div className="min-w-0">
                  <h2
                    id="campus-guide-title"
                    className="truncate text-sm font-black italic text-white sm:text-base [@media(max-height:500px)]:text-xs"
                  >
                    Campus Guide
                  </h2>
                  {showArticle && (
                    <p className="mt-0.5 truncate text-[9px] font-semibold text-white/70 [@media(max-height:500px)]:text-[8px]">
                      {activeCategory.label}
                      <span className="mx-1.5 text-white/35">·</span>
                      {articleIndex + 1} of {articleCount}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closeGuideBook}
                className="shrink-0 rounded-xl border border-ink bg-white p-2 text-ink transition-all hover:bg-cream active:scale-95 [@media(max-height:500px)]:p-1.5"
                aria-label="Close campus guide"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </header>

            <div className="guide-book-body flex min-h-0 flex-1 flex-col lg:flex-row">
              <nav
                className="guide-book-category-rail flex shrink-0 gap-1 overflow-x-auto p-1.5 lg:w-[7.5rem] lg:flex-col lg:overflow-y-auto lg:p-2 [@media(max-height:500px)]:p-1"
                aria-label="Guide categories"
              >
                {categories.map(({ id, label, icon: Icon }) => {
                  const active = categoryId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleCategorySelect(id)}
                      aria-current={active ? "true" : undefined}
                      className={`guide-book-category-btn flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-all lg:w-full [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1 ${
                        active
                          ? "guide-book-category-btn-active"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors [@media(max-height:500px)]:h-5 [@media(max-height:500px)]:w-5 ${
                          active
                            ? "border-ink bg-white text-maroon"
                            : "border-white/20 bg-white/10 text-gold"
                        }`}
                      >
                        <Icon className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="guide-book-category-label whitespace-nowrap text-[9px] font-black uppercase tracking-wide lg:whitespace-normal lg:leading-tight [@media(max-height:500px)]:text-[8px]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="guide-book-inner-columns flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
                <aside
                  className={`guide-book-topics flex min-h-0 flex-col md:w-36 md:shrink-0 lg:w-[9.5rem] ${
                    showTopicList ? "flex" : "hidden md:flex"
                  }`}
                >
                  <ul className="min-h-0 flex-1 overflow-y-auto p-2 custom-scrollbar [@media(max-height:500px)]:p-1.5">
                    {activeCategory.articles.map((article) => {
                      const selected = article.id === activeArticle.id;
                      const preview = getGuideArticlePreview(
                        article.id,
                        activeCategory.id,
                      );
                      return (
                        <li key={article.id} className="mb-1 last:mb-0">
                          <button
                            type="button"
                            onClick={() => handleArticleSelect(article.id)}
                            aria-current={selected ? "true" : undefined}
                            className={`guide-book-topic-btn flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all [@media(max-height:500px)]:gap-1.5 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1 ${
                              selected ? "guide-book-topic-btn-active" : ""
                            }`}
                          >
                            <GuideTopicIcon icon={preview.icon} active={selected} />
                            <span className="min-w-0 flex-1 text-[10px] font-bold leading-snug text-ink [@media(max-height:500px)]:text-[9px]">
                              {article.title}
                            </span>
                            <ChevronRight
                              className={`h-3 w-3 shrink-0 md:hidden ${
                                selected ? "text-maroon" : "text-ink/20"
                              }`}
                              strokeWidth={2.5}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </aside>

                <section
                  className={`flex min-h-0 min-w-0 flex-1 flex-col ${
                    showArticle ? "flex" : "hidden md:flex"
                  }`}
                >
                  {useStackedMobile && mobilePane === "article" && (
                    <button
                      type="button"
                      onClick={() => setMobilePane("topics")}
                      className="flex shrink-0 items-center gap-2 border-b border-ink/10 bg-white/60 px-4 py-2.5 text-left text-[11px] font-bold text-maroon md:hidden [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[10px]"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                      All topics
                    </button>
                  )}

                  <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeArticle.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                        className="guide-book-article-layout flex h-full flex-col items-center p-3 sm:p-4 [@media(max-height:500px)]:p-2"
                      >
                        <GuidePreviewFrame preview={activePreview}>
                          <div className="mb-2 flex items-start justify-between gap-1.5">
                            <h3 className="text-sm font-black leading-snug text-ink [@media(max-height:500px)]:text-xs">
                              {activeArticle.title}
                            </h3>
                            <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
                              <button
                                type="button"
                                onClick={() => goToArticle(-1)}
                                disabled={articleIndex <= 0}
                                className="guide-book-nav-btn rounded-md border border-ink p-1 disabled:opacity-30"
                                aria-label="Previous topic"
                              >
                                <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => goToArticle(1)}
                                disabled={articleIndex >= articleCount - 1}
                                className="guide-book-nav-btn rounded-md border border-ink p-1 disabled:opacity-30"
                                aria-label="Next topic"
                              >
                                <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] leading-relaxed text-ink/80 [@media(max-height:500px)]:text-[10px]">
                            {activeArticle.body}
                          </p>

                          {hasActions && (
                            <div className="mt-2 flex flex-wrap gap-1.5 border-t border-ink/10 pt-2 [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:pt-1.5">
                              {activeArticle.tourStepId && (
                                <button
                                  type="button"
                                  onClick={handleShowInTour}
                                  className="guide-book-action-primary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide sm:flex-none [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[8px]"
                                >
                                  <PlayCircle className="h-3 w-3" strokeWidth={2.5} />
                                  Show in tour
                                </button>
                              )}
                              {activeArticle.settingsTab && (
                                <button
                                  type="button"
                                  onClick={handleOpenSettings}
                                  className="guide-book-action-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide sm:flex-none [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[8px]"
                                >
                                  <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                                  Open settings
                                </button>
                              )}
                            </div>
                          )}
                        </GuidePreviewFrame>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              </div>
            </div>

            <footer className="guide-book-footer shrink-0 px-4 py-3 sm:px-5 [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2.5">
              <button
                type="button"
                onClick={handleFullTour}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink bg-maroon px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white transition-all hover:bg-maroon/90 active:translate-y-0.5 [@media(max-height:500px)]:py-2.5 [@media(max-height:500px)]:text-[10px]"
              >
                <PlayCircle className="h-4 w-4" strokeWidth={2.5} />
                Start full guided tour
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
