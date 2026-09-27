import { useContent } from "../lib/i18n";
export type Artwork = {
  id: string;
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  crop?: { x: number; y: number; width: number; height: number };
};

export function ArtworkImage({ artwork, fitted = false }: { artwork: Artwork; fitted?: boolean }) {
  if (artwork.crop) {
    const crop = artwork.crop;
    return (
      <div
        className="character-sticker-cell"
        style={{
          aspectRatio: `${crop.width} / ${crop.height}`,
          width: fitted ? `${Math.min(1, crop.width / crop.height) * 92}%` : undefined,
        }}
      >
        <img
          src={artwork.src}
          alt={artwork.alt}
          width={artwork.width}
          height={artwork.height}
          loading="lazy"
          style={{
            left: `${(-crop.x / crop.width) * 100}%`,
            top: `${(-crop.y / crop.height) * 100}%`,
            width: `${(artwork.width / crop.width) * 100}%`,
            height: `${(artwork.height / crop.height) * 100}%`,
          }}
        />
      </div>
    );
  }
  return (
    <img
      src={artwork.src}
      alt={artwork.alt}
      width={artwork.width}
      height={artwork.height}
      loading="lazy"
    />
  );
}

export function CharacterArtwork({
  artwork,
  onPreview,
}: {
  artwork: Artwork;
  onPreview: (id: string) => void;
}) {
  const { oc } = useContent();
  return (
    <figure>
      <button
        className="character-artwork-button"
        onClick={() => onPreview(artwork.id)}
        aria-label={`${oc.viewer.preview} · ${artwork.title}`}
      >
        <ArtworkImage artwork={artwork} fitted />
      </button>
      <figcaption>{artwork.title}</figcaption>
    </figure>
  );
}
