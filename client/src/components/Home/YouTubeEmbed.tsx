type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
};

export function YouTubeEmbed({
  videoId,
  title = "YouTube video",
}: YouTubeEmbedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[6px_6px_0px_0px_rgba(128,0,0,1)] sm:rounded-3xl sm:border-4">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
