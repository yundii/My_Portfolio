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
        "title": "Full-Stack in 2026: Designing Permissions for AI Agents",
        "date": "August 2026",
        "description": "Why agent-powered apps need task-scoped access, visible approval flows, and reliable recovery across the frontend and backend.",
        "link": "/blog/full-stack-agent-permissions.html"
},
      {
        "title": "Beyond Code Generation: The Full-Stack Engineer\u2019s Verification Loop",
        "date": "March 2026",
        "description": "How long-running coding agents shift attention toward clear acceptance criteria, browser checks, and reviewable changes.",
        "link": "/blog/agentic-coding-verification.html"
},
      {
        "title": "AI Engineering in 2026: Evals Before More Prompts",
        "date": "January 2026",
        "description": "A practical look at evaluating tool-using agents through repeatable tasks, outcome checks, and production-relevant failure cases.",
        "link": "/blog/ai-agent-evals.html"
},
      {
        title: "Building Scalable RAG Systems",
        date: "April 12, 2025",
        source: "AWS Prescriptive Guidance",
        description: "AWS guidance on RAG architecture options, managed services, and the trade-offs involved in building retrieval-augmented applications.",
        link: "https://docs.aws.amazon.com/prescriptive-guidance/latest/retrieval-augmented-generation-options/introduction.html"
      },
      {
        title: "React Performance Optimization Techniques",
        date: "March 3, 2025",
        source: "React documentation",
        description: "The official React guide to loading components on demand with lazy and Suspense, including code-splitting examples and common pitfalls.",
        link: "https://react.dev/reference/react/lazy"
      },
      {
        title: "Distributed Systems Design Patterns",
        date: "January 22, 2025",
        source: "Microsoft Learn",
        description: "Microsoft’s catalog of cloud design patterns for distributed systems, with practical trade-offs for reliability, scalability, and performance.",
        link: "https://learn.microsoft.com/en-us/azure/architecture/patterns/"
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
                      aria-label={`Read ${post.title}`}
                    >
                      <OpenInNewIcon style={{ fontSize: 20 }} />
                    </a>
                  </div>
                  <p className="blog-post-date">{post.date}{post.source && ` · Recommended reading · ${post.source}`}</p>
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
