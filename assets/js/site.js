const routes = [
  { id: "home", label: "Home", href: "" },
  { id: "about", label: "About", href: "about/" },
  { id: "work", label: "Work", href: "work/" },
  { id: "writing", label: "Writing", href: "writing/" },
  { id: "research", label: "Research", href: "research/" },
  { id: "activities", label: "Activities", href: "activities/" },
  { id: "cv", label: "CV", href: "cv/" },
  { id: "contact", label: "Contact", href: "contact/" }
];

const pageTitles = {
  home: "Samia Sharmin | Architect, Writer, Researcher",
  about: "About | Samia Sharmin",
  work: "Work | Samia Sharmin",
  writing: "Writing | Samia Sharmin",
  research: "Research | Samia Sharmin",
  activities: "Activities | Samia Sharmin",
  cv: "CV | Samia Sharmin",
  contact: "Contact | Samia Sharmin"
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const page = document.body.dataset.page || "home";
  const root = document.body.dataset.root || ".";

  document.title = pageTitles[page] || pageTitles.home;
  renderHeader(root, page);

  try {
    const [allContent, writtenArticles, mentions, introText] = await Promise.all([
      fetchJson(`${root}/json_files/all_content.json`),
      fetchJson(`${root}/json_files/articles-written-by-samia.json`),
      fetchJson(`${root}/json_files/articles-mentioning-samia.json`),
      fetchText(`${root}/md_files/intro.md`)
    ]);

    const introParagraphs = splitParagraphs(introText);
    const articleList = sortByDate(writtenArticles);
    const mentionList = sortByDate(mentions);
    const main = document.querySelector("#app");

    const renderers = {
      home: () => renderHome(main, root, allContent, articleList, mentionList, introParagraphs),
      about: () => renderAbout(main, root, allContent, introParagraphs),
      work: () => renderWork(main, root, allContent),
      writing: () => renderWriting(main, root, allContent, articleList, mentionList),
      research: () => renderResearch(main, root, allContent),
      activities: () => renderActivities(main, root, allContent, mentionList),
      cv: () => renderCv(main, root, allContent),
      contact: () => renderContact(main, root, allContent)
    };

    (renderers[page] || renderers.home)();
    renderFooter(root, allContent.profile);
    bindInteractions();
  } catch (error) {
    renderError(error);
  }
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.text();
}

