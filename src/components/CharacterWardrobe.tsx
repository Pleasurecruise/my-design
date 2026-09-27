import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../lib/i18n";
import { CharacterArtwork } from "./CharacterArtwork";

export function CharacterWardrobe({ onPreview }: { onPreview: (id: string) => void }) {
  const { oc } = useContent();
  const [outfitId, setOutfitId] = useState(oc.wardrobe.current.artwork.id);
  const outfits = [oc.wardrobe.current.artwork, ...oc.wardrobe.alternates];
  const outfit = outfits.find((item) => item.id === outfitId);
  if (!outfit) throw new Error(`Unknown outfit: ${outfitId}`);
  const alternate = oc.wardrobe.alternates.find((item) => item.id === outfitId);
  return (
    <>
      <div className="character-switcher" role="group" aria-label={oc.wardrobe.selectorLabel}>
        {outfits.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={item.id === outfitId}
            onClick={() => setOutfitId(item.id)}
          >
            <span className="annotation">OF-0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className="character-outfit-stage">
        <CharacterArtwork artwork={outfit} onPreview={onPreview} />
        <div className="character-outfit-copy">
          <p className="eyebrow">WRD-02 / OF-0{outfits.indexOf(outfit) + 1}</p>
          <h3>{alternate?.title ?? oc.wardrobe.current.title}</h3>
          <p>{alternate?.description ?? oc.wardrobe.current.description}</p>
          {!alternate && (
            <dl className="character-appearance">
              {oc.wardrobe.current.details.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="character-text-link" href={outfit.src} target="_blank" rel="noreferrer">
            {oc.openImage}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
