import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselPhoto = {
  src: string;
  alt: string;
};

export function PhotoCarousel({ photos }: { photos: CarouselPhoto[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = setInterval(() => emblaApi.scrollNext(), 3000);
    return () => clearInterval(id);
  }, [emblaApi, paused]);

  return (
    <div
      className="photo-carousel__frame"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="photo-carousel__viewport" ref={emblaRef}>
        <div className="photo-carousel__track">
          {photos.map((p) => (
            <figure key={p.src} className="photo-carousel__slide">
              <img src={p.src} alt={p.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="photo-carousel__arrow photo-carousel__arrow--prev"
        aria-label="Previous photo"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="photo-carousel__arrow photo-carousel__arrow--next"
        aria-label="Next photo"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight size={26} strokeWidth={2.5} />
      </button>

      <div className="photo-carousel__dots">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={`photo-carousel__dot${i === selected ? " photo-carousel__dot--active" : ""}`}
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
