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
        image: "/assets/InvestNexus.jpg"
      },
      "Spark": {
        title: "Spark",
        desc:
          "A scalable full-stack mobile dating app using React Native, Node.js, and Firebase, implementing global state management with Redux to reduce data fetching by 68% and sync 50+ components.",
        techStack: "REACT NATIVE, NODE.JS, EXPRESS.JS, FIREBASE",
        link: "https://github.com/YaoyiW27/cs5520-mobile-app",
        open: "https://www.youtube.com/watch?v=dpLnQXJyLyc",
        image: "/assets/spark.jpg"
      },
      "Elevator Rising System": {
        title: "Elevator Rising System",
        desc:
          "A multi-threaded elevator control system in Java with a real-time Swing GUI, remote API integration, and optimized performance through efficient resource management and scalability enhancements.",
        techStack: "JAVA, SWING, SWINGX, API INTEGRATION",
        link: "https://github.com/yundii/ElevatorSystem",
        open: "https://github.com/yundii/ElevatorSystem",
        image: "/assets/elevator.jpg"
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
          "Architected and built a scalable full-stack mobile dating app with React Native, Node.js, and Firebase, featuring real-time messaging, microservices, and global state management to support 1,000+ concurrent users with 99.9% uptime.",
        techStack: "JavaScript, React Native, Node.js, Express.js, Expo, Firebase, Figma",
        link: "https://github.com/YaoyiW27/cs5520-mobile-app",
        open: "https://www.youtube.com/watch?v=dpLnQXJyLyc"
      },
      "Elevator Rising System": {
        desc:
          "Developed a multi-threaded elevator control system in Java with a real-time Swing GUI, remote API integration, and optimized performance through efficient resource management and scalability enhancements.",
        techStack: "Java, Swing, SwingX, API Integration",
        link: "https://github.com/yundii/ElevatorSystem",
        open: "https://github.com/yundii/ElevatorSystem"
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
              <img
                className="d-block w-100 carousel-image"
                src={spotlightProjects[key]["image"]}
                alt={key}
              />
              <div className="project-overlay">
                <h3 className="project-title">
                  {spotlightProjects[key]["title"]}
                </h3>
                <p className="project-desc">
                  {spotlightProjects[key]["desc"]}
                </p>
                <p className="project-tech">
                  {spotlightProjects[key]["techStack"]}
                </p>
                <ExternalLinks
                  githubLink={spotlightProjects[key]["link"]}
                  openLink={spotlightProjects[key]["open"]}
                ></ExternalLinks>
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
