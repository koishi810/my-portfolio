import SiteAnchor from "../SiteAnchor.jsx";
export default function ContactSection({ sectionRef }) {
  return (
    <section className="portfolio-contact-section" id="contact" ref={sectionRef}>
      <div className="portfolio-contact-copy">
        <h2>Contact</h2>
        <SiteAnchor href="mailto:koishi810@gmail.com">koishi810@gmail.com</SiteAnchor>
      </div>
    </section>
  );
}
