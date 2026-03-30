# Skill: Source Evaluation

## Purpose

Assess the credibility, quality, and appropriateness of a source before using it in research. Not all sources are created equal. Using a low-quality source as evidence for a strong claim is a methodological failure, regardless of whether the citation is technically valid. This skill provides a systematic framework for evaluating any source type encountered during research.

---

## The Core Principle

A source's value is relative to the claim it is being used to support. A YouTube lecture from a leading researcher is a fine source for understanding an intuition; it is not an appropriate source for a statistical claim about experimental performance. A blog post might point you to the paper you need; it should never be the paper you cite. Match source quality to claim strength.

---

## The CRAAP Test

Apply the CRAAP test as a first-pass filter. Each dimension is a question, not a checklist box — think about the answer.

### Currency
- When was this published or last updated?
- Is the field fast-moving enough that a 3-year-old result may be outdated?
- For methods papers: has this approach been superseded?
- For datasets: has a better benchmark been established?

Recency matters more in some fields than others. A 1990 physics paper on a stable phenomenon may be more reliable than a 2023 preprint in a fast-moving ML subfield. Evaluate in context.

### Relevance
- Does this source directly address the claim you want to support?
- Is it addressing the same population, domain, or problem formulation?
- Or is it tangentially related — same vocabulary, different question?

A paper on "transformer models for clinical notes" is not automatically relevant to "transformer models for clinical images." Relevance requires methodological and domain alignment, not just terminological overlap.

### Authority
- Who produced this? What are their credentials?
- Is it a peer-reviewed journal, conference paper, or self-published?
- If a person: what is their institutional affiliation and publication record?
- If an organization: is it a research institution, industry lab, advocacy group, or anonymous?

Authority does not make a claim true, but it correlates with whether the claim has been vetted.

### Accuracy
- Are claims supported by evidence presented in the source?
- Is there a methods section? Can you evaluate the experimental design?
- Do the results match the conclusions? Are authors overclaiming?
- Has this paper been cited? Have independent groups confirmed or challenged the findings?
- Is there a conflict of interest (industry funding, product promotion)?

### Purpose
- Why was this produced? To inform, persuade, sell, educate?
- Is there a stated agenda that might bias the content?
- Is this a technical report, a marketing document, or a research paper?
- Industry white papers, press releases, and product documentation serve commercial purposes — use them for context only, not as evidence.

---

## Source Type Evaluations

### Peer-Reviewed Journal Articles

**Trust level:** Highest (conditional on journal quality)

**What to check:**
- **Journal quality:** Is this a recognized journal in the field? Check Journal Citation Reports (JCR) for impact factor, or SCImago for ranking. High impact factor is not synonymous with correctness, but it correlates with editorial rigor.
- **Peer review process:** Was this actually peer-reviewed? Some predatory journals claim peer review but conduct none. Check Beall's List (maintained archives exist online) for known predatory publishers.
- **Retraction status:** Check Retraction Watch (retractionwatch.com) for any paper whose results seem implausibly strong or that you cannot find cited elsewhere. Retractions exist in high-impact journals too.
- **Conflict of interest disclosures:** funded by industry? Not disqualifying, but worth noting.
- **Reproducibility:** Is the code or data available? Have results been reproduced?

**How to cite:** APA in-text `(Author et al., Year)`; full reference with DOI.

**Red flags:**
- No methods section
- No limitations section
- Results that are dramatically better than all prior work with no explanation
- Single-site, single-dataset evaluation claiming general applicability
- Authors affiliated only with the company whose product is being evaluated

---

### Conference Papers

**Trust level:** High for top-tier venues; variable for lower tiers

**What to check:**
- **Venue ranking:** Acceptance rates and community reputation matter. In machine learning: NeurIPS, ICML, ICLR, CVPR, ACL are top tier. In systems: OSDI, SOSP. In security: IEEE S&P, CCS, Usenix Security, NDSS. Know the tiers for your field.
- **Review process:** was this double-blind? Did it go through rebuttal? Workshop papers at top venues are not the same as full papers at top venues.
- **Camera-ready vs. preprint:** conference papers often differ from the arXiv preprint. Cite the camera-ready version if available.

