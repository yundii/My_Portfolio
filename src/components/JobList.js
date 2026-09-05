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
    "Vosyn": {
      jobTitle: "Software Engineer Intern @",
      duration: "May 2025 – Present",
      desc: [
        "Developed responsive UI modules for Vosyn Verse, a B2C global content platform, using React, TypeScript, and Figma design specifications",
        "Built cross-platform multilingual search interface for Vosyn Assist (AI-powered search) supporting video, audio, and text formats, boosting accessibility by 40%",
        "Engineered modular widget systems with expand/collapse transitions and adaptive layouts using CSS Flexbox/Grid and React state management, improving UX responsiveness",
        "Created reusable content card components displaying consistent metadata across formats, enhancing component reusability by 60% and reducing navigation friction across devices"
      ]
    },
    "Virtual Healthcare Technology": {
      jobTitle: "AI Engineer Intern @",
      duration: "JAN 2025 - APR 2025",
      desc: [
        "Designed a two-stage semantic search pipeline using FAISS and Bio-ClinicalBERT to retrieve relevant patient cases and PubMed literature, enhancing retrieval accuracy for medical diagnosis",
        "Constructed top-k coarse retrieval using cosine similarity on patient embeddings and reranked literature for improved medical relevance, boosting model confidence by 22%",
        "Optimized text preprocessing pipeline with spaCy and PyTorch for medical entity recognition and vector encoding, achieving 30% faster search throughput",
        "Reduced latency by 35% through pre-encoded databases and query optimization, enabling near real-time clinical assistance while enhancing semantic accuracy by 18%"
      ]
    },
    "Northeastern University": {
      jobTitle: "Teaching Assistant & Student @",
      duration: "SEP 2023 - Aug 2026 (EXPECTED)",
      desc: [
        "Master of Computer Science (GPA: 3.97 / 4.0)",
        "Teaching Assistant for CS5610 Web Development (September 2024 - April 2025)",
        "Assisted 40+ students in mastering React, HTML/CSS, and JavaScript through office hours and code reviews, improving pass rates by 18%",
        "Built grading scripts integrated with GitHub Actions and Node.js to support faster feedback cycles and CI testing, reducing instructor workload by 30%"
      ]
    },
    "Southwestern University of Finance and Economics": {
      jobTitle: "Student @",
      duration: "SEP 2018 - JUN 2022",
      desc: [
        "Bachelor of Science in Financial Engineering, Sichuan, China (GPA: 3.5 / 4.0)",
        "Passed FRM Level 1 and CFA Level 1",
        "Relevant Courses: Financial Econometrics, Fixed Income Securities, Behavioral Finance, Derivative Financial Instruments, Corporate Finance"
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
