import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useContent } from "../lib/i18n";
import { Modal } from "./Modal";
import { IconButton } from "./IconButton";
import { ArtworkImage } from "./CharacterArtwork";
import type { Artwork } from "./CharacterArtwork";

export function CharacterViewer({
  artworks,
  selectedId,
  onSelect,
  onClose,
}: {
  artworks: Artwork[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { oc } = useContent();
  const index = artworks.findIndex((item) => item.id === selectedId);
  const artwork = artworks[index];
  if (!artwork) throw new Error(`Unknown artwork: ${selectedId}`);
  function move(direction: number) {
    const next = artworks[(index + direction + artworks.length) % artworks.length];
    if (next) onSelect(next.id);
  }
  return (
    <Modal
      title={artwork.title}
      onClose={onClose}
      className={artwork.crop ? "character-viewer character-viewer--sticker" : "character-viewer"}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className="character-lightbox" data-sticker={Boolean(artwork.crop)}>
        {artwork.crop ? (
          <div className="character-sticker-preview">
            <ArtworkImage artwork={artwork} fitted />
          </div>
        ) : (
          <ArtworkImage artwork={artwork} />
        )}
        <div className="character-lightbox-controls">
          <IconButton icon={ArrowLeft} label={oc.viewer.previous} onClick={() => move(-1)} />
          <span className="annotation">
            {index + 1} / {artworks.length}
          </span>
          <IconButton icon={ArrowRight} label={oc.viewer.next} onClick={() => move(1)} />
          <a href={artwork.src} target="_blank" rel="noreferrer">
            {artwork.crop ? oc.stickers.sheetLink : oc.openImage}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
