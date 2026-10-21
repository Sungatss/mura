"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { accessCopy } from "@/data/demo-access-translations";
import { clearDemoProfile, saveDemoProfile, useDemoProfile } from "@/lib/demo-profile";
import type { Locale } from "@/lib/i18n";

export function DemoProfileMenu({ locale }: { locale: Locale }) {
  const profile = useDemoProfile();
  const [open, setOpen] = useState(false);
  const [draftRu, setDraftRu] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const copy = accessCopy[locale];

  useEffect(() => {
    if (!open) return;
    function closeOnOutside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  if (!profile) return null;

  function saveRu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDemoProfile({ ...profile!, ru: draftRu.trim() });
    setOpen(false);
  }

  return <div className="profile-menu" ref={menuRef}>
    <button type="button" className="profile-trigger" aria-expanded={open} aria-controls="demo-profile-menu"
      aria-label={`${copy.profile}: ${profile.name}`} onClick={() => { setDraftRu(profile.ru); setOpen((current) => !current); }}>
      <span className="profile-avatar" aria-hidden="true">{profile.name.slice(0, 1).toLocaleUpperCase()}</span><span className="profile-name">{profile.name}</span>
    </button>
    {open && <div id="demo-profile-menu" className="profile-popover">
      <span className="profile-kicker">{copy.profile}</span><strong>{profile.name}</strong>
      <p>{profile.ru ? `${copy.ru}: ${profile.ru}` : copy.noRu}</p>
      <form onSubmit={saveRu}><label>{copy.editRu}<input type="text" value={draftRu} onChange={(event) => setDraftRu(event.target.value)} maxLength={60} placeholder={copy.ruPlaceholder} /></label>
        <button type="submit" className="profile-save">{copy.save}</button></form>
      <p className="profile-disclaimer">{copy.ruNote}</p>
      <button type="button" className="profile-signout" onClick={clearDemoProfile}>{copy.signOut}</button>
    </div>}
  </div>;
}
