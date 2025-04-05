import React from "react";
import "../styles/Blog.css";
import FadeInSection from "./FadeInSection";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

class Blog extends React.Component {
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
    const blogPosts = [
      {
        title: "Building Scalable RAG Systems",
        date: "April 12, 2025",
        description: "How I implemented a retrieval-augmented generation pipeline with vector embeddings to enhance AI-powered healthcare applications.",
        link: "https://medium.com/@yunditao/building-scalable-rag-systems"
      },
      {
        title: "React Performance Optimization Techniques",
        date: "March 3, 2025",
        description: "Exploring code splitting, memoization, and virtual DOM optimization strategies that improved our application load time by 45%.",
        link: "https://medium.com/@yunditao/react-performance-optimization"
      },
      {
        title: "Distributed Systems Design Patterns",
        date: "January 22, 2025",
        description: "An overview of key design patterns I've implemented in distributed systems, with practical examples from recent projects.",
        link: "https://medium.com/@yunditao/distributed-systems-design-patterns"
      }
    ];

    return (
      <div id="blog">
        <FadeInSection>
          <div className="section-header">
            <span className="section-title">/ blog</span>
          </div>
          <div className="blog-container">
            {blogPosts.map((post, index) => (
              <FadeInSection delay={`${index + 1}00ms`} key={index}>
                <div className="blog-post">
                  <div className="blog-post-header">
                    <h3 className="blog-post-title">{post.title}</h3>
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="blog-post-link"
                    >
                      <OpenInNewIcon style={{ fontSize: 20 }} />
                    </a>
                  </div>
                  <p className="blog-post-date">{post.date}</p>
                  <p className="blog-post-description">{post.description}</p>
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="read-more"
                  >
                    Read more →
                  </a>
                </div>
              </FadeInSection>
            ))}
          </div>
        </FadeInSection>
      </div>
    );
  }
}

export default Blog;
