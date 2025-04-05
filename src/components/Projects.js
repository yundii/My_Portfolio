import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "react-bootstrap/Carousel";
import ExternalLinks from "./ExternalLinks";

function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

class Projects extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }
  render() {
    const spotlightProjects = {
      "InvestNexus": {
        title: "InvestNexus",
        desc:
          "A financial platform designed with Node.js, Prisma, and MySQL, creating RESTful APIs with N+1 query optimization to support 3,000+ concurrent users, ensuring 98% uptime on AWS EC2.",
        techStack: "REACT, NODE.JS, MYSQL, PRISMA, AWS",
        link: "https://github.com/yundii/InvestNexus",
        open: "https://www.youtube.com/watch?v=M2_N8s5u4L8",
        image: "/assets/investnexus.png"
      },
      "Spark": {
        title: "Spark",
        desc:
          "A scalable full-stack mobile dating app using React Native, Node.js, and Firebase, implementing global state management with Redux to reduce data fetching by 68% and sync 50+ components.",
        techStack: "REACT NATIVE, NODE.JS, EXPRESS.JS, FIREBASE",
        link: "https://github.com/YaoyiW27/cs5520-mobile-app",
        open: "https://www.youtube.com/watch?v=dpLnQXJyLyc",
        image: "/assets/spark.png"
      }
    };
    const projects = {
      "InvestNexus": {
        desc:
          "Engineered a responsive front-end with React and Material-UI, implementing lazy loading and code splitting to reduce initial load time by 45% and improve Core Web Vitals metrics.",
        techStack: "React, Node.js, MySQL, Prisma, AWS EC2, Redis",
        link: "https://github.com/yundii/InvestNexus",
        open: "https://www.youtube.com/watch?v=M2_N8s5u4L8"
      },
      "Spark": {
        desc:
          "Developed a robust CI/CD pipeline with GitHub Actions, Docker, and Kubernetes, cutting deployment time by 55%.",
        techStack: "JavaScript, React Native, Node.js, Express.js, Expo, Firebase",
        link: "https://github.com/YaoyiW27/cs5520-mobile-app",
        open: "https://www.youtube.com/watch?v=dpLnQXJyLyc"
      }
    };

    return (
      <div id="projects">
        <div className="section-header ">
          <span className="section-title">/ pet projects</span>
        </div>
        <Carousel>
          {Object.keys(spotlightProjects).map((key, i) => (
            <Carousel.Item key={i}>
              <div 
                className="thumbnail-container"
                onClick={() => window.open(spotlightProjects[key]["open"], "_blank")}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="d-block w-100"
                  src={`https://img.youtube.com/vi/${getYouTubeID(spotlightProjects[key]["open"])}/maxresdefault.jpg`}
                  alt={key}
                />
                <div className="play-button">
                  <i className="fa fa-play-circle"></i>
                </div>
              </div>
              <div className="caption-bg">
                <Carousel.Caption>
                  <h3>{spotlightProjects[key]["title"]}</h3>
                  <p>
                    {spotlightProjects[key]["desc"]}
                    <p className="techStack">
                      {spotlightProjects[key]["techStack"]}
                    </p>
                  </p>
                  <ExternalLinks
                    githubLink={spotlightProjects[key]["link"]}
                    openLink={spotlightProjects[key]["open"]}
                  ></ExternalLinks>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="project-container">
          <ul className="projects-grid">
            {Object.keys(projects).map((key, i) => (
              <FadeInSection delay={`${i + 1}00ms`} key={i}>
                <li className="projects-card">
                  <div className="card-header">
                    <div className="folder-icon">
                      <FolderOpenRoundedIcon
                        style={{ fontSize: 35 }}
                      ></FolderOpenRoundedIcon>
                    </div>
                    <ExternalLinks
                      githubLink={projects[key]["link"]}
                      openLink={projects[key]["open"]}
                    ></ExternalLinks>
                  </div>

                  <div className="card-title">{key}</div>
                  <div className="card-desc">{projects[key]["desc"]}</div>
                  <div className="card-tech">{projects[key]["techStack"]}</div>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Projects;
