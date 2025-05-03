import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

class About extends React.Component {
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
    const one = (
      <p>
        I am currently pursuing a <b>Master of Computer Science</b> at
        <a href="https://www.northeastern.edu/"> Northeastern University</a> in Vancouver, Canada 
        (GPA: 3.97/4.0). I also work as a <b>AI Research Engineer</b> at
        <a href="#"> Virtual Healthcare Technology</a> and serve as a 
        <b> Teaching Assistant</b> for CS5610 (Web Development).
      </p>
    );
    const two = (
      <p>
        My professional experience includes developing LLM-powered healthcare solutions, 
        implementing retrieval-augmented generation (RAG) pipelines, and building 
        scalable web and mobile applications. I'm passionate about AI, cloud computing, 
        and building efficient software systems.
      </p>
    );

    const tech_stack = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "AWS",
      "Docker"
    ];

    return (
      <div id="about">
        <FadeInSection>
          <div className="section-header ">
            <span className="section-title">/ about me</span>
          </div>
          <div className="about-content">
            <div className="about-description">
              {[one]}
              {"Here are some technologies I have been working with:"}
              <ul className="tech-stack">
                {tech_stack.map(function (tech_item, i) {
                  return (
                    <FadeInSection delay={`${i + 1}00ms`} key={i}>
                      <li>{tech_item}</li>
                    </FadeInSection>
                  );
                })}
              </ul>
              {[two]}
            </div>
            <div className="about-image">
              <img alt="Profile" src={"/assets/me.jpg"} />
            </div>
          </div>
        </FadeInSection>
      </div>
    );
  }
}

export default About;
