Yes — with the two additional files, I would update the website structure like this.

The website should be driven by your JSON files, where each page pulls content from one or more specific JSON sources.

---

# Updated Website Structure + JSON Mapping

```txt
Samia Sharmin                                      About   Work   Writing   Research   Activities   CV   Contact
```

The name **Samia Sharmin** links to `/`.

---

## 1. Home Page

**Route**

```txt
/
```

**Purpose**
The homepage introduces Samia’s identity and guides visitors toward the main parts of the portfolio.

**Use these JSON files**

```txt
profile.json
experience.json
research_publications.json
writing.json
articles-written-by-samia.json
awards.json
activities.json
site_pages.json
```

**Content to show**

* Poetic intro from `profile.json`
* Short identity line: architect / writer / researcher / design communicator
* Four gateway cards:

  * Work
  * Writing
  * Research
  * Activities
* Featured experience from `experience.json`
* Featured publication from `research_publications.json`
* Featured writing from `articles-written-by-samia.json`
* Featured award/activity from `awards.json` or `activities.json`

**Homepage sections**

```txt
Hero
Intro / Practice Statement
Featured Work
Featured Articles
Featured Research
Activities & Awards Preview
Contact CTA
```

---

## 2. About Page

**Route**

```txt
/about
```

**Purpose**
This page tells Samia’s personal and professional story in a deeper way.

**Use these JSON files**

```txt
profile.json
education.json
skills_languages.json
```

**Content to show**

* Long first-person biography
* Practice areas
* Education
* Research interests
* Languages
* Core skills
* Working approach

**Page sections**

```txt
About Samia
Practice Statement
Education
Research Interests
Skills & Languages
```

---

## 3. Work Page

**Route**

```txt
/work
```

**Purpose**
This page presents Samia’s professional work across architecture, brand communication, editorial coordination, museum/exhibition work, and heritage documentation.

**Use these JSON files**

```txt
experience.json
architecture_heritage.json
skills_languages.json
```

**Content to show**

* Brand Strategist work
* Editorial Team work
* Ceramic Bangladesh work
* Prothom Alo writing role
* Lecturer / research work
* SYSTEM Architects work
* Finding Bangladesh work
* Architecture / heritage / exhibition-related roles

**Page sections**

```txt
Building-Material Brand Communication
Editorial & Publication Coordination
Architecture / Museum / Exhibition Work
Heritage Documentation
Selected Professional Roles
```

**Optional detail route**

```txt
/work/[work-slug]
```

Use this later if you want each role or project to have its own page.

---

## 4. Writing Page

**Route**

```txt
/writing
```

**Purpose**
This becomes one of the most important pages. It should show both articles written by Samia and articles where Samia is mentioned or featured.

**Use these JSON files**

```txt
writing.json
articles-written-by-samia.json
articles-mentioning-samia.json
experience.json
```

**Recommended page structure**

```txt
Writing & Articles
├── Articles Written by Samia
├── Editorial Roles
├── Interviews / Features
├── Material & Industry Writing
└── Mentions / Press / Features About Samia
```

---

### 4A. Articles Written by Samia

**Use**

```txt
articles-written-by-samia.json
```

This section should contain actual published articles written by Samia.

Each article card can show:

```json
{
  "title": "",
  "publication": "",
  "date": "",
  "category": "",
  "summary": "",
  "url": "",
  "image": ""
}
```

Use only the fields actually present in your JSON file.

**Display as cards**

```txt
Article Title
Publication
Date
Category
Short description
Read article →
```

---

### 4B. Articles Mentioning Samia

**Use**

```txt
articles-mentioning-samia.json
```

This should be a separate section on the Writing page, or it can become a small page called **Press / Mentions**.

This section is for articles where Samia is mentioned, interviewed, featured, awarded, or recognized.

**Section title options**

```txt
Mentions & Features
Press & Recognition
Articles Mentioning Samia
Featured In
```

Each card can show:

```json
{
  "title": "",
  "publication": "",
  "date": "",
  "context": "",
  "url": "",
  "image": ""
}
```

Again, use only the actual fields available in the JSON.

**Display as cards**

```txt
Article / Feature Title
Publication
Date
Why Samia is mentioned
Read more →
```

---

### Recommended Writing Page Layout

```txt
Hero:
Writing, Articles & Editorial Work

Intro:
A short paragraph about Samia’s architecture-focused writing, editorial coordination, interviews, material stories, and public-facing design communication.

Section 1:
Articles Written by Samia

Section 2:
Editorial Roles
- Prothom Alo
- Ceramic Bangladesh Magazine
- ArchBiz Magazine

Section 3:
Articles Mentioning Samia / Press

Section 4:
Writing Categories
- Architecture & Design
- Heritage & Culture
- Materials & Industry
- Interviews
- Public Communication
```

---

## 5. Individual Article Page

**Route**

```txt
/writing/[article-slug]
```

**Use this JSON file**

```txt
articles-written-by-samia.json
```

**Purpose**
Each article written by Samia can have its own page.

**Content to show**

```txt
Article title
Publication
Date
Category
Hero image
Summary / excerpt
Original article link
Related articles
```

**Page layout**

```txt
Back to Writing
Article Title
Publication / Date / Category
Hero Image
Article Summary
Original Link
Related Articles
```

---

## 6. Mentions / Press Page

This can either be a separate page or a section inside Writing.

I recommend making it a separate page only if `articles-mentioning-samia.json` has many entries.

**Route**

```txt
/mentions
```

or

```txt
/writing/mentions
```

**Use this JSON file**

```txt
articles-mentioning-samia.json
```

**Purpose**
This page shows public recognition, interviews, media mentions, awards coverage, or features where Samia appears.

**Content to show**

