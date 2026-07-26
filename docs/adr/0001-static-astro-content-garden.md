# ADR 0001: Static Astro content garden

## Status

Accepted.

## Decision

Use Astro + MDX + TypeScript with content collections for all public content. Publish static output through GitHub Actions Pages. Keep content queries, media metadata and legacy redirects in testable modules rather than page-local file-system assumptions.

## Consequences

- Content is versioned in Git and publishable without a hosted CMS.
- Pagefind runs after the static build for CJK-capable search.
- The existing generated Hexo output is preserved separately as `legacy-hexo-static`; it is not a source dependency.