function renderHeader(root, page) {
  const header = document.querySelector("#site-header");
  header.innerHTML = `
    <div class="header-inner">
      <a class="brand-lockup" href="${linkTo(root, "")}" aria-label="Samia Sharmin home">
        <span class="brand-name">Samia Sharmin</span>
        <span class="brand-subtitle">Architect, Writer, Researcher</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${routes
          .map(
            (route) => `
              <a href="${linkTo(root, route.href)}" class="${route.id === page ? "is-active" : ""}">
                ${route.label}
              </a>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

function renderFooter(root, profile) {
  const footer = document.querySelector("#site-footer");
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <div class="brand-name">Samia Sharmin</div>
          <div class="brand-subtitle">${escapeHtml(profile.title_line)}</div>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
          ${routes
            .filter((route) => route.id !== "home")
            .map((route) => `<a href="${linkTo(root, route.href)}">${route.label}</a>`)
            .join("")}
        </nav>
      </div>
      <div class="footer-note">
        Based in ${escapeHtml(profile.location)}. ${escapeHtml(profile.availability)}.
        For collaborations in architecture writing, research, editorial coordination, and design communication, reach out at
        <a class="text-link" href="mailto:${profile.email}">${profile.email}</a>
      </div>
    </div>
  `;
}

function bindInteractions() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });
}

function renderError(error) {
  const main = document.querySelector("#app");
  main.innerHTML = `
    <section class="hero">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Loading Error</div>
          <h1 class="page-title">The portfolio content could not be loaded.</h1>
        </div>
      </div>
      <p class="page-intro">${escapeHtml(error.message)}</p>
    </section>
  `;
}

function renderHome(main, root, content, writtenArticles, mentions, introParagraphs) {
  const profile = content.profile;
  const featuredProfessional = content.experience.professional_editorial_brand_experience.slice(0, 3);
  const featuredResearch = content.research_publications.academic_publications.slice(0, 3);
  const featuredAwards = content.awards.awards_scholarships_recognition.slice(0, 4);
  const featuredArticles = writtenArticles.slice(0, 6);

  main.innerHTML = `
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Architectural Storytelling</div>
          <h1>Samia Sharmin</h1>
          <p class="hero-lead">${escapeHtml(profile.homepage_intro.long)}</p>
          <p class="identity-line">${escapeHtml(profile.title_line)}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="${linkTo(root, "writing/")}">Explore Writing</a>
            <a class="button button-secondary" href="${linkTo(root, "contact/")}">Start a Conversation</a>
          </div>
        </div>
        <div class="hero-portrait-wrap">
          <div class="hero-portrait-frame">
            <img class="hero-portrait" src="${linkTo(root, "images/biva.jfif")}" alt="Portrait of Samia Sharmin">
            <div class="portrait-caption">
              <div class="stat-card">
                <strong>${writtenArticles.length}+</strong>
                <span>Published articles</span>
              </div>
              <div class="stat-card">
                <strong>${content.research_publications.academic_publications.length}</strong>
                <span>Research publications</span>
              </div>
              <div class="stat-card">
                <strong>${content.experience.professional_editorial_brand_experience.length + content.experience.academic_research_teaching_experience.length}</strong>
                <span>Professional roles</span>
              </div>
              <div class="stat-card">
                <strong>${content.awards.awards_scholarships_recognition.length}</strong>
                <span>Awards and recognitions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="gateway-grid">
        ${gatewayCard("Work", "Professional practice across building-material brand strategy, architecture-focused communication, editorial coordination, heritage documentation, exhibition support, and academic teaching", linkTo(root, "work/"), "Selected Roles")}
        ${gatewayCard("Writing", "Published articles, interviews, editorial features, and public-facing design communication on architecture, materials, culture, and the built environment.", linkTo(root, "writing/"), "Articles & Editorial")}
        ${gatewayCard("Research", "Academic publications, heritage research, workshops, and ongoing inquiries into Bengal’s architectural history, cultural landscapes, urban memory, and the built environment.", linkTo(root, "research/"), "Publications & Inquiry")}
        ${gatewayCard("Activities", "Awards, youth engagement, public speaking, cultural leadership, performance practice, and interdisciplinary work beyond the studio.", linkTo(root, "activities/"), "Recognition & Public Life")}
      </div>
    </section>

    <section class="section section-spaced split-band">
      <div class="quote-panel">
        <div class="eyebrow">Practice Statement</div>
        <blockquote>${escapeHtml(introParagraphs[0] || profile.homepage_intro.short)}</blockquote>
        <p>${escapeHtml(introParagraphs[1] || profile.homepage_intro.long)}</p>
      </div>
      <div class="section-panel rich-copy">
        <div class="section-heading">
          <div>
            <h2>Tracing Stories in Space, Material, and Memory</h2>
            <p>${escapeHtml(profile.homepage_intro.short)}</p>
          </div>
        </div>
        ${introParagraphs.slice(2, 5).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Featured Work</div>
          <h2>Prpfessional, Editorial & Brand Experience</h2>
        </div>
        <p>Selected roles show a practice that moves between content strategy, publishing, material communication, teaching, and architectural research.</p>
      </div>
      <div class="feature-grid">
        ${featuredProfessional.map(renderExperienceCard).join("")}
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Writing</div>
            <h2>Recent Articles</h2>
          </div>
          <p>Selected published pieces from mainstream and architecture-adjacent editorial contexts.</p>
        </div>
        <div class="article-grid compact">
          ${featuredArticles.map((article) => renderArticleCard(article, false)).join("")}
        </div>
      </div>
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Research</div>
            <h2>Academic Publications</h2>
          </div>
          <p>Academic writing rooted in riverine settlements, Bengal's architectural heritage, and spatial interpretation.</p>
        </div>
        <div class="timeline">
          ${featuredResearch.map(renderPublicationCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Recognition</div>
          <h2>Awards, leadership, and public engagement</h2>
        </div>
        <p>Recognition spans heritage research, cultural practice, academic merit, and public-facing leadership.</p>
      </div>
      <div class="feature-grid">
        ${featuredAwards.map(renderAwardCard).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-panel">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Contact</div>
            <h2>Open to thoughtful collaborations</h2>
          </div>
          <p>Available for remote collaborations in architecture writing, editorial work, research support, heritage documentation, and public-facing design communication.</p>
        </div>
        <div class="inline-actions">
          <a class="button button-primary" href="mailto:${profile.email}">Email ${escapeHtml(profile.name)}</a>
          <a class="button button-secondary" href="${linkTo(root, "cv/")}">View CV</a>
          <a class="button button-secondary" href="${linkTo(root, "contact/")}">Contact Details</a>
        </div>
      </div>
    </section>
  `;
}

function renderAbout(main, root, content, introParagraphs) {
  const profile = content.profile;
  const education = content.education.education;
  const visibleEducation = education.filter((item) => item.degree || item.institution);
  const expertise = profile.core_expertise;
  const researchInterests = content.research_publications.research_interests;
  const languages = content.skills_languages.languages;

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">About</div>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="hero-lead">${escapeHtml(profile.homepage_intro.long)}</p>
        </div>
        <div class="hero-portrait-wrap">
          <div class="hero-portrait-frame">
            <img class="hero-portrait" src="${linkTo(root, "images/biva.jfif")}" alt="Portrait of Samia Sharmin">
          </div>
        </div>
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div class="section-panel rich-copy">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Story</div>
            <h2>Architecture as a language of public understanding</h2>
          </div>
        </div>
        ${introParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <div class="content-grid">
        <div class="note-panel">
          <div class="eyebrow">Practice Areas</div>
          <div class="tag-list">
            ${flattenExpertise(expertise).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
        <div class="note-panel">
          <div class="eyebrow">Research Interests</div>
          <ul class="bullet-list">
            ${researchInterests.map((interest) => `<li>${escapeHtml(interest)}</li>`).join("")}
          </ul>
        </div>
        <div class="note-panel">
          <div class="eyebrow">Languages</div>
          <ul class="bullet-list">
            ${languages
              .map(
                (language) => `
                  <li>
                    <strong>${escapeHtml(language.language)}</strong> — ${escapeHtml(language.proficiency)}
                    ${language.test ? ` (${escapeHtml(language.test)})` : ""}
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Core Expertise</div>
          <h2>Ways of working</h2>
        </div>
        <p>The practice moves fluidly between research, editing, public communication, education, and design-oriented cultural work.</p>
      </div>
      <div class="category-grid">
        ${expertise
          .map(
            (group) => `
              <article class="category-card">
                <small>${escapeHtml(group.area)}</small>
                <h3>${escapeHtml(group.area)}</h3>
                <div class="tag-list">
                  ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Education</div>
          <h2>Academic foundation</h2>
        </div>
        <p>Training began in architecture and extends into broader planning, heritage, and community-focused inquiry.</p>
      </div>
      <div class="education-grid">
        ${visibleEducation.map(renderEducationCard).join("")}
      </div>
    </section>
  `;
}

function renderWork(main, root, content) {
  const professional = content.experience.professional_editorial_brand_experience;
  const academic = content.experience.academic_research_teaching_experience;
  const heritage = content.architecture_heritage.architecture_exhibition_museum_heritage_programs;

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Work</div>
      <h1 class="page-title">Professional roles shaped by architecture, content, and cultural interpretation.</h1>
      <p class="page-intro">From building-material communication and magazine work to teaching, heritage research, exhibitions, and gallery environments, the work sits between built form and public narrative.</p>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Brand & Editorial Practice</div>
          <h2>Strategy, publishing, and material communication</h2>
        </div>
      </div>
      <div class="timeline">
        ${professional.map(renderExperienceCard).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Academic Work</div>
          <h2>Teaching, mentoring, and research support</h2>
        </div>
      </div>
      <div class="timeline">
        ${academic.map(renderExperienceCard).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Architecture & Heritage</div>
          <h2>Exhibitions, museums, documentation, and cultural programs</h2>
        </div>
      </div>
      <div class="timeline">
        ${heritage.map(renderExperienceCard).join("")}
      </div>
    </section>
  `;
}

function renderWriting(main, root, content, writtenArticles, mentions) {
  const writingRoles = content.writing.writing_roles;
  const articleYears = groupByYear(writtenArticles);
  const mentionYears = groupByYear(mentions);

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Writing</div>
      <h1 class="page-title">Articles, editorial work, and architecture-focused public communication.</h1>
      <p class="page-intro">Published work spans architecture, interiors, culture, materials, education, and public-interest storytelling. Alongside authored articles, the page also traces editorial roles and features where Samia appears or is referenced.</p>
      <div class="inline-actions">
        <a class="button button-secondary" href="${linkTo(root, "contact/")}">Commission Writing</a>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="stats-grid">
        <article class="list-card">
          <small>Published</small>
          <h3>${writtenArticles.length}+ authored pieces</h3>
          <p>Articles published across lifestyle, interior, education, and culture sections.</p>
        </article>
        <article class="list-card">
          <small>Editorial</small>
          <h3>${writingRoles.length} ongoing roles</h3>
          <p>Magazine and newsroom work that spans planning, writing, coordination, and layout review.</p>
        </article>
        <article class="list-card">
          <small>Features</small>
          <h3>${mentions.length} mentions collected</h3>
          <p>Coverage connected to public speaking, youth work, cultural engagement, and recognition.</p>
        </article>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Editorial Roles</div>
          <h2>Where the writing practice is shaped</h2>
        </div>
      </div>
      <div class="timeline">
        ${writingRoles
          .map(
            (role) => `
              <article class="timeline-card">
                <div class="meta-row">
                  <span>${escapeHtml(role.organization)}</span>
                  <span>${escapeHtml(role.dates)}</span>
                </div>
                <h3>${escapeHtml(role.role)}</h3>
                <div class="tag-list">
                  ${role.topics.map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("")}
                </div>
                <ul class="bullet-list">
                  ${role.activities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Articles Written by Samia</div>
          <h2>Published articles</h2>
        </div>
        <p>Titles are shown as recorded in the source archive, including Bengali-language publication titles.</p>
      </div>
      <div class="content-grid">
        ${articleYears
          .map(
            ([year, items]) => `
              <div class="year-group">
                <h3 class="year-heading">${year}</h3>
                <div class="article-grid">
                  ${items.map((article) => renderArticleCard(article, true)).join("")}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Mentions & Features</div>
          <h2>Articles mentioning or featuring Samia</h2>
        </div>
      </div>
      <div class="content-grid">
        ${mentionYears
          .map(
            ([year, items]) => `
              <div class="year-group">
                <h3 class="year-heading">${year}</h3>
                <div class="article-grid">
                  ${items.map((article) => renderArticleCard(article, false, "Feature / Mention")).join("")}
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderResearch(main, root, content) {
  const research = content.research_publications;
  const heritageResearch = content.experience.academic_research_teaching_experience.filter((item) =>
    /Research/i.test(item.role)
  );
  const presentations = content.presentations.conferences_seminars_presentations;

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Research</div>
      <h1 class="page-title">Research rooted in heritage, settlement, memory, and public interpretation.</h1>
      <p class="page-intro">The research practice investigates the cultural landscapes of Bengal, architectural history, participatory design, and the ways built knowledge can be shared with wider publics.</p>
    </section>

    <section class="section section-spaced split-band">
      <div class="note-panel">
        <div class="eyebrow">Research Interests</div>
        <div class="tag-list">
          ${research.research_interests.map((interest) => `<span class="tag">${escapeHtml(interest)}</span>`).join("")}
        </div>
      </div>
      <div class="note-panel">
        <div class="eyebrow">Research Practice</div>
        <ul class="bullet-list">
          <li>Architectural history and urban heritage research grounded in Bengal.</li>
          <li>Community-based and participatory methods for reading place, publicness, and settlement form.</li>
          <li>Editorial and public-facing interpretation that makes specialist knowledge accessible.</li>
        </ul>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Publications</div>
          <h2>Academic publications</h2>
        </div>
      </div>
      <div class="timeline">
        ${research.academic_publications.map(renderPublicationCard).join("")}
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Workshops</div>
            <h2>Collaborative inquiry</h2>
          </div>
        </div>
        <div class="timeline">
          ${research.workshops_collaborative_research.map(renderWorkshopCard).join("")}
        </div>
      </div>
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Presentations</div>
            <h2>Speaking and public exchange</h2>
          </div>
        </div>
        <div class="timeline">
          ${presentations.map(renderPresentationCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Field & Heritage Research</div>
          <h2>Applied heritage documentation</h2>
        </div>
      </div>
      <div class="timeline">
        ${heritageResearch.map(renderExperienceCard).join("")}
      </div>
    </section>
  `;
}

function renderActivities(main, root, content, mentions) {
  const awards = content.awards.awards_scholarships_recognition;
  const activities = content.activities.event_leadership_creative_practice_youth_engagement;
  const leadership = content.activities.leadership_creative_roles;
  const presentations = content.presentations.conferences_seminars_presentations;
  const relatedMentions = mentions.slice(0, 6);

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Activities</div>
      <h1 class="page-title">Awards, cultural practice, youth leadership, and public presence.</h1>
      <p class="page-intro">Outside formal professional roles, the portfolio includes public speaking, event leadership, performance, facilitation, documentary work, and a long record of cultural and youth-centered engagement.</p>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Awards</div>
          <h2>Recognition across research, academics, and cultural work</h2>
        </div>
      </div>
      <div class="feature-grid">
        ${awards.map(renderAwardCard).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Leadership & Creative Practice</div>
          <h2>Organizing, performing, and facilitating</h2>
        </div>
      </div>
      <div class="timeline">
        ${activities.map(renderExperienceCard).join("")}
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div class="note-panel">
        <div class="eyebrow">Creative and Leadership Roles</div>
        <ul class="bullet-list">
          ${leadership.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <div class="note-panel">
        <div class="eyebrow">Public Speaking</div>
        <div class="timeline">
          ${presentations.map(renderPresentationCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Media Mentions</div>
          <h2>Public-facing traces of this work</h2>
        </div>
      </div>
      <div class="article-grid">
        ${relatedMentions.map((article) => renderArticleCard(article, false, "Mention")).join("")}
      </div>
    </section>
  `;
}

function renderCv(main, root, content) {
  const profile = content.profile;
  const education = content.education.education;
  const professional = content.experience.professional_editorial_brand_experience;
  const academic = content.experience.academic_research_teaching_experience;
  const heritage = content.architecture_heritage.architecture_exhibition_museum_heritage_programs;
  const publications = content.research_publications.academic_publications;
  const awards = content.awards.awards_scholarships_recognition;
  const skillGroups = content.skills_languages.skills;
  const languages = content.skills_languages.languages;
  const references = content.references.references;

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Curriculum Vitae</div>
      <h1 class="page-title">${escapeHtml(profile.name)}</h1>
      <p class="page-intro">${escapeHtml(profile.title_line)}. ${escapeHtml(profile.location)}. ${escapeHtml(profile.availability)}.</p>
      <div class="inline-actions">
        <button class="button button-primary" data-print="true" type="button">Print / Save as PDF</button>
        <a class="button button-secondary" href="mailto:${profile.email}">Email</a>
      </div>
      <div class="print-only">
        <p>${escapeHtml(profile.email)}</p>
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div class="note-panel">
        <div class="eyebrow">Profile</div>
        <p>${escapeHtml(profile.homepage_intro.long)}</p>
      </div>
      <div class="note-panel">
        <div class="eyebrow">Core Expertise</div>
        <div class="tag-list">
          ${flattenExpertise(profile.core_expertise).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Experience</div>
          <h2>Professional and academic roles</h2>
        </div>
      </div>
      <div class="timeline">
        ${[...professional, ...academic, ...heritage].map(renderExperienceCard).join("")}
      </div>
    </section>

    <section class="section section-spaced">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Education</div>
          <h2>Academic record</h2>
        </div>
      </div>
      <div class="education-grid">
        ${education.map(renderEducationCard).join("")}
      </div>
      <div class="note-panel section-spaced">
        <div class="eyebrow">Note</div>
        <p>${escapeHtml(content.education.tailoring_note)}</p>
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Publications</div>
            <h2>Research output</h2>
          </div>
        </div>
        <div class="timeline">
          ${publications.map(renderPublicationCard).join("")}
        </div>
      </div>
      <div>
        <div class="section-heading">
          <div>
            <div class="eyebrow">Awards</div>
            <h2>Selected recognition</h2>
          </div>
        </div>
        <div class="timeline">
          ${awards.slice(0, 8).map(renderAwardCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section-spaced two-column">
      <div class="content-grid">
        ${skillGroups
          .map(
            (group) => `
              <article class="category-card">
                <small>${escapeHtml(group.category)}</small>
                <h3>${escapeHtml(group.category)}</h3>
                <div class="tag-list">
                  ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="content-grid">
        <div class="note-panel">
          <div class="eyebrow">Languages</div>
          <ul class="bullet-list">
            ${languages
              .map(
                (language) => `
                  <li>
                    <strong>${escapeHtml(language.language)}</strong> — ${escapeHtml(language.proficiency)}
                    ${language.test ? ` (${escapeHtml(language.test)})` : ""}
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
        <div class="note-panel">
          <div class="eyebrow">References</div>
          <ul class="bullet-list">
            ${references
              .map(
                (reference) => `
                  <li>
                    <strong>${escapeHtml(reference.name)}</strong><br>
                    ${escapeHtml(reference.title)}<br>
                    ${escapeHtml(reference.institution)}<br>
                    <a href="mailto:${reference.email}">${escapeHtml(reference.email)}</a>
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderContact(main, root, content) {
  const profile = content.profile;
  const collaborationAreas = [
    "Architecture writing",
    "Editorial coordination",
    "Research support",
    "Heritage documentation",
    "Building-material communication",
    "Publication coordination",
    "Exhibition and museum-related work",
    "Public programs and speaking"
  ];

  main.innerHTML = `
    <section class="hero page-hero">
      <div class="eyebrow">Contact</div>
      <h1 class="page-title">Available for collaborations that need clarity, care, and architectural depth.</h1>
      <p class="page-intro">For editorial projects, research support, heritage work, communication strategy, or public-facing design storytelling, Samia is available for remote collaboration.</p>
      <div class="inline-actions">
        <a class="button button-primary" href="mailto:${profile.email}">Email ${escapeHtml(profile.name)}</a>
        <a class="button button-secondary" href="${linkTo(root, "cv/")}">View CV</a>
      </div>
    </section>

    <section class="section section-spaced contact-grid">
      <article class="contact-card">
        <small>Email</small>
        <h3>${escapeHtml(profile.email)}</h3>
        <p>Best for commissions, editorial partnerships, research collaborations, and speaking invitations.</p>
        <a class="contact-link" href="mailto:${profile.email}">Send an email</a>
      </article>
      <article class="contact-card">
        <small>Location</small>
        <h3>${escapeHtml(profile.location)}</h3>
        <p>Based in Dhaka and available for remote collaboration across time zones.</p>
      </article>
      <article class="contact-card">
        <small>Availability</small>
        <h3>${escapeHtml(profile.availability)}</h3>
        <p>Open to architecture writing, research support, communication strategy, and public-facing cultural work.</p>
      </article>
    </section>

    <section class="section section-spaced split-band">
      <div class="note-panel">
        <div class="eyebrow">Collaboration Areas</div>
        <div class="tag-list">
          ${collaborationAreas.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
      <div class="quote-panel">
        <div class="eyebrow">Approach</div>
        <blockquote>Architecture becomes more meaningful when its ideas can be understood, shared, and felt beyond specialist circles.</blockquote>
        <p>That principle guides work across editorial, heritage, research, exhibition, and material communication projects.</p>
      </div>
    </section>
  `;
}

function gatewayCard(title, description, href, label) {
  return `
    <a class="gateway-card" href="${href}">
      <small>${escapeHtml(label)}</small>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      <span class="arrow-link">Open section</span>
    </a>
  `;
}

function renderExperienceCard(item) {
  return `
    <article class="timeline-card">
      <div class="meta-row">
        ${item.organization ? `<span>${escapeHtml(item.organization)}</span>` : ""}
        ${item.location ? `<span>${escapeHtml(item.location)}</span>` : ""}
        ${item.dates ? `<span>${escapeHtml(item.dates)}</span>` : ""}
      </div>
      <h3>${escapeHtml(item.role || item.title || "")}</h3>
      ${item.employment_type ? `<p><strong>${escapeHtml(item.employment_type)}</strong></p>` : ""}
      ${item.responsibilities ? `<ul class="bullet-list">${item.responsibilities.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>` : ""}
      ${item.details ? `<ul class="bullet-list">${item.details.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>` : ""}
      ${item.date_note ? `<div class="keyline"></div><p>${escapeHtml(item.date_note)}</p>` : ""}
    </article>
  `;
}

function renderPublicationCard(item) {
  return `
    <article class="timeline-card">
      <div class="meta-row">
        ${item.year ? `<span>${escapeHtml(item.year)}</span>` : ""}
        ${item.status ? `<span>${escapeHtml(item.status)}</span>` : ""}
      </div>
      <h3>${escapeHtml(extractPublicationTitle(item.citation || item.title || ""))}</h3>
      <p>${escapeHtml(item.citation || item.title || "")}</p>
    </article>
  `;
}

function renderWorkshopCard(item) {
  return `
    <article class="timeline-card">
      <div class="meta-row">
        <span>${escapeHtml(item.year)}</span>
        <span>${escapeHtml(item.location)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.host_or_conductor)}</p>
      <ul class="bullet-list">
        ${item.details.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderPresentationCard(item) {
  return `
    <article class="timeline-card">
      <div class="meta-row">
        <span>${escapeHtml(item.year)}</span>
        <span>${escapeHtml(item.role)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.organization)}</p>
    </article>
  `;
}

function renderAwardCard(item) {
  return `
    <article class="feature-card">
      <div class="meta-row">
        ${item.year ? `<span>${escapeHtml(item.year)}</span>` : ""}
        ${item.organization ? `<span>${escapeHtml(item.organization)}</span>` : ""}
        ${item.level ? `<span>${escapeHtml(item.level)}</span>` : ""}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.details ? `<p>${escapeHtml(item.details)}</p>` : ""}
    </article>
  `;
}

function renderEducationCard(item) {
  const label = item.status ? "Admission / Academic Path" : "Education";
  return `
    <article class="list-card">
      <small>${label}</small>
      <h3>${escapeHtml(item.degree || item.institution || "")}</h3>
      <div class="meta-row">
        ${item.institution ? `<span>${escapeHtml(item.institution)}</span>` : ""}
        ${item.location ? `<span>${escapeHtml(item.location)}</span>` : ""}
        ${item.dates ? `<span>${escapeHtml(item.dates)}</span>` : ""}
        ${item.year ? `<span>${escapeHtml(item.year)}</span>` : ""}
      </div>
      ${item.cgpa ? `<p>CGPA: ${escapeHtml(item.cgpa)}</p>` : ""}
      ${item.gpa ? `<p>GPA: ${escapeHtml(item.gpa)}</p>` : ""}
      ${item.status ? `<p>${escapeHtml(item.status)}</p>` : ""}
      ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
      ${item.honors ? `<ul class="bullet-list">${item.honors.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>` : ""}
    </article>
  `;
}

function renderArticleCard(article, authored, overrideType = "") {
  const date = formatDate(article.publication_date);
  const label = overrideType || inferArticleType(article);
  const publication = inferPublication(article.url);
  const note = authored ? "Article by Samia" : "Feature or mention";
  const publicationBadge = renderArticleSourceBadge(publication);

  return `
    <article class="article-card">
      <div class="meta-row">
        <span>${escapeHtml(date)}</span>
        <span>${publicationBadge}</span>
      </div>
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(label)}. ${escapeHtml(note)}.</p>
      <a class="article-link" href="${article.url}" target="_blank" rel="noreferrer">Read article</a>
    </article>
  `;
}

function renderArticleSourceBadge(publication) {
  return `
    <span class="publication-badge">
      <img src="${linkTo(document.body.dataset.root || ".", "icons/palo.png")}" alt="Prothom Alo icon">
      <span>${escapeHtml(publication)}</span>
    </span>
  `;
}

function splitParagraphs(text) {
  return text
    .split(/\r?\n\r?\n/)
    .map((entry) => entry.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);
}

function sortByDate(items) {
  return [...items].sort((left, right) => new Date(right.publication_date) - new Date(left.publication_date));
}

function groupByYear(items) {
  const groups = items.reduce((accumulator, item) => {
    const year = item.publication_date ? new Date(item.publication_date).getFullYear() : "Archive";
    if (!accumulator[year]) {
      accumulator[year] = [];
    }
    accumulator[year].push(item);
    return accumulator;
  }, {});

  return Object.entries(groups).sort(([left], [right]) => {
    if (left === "Archive") {
      return 1;
    }
    if (right === "Archive") {
      return -1;
    }
    return Number(right) - Number(left);
  });
}

function inferPublication(url) {
  if (!url) {
    return "Publication";
  }
  if (url.includes("prothomalo.com")) {
    return "Prothom Alo";
  }
  return new URL(url).hostname.replace(/^www\./, "");
}

function inferArticleType(article) {
  const url = article.url || "";
  if (url.includes("/interior")) {
    return "Interiors / Lifestyle";
  }
  if (url.includes("/education")) {
    return "Education";
  }
  if (url.includes("/fashion")) {
    return "Lifestyle / Fashion";
  }
  if (url.includes("/roundtable")) {
    return "Roundtable";
  }
  if (url.includes("/opinion")) {
    return "Opinion / Feature";
  }
  if (url.includes("/bangladesh")) {
    return "National Feature";
  }
  return "Feature";
}

function extractPublicationTitle(citation) {
  const match = citation.match(/\(\d{4}\)\.\s(.+?)(?:\.\s[A-Z]|$)/);
  return match ? match[1] : citation;
}

function formatDate(input) {
  if (!input) {
    return "Date unavailable";
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function flattenExpertise(groups) {
  return groups.flatMap((group) => group.items).slice(0, 18);
}

function linkTo(root, href) {
  if (!href) {
    return `${root}/`;
  }
  return `${root}/${href}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