```txt
Article title
Publication
Date
Mention type
Context
Original link
```

**Navbar option**

I would **not** add “Mentions” to the top navbar unless there are many items. Keep it inside Writing.

---

## 7. Research Page

**Route**

```txt
/research
```

**Purpose**
This page presents Samia’s academic research, publications, workshops, and research interests.

**Use these JSON files**

```txt
research_publications.json
architecture_heritage.json
education.json
presentations.json
```

**Content to show**

* Research interests
* Academic publications
* Research experience
* Workshops
* Conference/seminar presentations
* Heritage documentation work

**Page sections**

```txt
Research Interests
Academic Publications
Research Experience
Workshops & Collaborative Research
Conferences / Seminars / Presentations
```

---

## 8. Individual Publication Page

**Route**

```txt
/research/[publication-slug]
```

**Use this JSON file**

```txt
research_publications.json
```

**Purpose**
Each academic publication can have a detail page.

**Content to show**

```txt
Publication title
Year
Status
Journal / venue
Abstract or summary
Research theme
Citation
Download / external link if available
```

---

## 9. Activities Page

**Route**

```txt
/activities
```

**Purpose**
This page shows Samia’s extracurricular life, cultural leadership, awards, public speaking, performance, youth work, and creative practice.

**Use these JSON files**

```txt
activities.json
awards.json
presentations.json
articles-mentioning-samia.json
```

**Why include `articles-mentioning-samia.json` here?**
Some mentions may relate to awards, public events, youth programs, cultural work, or recognition. Those can be shown as supporting links under relevant activities.

**Page sections**

```txt
Awards & Scholarships
Leadership & Extracurricular Achievements
Public Speaking & Presentations
Performance / Training / Cultural Work
Media Mentions Related to Activities
```

---

## 10. CV Page

**Route**

```txt
/cv
```

**Purpose**
This is the formal structured CV page.

**Use these JSON files**

```txt
profile.json
education.json
experience.json
research_publications.json
awards.json
skills_languages.json
references.json
tailoring_notes.json
```

**Content to show**

```txt
Profile
Education
Professional Experience
Research & Teaching Experience
Publications
Awards
Skills
Languages
References
Download CV
```

**Important**
Use `tailoring_notes.json` internally or as an admin/reference file. I would not show it publicly unless you want to explain conflicting dates or versions.

---

## 11. Contact Page

**Route**

```txt
/contact
```

**Purpose**
This page helps people contact Samia for collaboration.

**Use these JSON files**

```txt
profile.json
skills_languages.json
site_pages.json
```

**Content to show**

```txt
Location
Email
Availability
Collaboration areas
Contact form
```

**Collaboration areas**

```txt
Architecture writing
Editorial coordination
Research support
Heritage documentation
Building-material communication
Publication coordination
Exhibition / museum-related work
Public programs
```

---

# Updated Final Navbar

I recommend this:

```txt
Samia Sharmin                         About   Work   Writing   Research   Activities   CV   Contact
```

Do not put every page in the navbar. Keep article detail pages, publication detail pages, and mentions detail pages accessible through cards.

---

# Updated URL Structure

```txt
/
/about
/work
/work/[work-slug]
/writing
/writing/[article-slug]
/writing/mentions
/research
/research/[publication-slug]
/activities
/cv
/contact
```

---

# Full JSON-to-Page Mapping

```json
{
  "home": [
    "profile.json",
    "experience.json",
    "research_publications.json",
    "writing.json",
    "articles-written-by-samia.json",
    "awards.json",
    "activities.json",
    "site_pages.json"
  ],
  "about": [
    "profile.json",
    "education.json",
    "skills_languages.json"
  ],
  "work": [
    "experience.json",
    "architecture_heritage.json",
    "skills_languages.json"
  ],
  "writing": [
    "writing.json",
    "articles-written-by-samia.json",
    "articles-mentioning-samia.json",
    "experience.json"
  ],
  "article_detail": [
    "articles-written-by-samia.json"
  ],
  "mentions": [
    "articles-mentioning-samia.json"
  ],
  "research": [
    "research_publications.json",
    "architecture_heritage.json",
    "education.json",
    "presentations.json"
  ],
  "publication_detail": [
    "research_publications.json"
  ],
  "activities": [
    "activities.json",
    "awards.json",
    "presentations.json",
    "articles-mentioning-samia.json"
  ],
  "cv": [
    "profile.json",
    "education.json",
    "experience.json",
    "research_publications.json",
    "awards.json",
    "skills_languages.json",
    "references.json",
    "tailoring_notes.json"
  ],
  "contact": [
    "profile.json",
    "skills_languages.json",
    "site_pages.json"
  ]
}
```

---

# Recommended Folder Structure

```txt
src/
  data/
    profile.json
    education.json
    experience.json
    architecture_heritage.json
    writing.json
    articles-written-by-samia.json
    articles-mentioning-samia.json
    research_publications.json
    awards.json
    activities.json
    presentations.json
    skills_languages.json
    references.json
    site_pages.json
    tailoring_notes.json

  pages/
    index
    about
    work
    writing
    writing/[slug]
    writing/mentions
    research
    research/[slug]
    activities
    cv
    contact
```

---

# Best Way to Incorporate the Two New Article JSON Files

Use them like this:

```txt
Writing Page
├── Main intro from writing.json
├── Editorial roles from experience.json
├── Article cards from articles-written-by-samia.json
└── Mentions / press cards from articles-mentioning-samia.json
```

And:

```txt
Activities Page
└── Related media mentions from articles-mentioning-samia.json
```

That way, the website clearly separates:

```txt
Things Samia wrote
vs.
Things written about / mentioning Samia
```

This distinction is important for credibility and avoids confusing authored work with press or recognition.
