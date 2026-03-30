## Source Integrity

**Why:** The knowledge graph is only as trustworthy as its sources. A graph containing papers that were never fetched — inferred from titles, generated from memory, or fabricated — produces a catalog that cannot be trusted and citations that may not exist.

**How to apply:** Apply these rules whenever a paper is about to be stored in Neo4j or when a citation appears in a generated output.

---

### Rules

**1. No paper may be stored from title alone.**
Before a paper is added to the knowledge graph, its abstract must be fetched from a live source URL. Inference about what a paper "probably says" based on its title is not acceptable. If the paper cannot be fetched (paywalled with no open-access version), document this explicitly and do not add it to the graph.

**2. Every stored paper must have a verified, fetchable source URL.**
`source_url` must be a URL that was actually used to fetch content during the current or a previous session. Constructed URLs (e.g. guessing the arXiv PDF URL from a title) are not acceptable unless verified by a fetch attempt that returned content.

**3. No paper may be cited in generated output unless it is in the knowledge graph or was explicitly provided by the user.**
If a citation appears in output (inline reference, reference list, arXiv ID) and the paper is not in the knowledge graph, flag it immediately: `⚠️ UNVERIFIED SOURCE — this paper has not been fetched in this session.`

**4. Local-folder sources require at least one of: a README, a CITATION file, or a visible BibTeX header.**
Local PDFs added without any accompanying metadata are stored with source set to `local` and a note that full citation data is unavailable until manually verified.

**5. Papers that fail to fetch are logged but not stored.**
If the `paper-analyzer` cannot fetch a paper after exhausting the fetch protocol, it logs the failure with the reason. The paper is not added to the graph. The search result entry is marked `fetch-failed` in the candidate list.
