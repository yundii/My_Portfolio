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
        I’m a <b>Master of Computer Science</b> student at 
        <a href="https://www.northeastern.edu/"> Northeastern University</a> (GPA: 3.97), 
        currently interning as a <b>Frontend Engineer</b> at 
        <a href="#"> Vosyn</a>. I’ve also worked as an <b>AI Research Intern</b> building 
        clinical search pipelines, and as a <b>Teaching Assistant</b> for Web Development.
      </p>
    );
    
    
    const two = (
      <p>
        I’m passionate about <b>AI</b> and <b>full-stack development</b>, with experience in 
        building multilingual UIs, semantic search systems, and real-time web apps. I enjoy 
        creating clean, scalable software that solves real-world problems.
      </p>
    );
    

    const tech_stack = [
      "JavaScript",
      "React",
      "Python",
      "Redux",
      "Docker",
      "Kubernetes",
      "AWS",
      "PyTorch",
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
