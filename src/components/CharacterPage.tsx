import { useState } from "react";
import { useContent } from "../lib/i18n";
import { CharacterArtwork } from "./CharacterArtwork";
import { CharacterViewer } from "./CharacterViewer";
import { CharacterWardrobe } from "./CharacterWardrobe";
import { CharacterStickers } from "./CharacterStickers";

export function CharacterPage() {
  const { oc } = useContent();
  const [selection, setSelection] = useState<{
    collection: "wardrobe" | "gallery" | "stickers";
    id: string;
  } | null>(null);
  const collections = {
    wardrobe: [oc.wardrobe.current.artwork, ...oc.wardrobe.alternates],
    gallery: [...oc.gallery.scenes, ...oc.referenceViews, oc.gallery.details],
    stickers: oc.stickers.items.map((item) => ({
      ...item,
      src: oc.stickers.src,
      width: oc.stickers.width,
      height: oc.stickers.height,
    })),
  };
  return (
    <div className="character-page">
      <div className="character-overview">
        <header className="character-intro">
          <p className="eyebrow">{oc.eyebrow}</p>
          <h1>{oc.title}</h1>
          <p className="character-description">{oc.description}</p>
          <section className="character-profile" aria-labelledby="character-profile-title">
            <h2 id="character-profile-title">{oc.profileTitle}</h2>
            <dl className="character-facts">
              {oc.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </header>
        <figure className="character-portrait">
          <a
            href={oc.portrait.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${oc.openImage} · ${oc.portrait.caption}`}
          >
            <img
              src={oc.portrait.src}
              alt={oc.portrait.alt}
              width={oc.portrait.width}
              height={oc.portrait.height}
            />
          </a>
          <figcaption>{oc.portrait.caption}</figcaption>
        </figure>
      </div>
      {oc.chapters.map((chapter) => (
        <section
          className="character-chapter"
          id={chapter.id}
          aria-labelledby={`${chapter.id}-title`}
          key={chapter.id}
        >
          <header className="character-chapter-heading">
            <div>
              <p className="eyebrow">{chapter.code}</p>
              <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            </div>
            <p>{chapter.description}</p>
          </header>
          {chapter.id === "oc-identity" && (
            <>
              <div className="character-detail">
                <h3>{oc.appearanceTitle}</h3>
                <dl className="character-appearance">
                  {oc.appearance.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.text}</dd>
                    </div>
                  ))}
                </dl>
                <details className="character-habits">
                  <summary>{oc.habitsTitle}</summary>
                  <ul>
                    {oc.habits.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </details>
              </div>
              <section className="character-notes" aria-labelledby="character-personality-title">
                <div className="character-notes-heading">
                  <h3 id="character-personality-title">{oc.personalityTitle}</h3>
                  <h3>{oc.momentsTitle}</h3>
                </div>
                {oc.personality.map((item) => (
                  <article className="character-note-pair" key={item.id}>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                    <div>
                      <h4>{item.sceneTitle}</h4>
                      <p>{item.scene}</p>
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}
          {chapter.id === "oc-wardrobe" && (
            <CharacterWardrobe onPreview={(id) => setSelection({ collection: "wardrobe", id })} />
          )}
          {chapter.id === "oc-gallery" && (
            <div className="character-gallery">
              <div className="character-gallery-section">
                <h3>{oc.gallery.scenesTitle}</h3>
                <div className="character-scenes">
                  {oc.gallery.scenes.map((artwork) => (
                    <CharacterArtwork
                      key={artwork.id}
                      artwork={artwork}
                      onPreview={(id) => setSelection({ collection: "gallery", id })}
                    />
                  ))}
                </div>
              </div>
              <div className="character-gallery-section">
                <h3>{oc.gallery.viewsTitle}</h3>
                <div className="character-reference-grid">
                  {oc.referenceViews.map((artwork) => (
                    <CharacterArtwork
                      key={artwork.id}
                      artwork={artwork}
                      onPreview={(id) => setSelection({ collection: "gallery", id })}
                    />
                  ))}
                </div>
              </div>
              <div className="character-gallery-section">
                <h3>{oc.gallery.detailsTitle}</h3>
                <CharacterArtwork
                  artwork={oc.gallery.details}
                  onPreview={(id) => setSelection({ collection: "gallery", id })}
                />
              </div>
            </div>
          )}
          {chapter.id === "oc-stickers" && (
            <CharacterStickers
              stickers={collections.stickers}
              onPreview={(id) => setSelection({ collection: "stickers", id })}
            />
          )}
        </section>
      ))}
      {selection && (
        <CharacterViewer
          artworks={collections[selection.collection]}
          selectedId={selection.id}
          onSelect={(id) => setSelection({ ...selection, id })}
          onClose={() => setSelection(null)}
        />
      )}
    </div>
  );
}
