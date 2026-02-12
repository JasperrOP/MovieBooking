import { useEffect, useState } from 'react';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    // Fetch the XML file from the public folder
    fetch('/footer_data.xml')
      .then(response => response.text())
      .then(str => {
        // Parse the XML string into a DOM object
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "text/xml");

        // Extract data
        const data = {
          company: xmlDoc.getElementsByTagName("company")[0].textContent,
          copyright: xmlDoc.getElementsByTagName("copyright")[0].textContent,
          email: xmlDoc.getElementsByTagName("email")[0].textContent,
          links: Array.from(xmlDoc.getElementsByTagName("link")).map(link => ({
            label: link.getElementsByTagName("label")[0].textContent,
            url: link.getElementsByTagName("url")[0].textContent
          }))
        };
        setFooterData(data);
      })
      .catch(err => console.error("Error loading XML footer:", err));
  }, []);

  if (!footerData) return null;

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h4 style={styles.heading}>{footerData.company}</h4>
          <p style={styles.text}>&copy; {footerData.copyright}</p>
        </div>
        
        <div style={styles.section}>
          <h4 style={styles.heading}>Links</h4>
          {footerData.links.map((link, index) => (
            <a key={index} href={link.url} style={styles.link}>
              {link.label}
            </a>
          ))}
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.text}>Email: {footerData.email}</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#121212',
    borderTop: '1px solid #333',
    padding: '30px 20px',
    marginTop: '50px',
    color: '#fff',
    fontSize: '14px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  section: {
    marginBottom: '20px',
    minWidth: '200px'
  },
  heading: {
    color: '#e50914', // Netflix Red
    marginBottom: '10px',
    fontSize: '16px'
  },
  text: {
    color: '#aaa',
    margin: '5px 0'
  },
  link: {
    display: 'block',
    color: '#aaa',
    textDecoration: 'none',
    margin: '5px 0',
    transition: '0.3s'
  }
};

export default Footer;