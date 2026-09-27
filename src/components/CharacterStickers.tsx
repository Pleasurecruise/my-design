import { ArrowUpRight } from "lucide-react";
import { useContent } from "../lib/i18n";
import { CharacterArtwork } from "./CharacterArtwork";
import type { Artwork } from "./CharacterArtwork";

export function CharacterStickers({
  stickers,
  onPreview,
}: {
  stickers: Artwork[];
  onPreview: (id: string) => void;
}) {
  const { oc } = useContent();
  return (
    <>
      <p>{oc.stickers.description}</p>
      <a className="character-text-link" href={oc.stickers.src} target="_blank" rel="noreferrer">
        {oc.stickers.sheetLink}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <div className="character-sticker-grid">
        {stickers.map((sticker) => (
          <CharacterArtwork key={sticker.id} artwork={sticker} onPreview={onPreview} />
        ))}
      </div>
    </>
  );
}