**Red flags:** acceptance at venues with > 50% acceptance rates without other quality signals; workshops with no review process.

---

### arXiv Preprints

**Trust level:** Moderate — higher if subsequently published, lower if long-standing without publication

**What to check:**
- **Publication status:** Is there a published version? Search Semantic Scholar for the paper; check if the arXiv record links to a published version. If published, cite the published version.
- **Version history:** check how many versions exist and when they were revised. A paper with multiple revisions is either being improved (good) or is correcting errors (worth noting).
- **Community engagement:** has it been cited? Has it generated discussion (check Twitter/X, Reddit ML communities, or OpenReview if it was submitted)?
- **Author track record:** not determinative, but a preprint from a lab with a strong publication history deserves more initial credence than one from an unknown source.

**How to cite:** `Author, A. (Year). Title. arXiv preprint arXiv:XXXX.XXXXX.` Always include "arXiv preprint" to signal it is not peer-reviewed.

**When it is acceptable as the only citation:** when the result is very recent and no published version exists yet; when it has been widely cited in the community; when transparency about its preprint status is maintained.

**When it is not acceptable:** when a peer-reviewed version exists; when citing it as if it were peer-reviewed; when the field is one where peer review is essential to establish credibility (clinical medicine, legal standards).

---

### GitHub Repositories

**Trust level:** Variable — assessed on adoption, maintenance, and evidence of correctness

**What to check:**
- **Stars and forks:** proxy for community adoption. 10 stars vs. 10,000 stars is a meaningful difference. But stars are gameable; treat as a soft signal.
- **Last commit date:** when was it last maintained? An abandoned repo from 2018 may have unfixed bugs or incompatibilities.
- **Issues and pull requests:** are there open issues reporting critical bugs? Are PRs being reviewed and merged? A healthy repo has active maintenance.
- **Test coverage:** is there a test suite? Does CI pass? Code without tests is harder to trust.
- **Documentation:** is there a README? Does it describe what the code does, how to run it, and what its limitations are?
- **License:** is use permitted for your purpose? MIT/Apache-2.0 are permissive; GPL has copyleft implications; no license means rights reserved by default.
- **Affiliated paper:** does the repo accompany a peer-reviewed paper? If so, the paper is the primary citation.

**How to cite:** `Author/Organization. (Year). Repository name [Software]. GitHub. https://github.com/org/repo`

**When to use:** citing software implementations, datasets published via GitHub, benchmarks, evaluation frameworks. Not appropriate as evidence for scientific claims about phenomena.

---

### YouTube Videos and Recorded Lectures

**Trust level:** Low for citation purposes; useful for understanding

**What to check:**
- **Speaker credentials:** who is presenting? PhD researcher at a known institution? Industry practitioner with relevant experience? A verified conference speaker? Or an anonymous channel?
- **Venue:** is this a recorded conference talk (e.g., NeurIPS workshop, ICLR poster), a university course lecture, or an independent tutorial?
- **Date:** when was this uploaded? Technical content ages; a 2017 deep learning lecture is historical context, not current practice.
- **Accuracy:** does the speaker make claims that can be verified against papers? Do they cite their sources?

