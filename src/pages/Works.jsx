import SiteAnchor from "../components/SiteAnchor.jsx";
import useWorksScroll from "../hooks/useWorksScroll.js";
import DirectoryLayout from "../components/directory/DirectoryLayout.jsx";
import DirectoryProject from "../components/directory/DirectoryProject.jsx";
import SmallWorksGallery from "../components/directory/SmallWorksGallery.jsx";
import IllustrationGallery from "../components/directory/IllustrationGallery.jsx";
import PhotographyGallery from "../components/directory/PhotographyGallery.jsx";
import { directoryProjects, workCategories } from "../data/workDirectory.js";
import "../styles/works-home-alignment.css";

export default function Works() {
  const resultsRef = useWorksScroll();
  return (
    <DirectoryLayout title="Works" variant="works">
      <section className="directory-intro" aria-labelledby="works-title">
        <h1 className="directory-title" id="works-title">Works</h1>
        <nav className="directory-category-index" aria-label="Work categories">
          {workCategories.map((category) => (
            <SiteAnchor href={`#category-${category.id}`} key={category.id}>
              <span>{category.number}</span><span>{category.label}</span>
            </SiteAnchor>
          ))}
        </nav>
      </section>
      <div className="directory-results" ref={resultsRef}>
        {workCategories.map((category) => (
          <section
            className={`directory-category${category.gallery ? " directory-category-gallery" : ""}`}
            id={`category-${category.id}`}
            aria-labelledby={`category-title-${category.id}`}
            key={category.id}
          >
            <h2 className="directory-results-title" id={`category-title-${category.id}`}>
              {category.label}
            </h2>
            {category.gallery === "illustration" ? <IllustrationGallery /> : category.gallery === "photography" ? <PhotographyGallery /> : category.projectSlugs.length ? (
              <div className="directory-project-list">
                {category.projectSlugs.map((slug) => (
                  <div className="directory-work-step" key={slug}>
                    <DirectoryProject project={directoryProjects.find((project) => project.slug === slug)} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="directory-category-empty">現在、掲載作品はありません。</p>
            )}
            {category.id === "other" ? <SmallWorksGallery /> : null}
          </section>
        ))}
      </div>
    </DirectoryLayout>
  );
}
