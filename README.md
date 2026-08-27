# Stanislav Sorokin — Unity Portfolio

Explore-first portfolio for a Senior Unity Developer / Technical Lead. The site presents selected mobile, multiplayer, educational and console-porting work with searchable, multi-axis project filters and contribution-focused detail views.

## Stack

- React 19 + TypeScript
- Vite
- Plain CSS design system
- Playwright smoke and responsive checks

## Local development

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
node qa.mjs
```

The QA script checks the desktop and mobile layouts, horizontal overflow, card count, filters, dialog behavior, Escape handling, image loading and browser console errors.

## Content model

Project data is maintained in `src/projects.ts`. Contribution wording distinguishes CV-backed work, owner-attested publisher work and GrandDevs team-portfolio references. Before public launch, review every `My contribution` statement and replace any team-level wording with precise personal scope where additional evidence is available.

## Source assets

Screenshots and key art originate from the linked project, publisher and team portfolio pages. Source URLs are kept in each project record and in the asset manifest. Confirm redistribution/marketing rights before deploying to a public production domain.
