import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FadeInSection from "./FadeInSection";

const isHorizontal = window.innerWidth < 600;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (isHorizontal) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  } else {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  if (isHorizontal) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`
    };
  } else {
    return {
      id: `vertical-tab-${index}`
    };
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.paper",
    display: "flex",
    height: 300
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const JobList = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const experienceItems = {
    "Virtual Healthcare Technology": {
      jobTitle: "Software Engineer - AI @",
      duration: "JAN 2025 - PRESENT",
      desc: [
        "Architected and implemented Doctor VHT-AI, an LLM-powered doctor-facing assistant leveraging Bio-ClinicalBERT and TensorFlow for medical text representation, achieving 90%+ accuracy in diagnoses and treatment recommendations",
        "Designed and optimized a retrieval-augmented generation (RAG) pipeline with vector embeddings and semantic search, integrating 500K+ patient records and 1M+ PubMed articles in a distributed vector database, improving diagnostic retrieval efficiency by 40% using PyTorch for model training and fine-tuning",
        "Enhanced data preprocessing and query retrieval using scikit-learn and spaCy, reducing response time by 35%, and deployed a similarity search mechanism with FAISS, increasing relevant case match rates by 25%",
        "Applied test-driven development (TDD) with pytest and Jest, achieving 90% code coverage"
      ]
    },
    "Northeastern University": {
      jobTitle: "Teaching Assistant & Student @",
      duration: "SEP 2023 - DEC 2025 (EXPECTED)",
      desc: [
        "Master of Computer Science (GPA: 3.96 / 4.0)",
        "Teaching Assistant for CS5610 Web Development (September 2024 - Present)",
        "Assisted students in mastering full-stack web development concepts by providing hands-on guidance in HTML, CSS, JavaScript, and React, ensuring comprehensive understanding and practical application",
        "Developed automated grading scripts with Node.js and Python, implementing CI/CD pipelines using GitHub Actions to evaluate student projects, reducing grading time by 40% while providing comprehensive feedback",
        "Designed and implemented microservices-based demonstration applications using Docker and Kubernetes, showcasing scalable architecture principles and best practices in system design",
        "Relevant Courses: Data Structures and Algorithms, System Design, Web Development, Operating Systems, Scalable Distributed Systems, Cloud Computing, Database Management Systems"
      ]
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation={!isHorizontal ? "vertical" : null}
        variant={isHorizontal ? "fullWidth" : "scrollable"}
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab label={isHorizontal ? `0${i}.` : key} {...a11yProps(i)} />
        ))}
      </Tabs>
      {Object.keys(experienceItems).map((key, i) => (
        <TabPanel value={value} index={i}>
          <span className="joblist-job-title">
            {experienceItems[key]["jobTitle"] + " "}
          </span>
          <span className="joblist-job-company">{key}</span>
          <div className="joblist-duration">
            {experienceItems[key]["duration"]}
          </div>
          <ul className="job-description">
            {experienceItems[key]["desc"].map(function (descItem, i) {
              return (
                <FadeInSection delay={`${i + 1}00ms`}>
                  <li key={i}>{descItem}</li>
                </FadeInSection>
              );
            })}
          </ul>
        </TabPanel>
      ))}
    </div>
  );
};

export default JobList;