**Acceptable uses:**
- Understanding intuitions and concepts you plan to verify in the literature
- Getting oriented in a new field
- Citing for pedagogical demonstrations that exist only as video content (a researcher's talk that has no corresponding written version)

**Not acceptable as primary citation:** for factual claims about experimental results, established methods, or scientific findings. If a video describes a method or result, find the paper it comes from and cite that.

**How to cite if citing:** `Speaker, A. (Year, Month Day). *Title of video* [Video]. YouTube. https://youtube.com/watch?v=...`

---

### Textbooks

**Trust level:** High for foundational content; may be dated for cutting-edge topics

**What to check:**
- **Edition:** cite the edition. Foundational results do not change, but later editions fix errors and add newer content.
- **Author reputation:** textbooks in technical fields are generally written by recognized experts; verify the author's credentials if uncertain.
- **Currency:** when was the last edition? Some foundational texts are irreplaceable (Bishop's PRML, Goodfellow et al.'s Deep Learning); some fields have moved past their textbook coverage.

**How to cite:** include edition, page numbers when quoting.

**Best use:** foundational definitions, established mathematical results, background context that predates the specific research question.

---

### Blog Posts and Medium Articles

**Trust level:** Lowest — for orientation only, never as primary evidence

**Why they have low trust:**
- No peer review
- No editorial standards
- Author credentials unknown or unverified
- Cannot be cited in most academic contexts
- Content may be outdated or simply incorrect

**Legitimate uses:**
- Finding leads: a blog post that describes a technique will often link to the original paper
- Intuition building: informal explanations can help you understand before you read the formal version
- Community sentiment: a widely-read blog post may reflect community consensus (or dissent) worth investigating in the literature

**Never do:**
- Cite a blog post as evidence for a scientific claim
- Use a blog post's numbers or results without verifying them in the original source
- Trust a blog post's characterization of a paper over the paper itself

If a blog post says "Paper X shows Y," go read Paper X and verify that it says Y. Misrepresentation in secondary sources is common.

---

## Red Flags Across All Source Types

These signals should trigger additional scrutiny regardless of source type:

**Methodological red flags:**
- No methodology section or insufficient detail to assess the experimental design
- No baseline comparison, or obviously weak baselines
- Results are evaluated on a single dataset with no generalization test
- No limitations section (authors never acknowledge what their work cannot do)
- Quantitative results reported without variance, error bars, or confidence intervals
- Claims dramatically outperform the entire prior field with no compelling explanation
- The evaluation metric is unusual or self-designed and favorable to the proposed method

**Credibility red flags:**
- Authors have a direct financial interest in the results (undisclosed conflict of interest)
- Paper appears in a venue you have not heard of
- The writing quality suggests non-expert authorship
- The paper cannot be found in any academic database despite being "published"
- Results cannot be reproduced using the provided code or the described methodology

**Retraction and correction red flags:**
- The paper has been discussed on PubPeer with unresolved concerns
- The paper is from a lab that has had prior retractions
- The data or figures look manipulated (suspicious visual artifacts, identical background in microscopy images, etc.)
- The statistical patterns in the results are implausibly consistent (Benford's Law outliers, no variation across trials)

---

## Source Quality Decision Tree

```
Is this peer-reviewed?
├── Yes → Is the venue reputable? → Is there a conflict of interest?
│         → Use with confidence, note any methodological concerns
└── No → Is this an arXiv preprint?
         ├── Yes → Is there a published version? → Use published version if yes
         │         → Is it widely cited? → Use with "preprint" label, flag it
         └── No → Is this a GitHub repo?
                  ├── Yes → Active maintenance + tests? → Cite as software, not as evidence
                  └── No → Video lecture?
                           ├── Yes → Credible speaker + verified institution? → Use for intuition only
                           └── No → Blog post / website → Use for leads only, never as citation
```

---

## Evaluating Methodology Quality (for empirical papers)

When you have a peer-reviewed paper and want to assess whether to trust its results:

**Experimental design checklist:**
- [ ] Are the baselines appropriate and fairly implemented?
- [ ] Is the evaluation dataset representative of the claimed task?
- [ ] Are hyperparameters tuned separately for each method?
- [ ] Are results reported over multiple runs with variance?
- [ ] Are statistical significance tests applied where appropriate?
- [ ] Is the code available and does it reproduce the reported results?
- [ ] Are the evaluation metrics appropriate and standard in the field?
- [ ] Are the train/val/test splits documented and non-overlapping?
- [ ] Are the experimental conditions (hardware, framework, seed) documented?

**Grading:**
- 8–9 boxes checked: strong methodology, high confidence in results
- 5–7 boxes checked: adequate methodology, use results with appropriate hedging
- < 5 boxes checked: weak methodology, use only as a weak signal or a lead for further investigation

This grading is a heuristic, not a formula. A well-designed study with 5 of these can outweigh a poorly-designed study with 9.
