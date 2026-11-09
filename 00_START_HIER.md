# Family Spots Map V4.1 – Einspielen ohne Neustart

**Verbindliche Quelle:** `Family-Spots-Map-V4-Neu-main.zip`, Stand 09.11.2026.  
**Neues Release:** `20261109-fusion-v4-about-1`.  
**Repository für diesen Schritt:** `HeimHafen/Family-Spots-Map-V4-Neu`, Branch `main`.

## Genau dieses bestehende Repository aktualisieren

1. Das alte ZIP und deinen bisherigen GitHub-Stand als Sicherung aufbewahren. **Kein Repository löschen.**
2. Das vollständige aktualisierte ZIP in der Dateien-App teilen → **Working Copy** → **Archiv entpacken**, Ziel `Family-Spots-Map-V4-Neu` (Repo-Wurzel). **Nicht** die ZIP-Datei selbst als Einzeldatei importieren.
3. In Working Copy die Änderungsliste kontrollieren: neue Datei `css/fsm-about-premium-v4.css`, geänderte dreisprachige HTML-Einstiege, Cache-/Versionsdateien und aktualisierte Projektdokumentation. **Keine 27-MB-ZIP committen.**
4. Commit auf lokalem `main` erstellen und per SSH zu `origin/main` pushen, **Force Push: AUS**.
5. GitHub Pages im **neuen Repository** unter *Settings → Pages → Deploy from a branch → main → /(root)* aktiviert lassen.
6. Neue Testadresse öffnen: https://heimhafen.github.io/Family-Spots-Map-V4-Neu/ – „Über Family Spots Map“ in DE/EN/DA kontrollieren, „Zur Karte“ ausprobieren. Echte iOS- und Android-Tests bleiben erforderlich.

Die bisherige öffentliche Adresse https://heimhafen.github.io/Family-Spots-Map/ gehört zu einem **anderen Repository** und ändert sich durch diesen Push **nicht**.

## Änderungen in V4.1

- Der Informationsbereich verwendet die warme Landschaft, die typografische Hierarchie und die Abstände der V4-Startansicht.
- Lange harte Zeilenumbrüche wurden durch natürliches, responsives Zeilenlayout ersetzt.
- Sieben Informationsabschnitte pro Sprache sind in gut lesbare, warme Karten gegliedert.
- Der „Zur Karte“-Button bleibt an der bestehenden Navigation angebunden und folgt der gewählten Sprache.
- Informationen zu Plus-Partnerzugängen sind ausdrücklich als zukünftige Möglichkeit formuliert.
- Offline-Cache und Release-Prüfsummen sind an diese Änderung angepasst.
- Für die schon gewählte branchbasierte GitHub-Pages-Veröffentlichung läuft kein zweiter automatischer Deployment-Workflow mehr; CI-Prüfungen bleiben aktiv.

**Unverändert:** Spotdaten und 173 IDs, Kartenoberfläche, Tilla, Herz, Filter, Plus-Freischaltlogik, Tagebuch und Kalenderdatenformate. Diese Prüfung bestätigt keine unabhängige Vor-Ort-Kontrolle der Spots.
