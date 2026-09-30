import { useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { withBase } from "@/lib/paths";

interface EmbedClipProps {
  /** Player URL without autoplay; the dialog adds it when opened. */
  src: string;
  poster: string;
  alt: string;
}

/**
 * Landscape third-party clip shown as a 9:16 cover like the self-hosted
 * clips. The player can't be cropped to that shape, so it opens full size in
 * a dialog and is only loaded once someone asks to watch.
 */
export function EmbedClip({ src, poster, alt }: EmbedClipProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const playerSrc = `${src}${src.includes("?") ? "&" : "?"}autoplay=1`;

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="community-videos__cover" onClick={show}>
        <img src={withBase(poster)} alt="" width={600} height={1067} loading="lazy" />
        <span className="community-videos__play" aria-hidden="true">
          <Play size={28} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="visually-hidden">Play video: {alt}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="video-dialog"
        aria-label={alt}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button type="button" className="video-dialog__close" onClick={close} aria-label="Close video">
          <X size={24} />
        </button>
        <div className="video-dialog__frame">
          {open && (
            <iframe
              src={playerSrc}
              title={alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </dialog>
    </>
  );
}
