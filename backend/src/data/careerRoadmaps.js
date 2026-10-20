const topic = (
  title,
  description,
  why,
  task,
  minutes = 90,
  resources = [],
) => ({
  title,
  description,
  why,
  keyConcepts: title
    .split(/, | and /)
    .map((item) => item.trim())
    .filter(Boolean),
  task,
  estimatedMinutes: minutes,
  prerequisites: [],
  resources,
});
const res = (label, url) => ({ label, url });
const git = res("Git documentation", "https://git-scm.com/doc");
const mdn = res("MDN Web Docs", "https://developer.mozilla.org/");
const mdnJs = res(
  "JavaScript Guide",
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
);
const python = res("Python tutorial", "https://docs.python.org/3/tutorial/");
const java = res("Dev.java Learn", "https://dev.java/learn/");
const mongo = res("MongoDB documentation", "https://www.mongodb.com/docs/");
const postgres = res(
  "PostgreSQL tutorial",
  "https://www.postgresql.org/docs/current/tutorial.html",
);
const docker = res(
  "Docker getting started",
  "https://docs.docker.com/get-started/",
);
const ml = res(
  "Google Machine Learning",
  "https://developers.google.com/machine-learning",
);
const react = res("React Learn", "https://react.dev/learn");
const node = res("Node.js Learn", "https://nodejs.org/en/learn");
const express = res(
  "Express documentation",
  "https://expressjs.com/en/guide/routing.html",
);
const nng = res(
  "Nielsen Norman Group UX articles",
  "https://www.nngroup.com/articles/",
);
const wai = res("W3C WAI resources", "https://www.w3.org/WAI/fundamentals/");

const stage = (title, description, topics, project = "") => ({
  title,
  description,
  topics,
  project,
  completionCriteria: `Complete the practical task and explain the key concepts in your own words.`,
});
const make = (id, title, description, stages, duration = "6–9 months") => ({
  id,
  title,
  targetRole: title,
  description,
  difficulty: "Beginner to advanced",
  estimatedDuration: duration,
  stages,
});
const web = [
  stage(
    "Web Foundations",
    "Understand how websites are addressed, delivered and built collaboratively.",
    [
      topic(
        "Browsers, URLs, domains and hosting",
        "Understand browser responsibilities, URL parts, DNS, domains and where sites are hosted.",
        "These concepts help you trace navigation and ship websites.",
        "Trace a URL from hostname lookup to a hosted page and label each step.",
        90,
        [mdn],
      ),
      topic(
        "HTTP and HTTPS",
        "Understand requests, responses, methods, status codes and encrypted transport.",
        "Frontend code relies on browser-server communication.",
        "Inspect a request in devtools and explain its method, status and response.",
        90,
        [mdn],
      ),
      topic(
        "Command line and Git",
        "Navigate files, use shell commands, commits, branches and GitHub.",
        "Source control is essential for team development.",
        "Create a GitHub repository, branch, commit and merge a small change.",
        90,
        [git],
      ),
    ],
  ),
  stage("HTML", "Build meaningful, accessible document structure.", [
    topic(
      "Semantic HTML and document structure",
      "Use landmarks, headings and semantic elements.",
      "Structure improves accessibility, maintainability and search indexing.",
      "Convert a generic page into semantic markup.",
      90,
      [mdn],
    ),
    topic(
      "Forms, accessibility and SEO",
      "Create validated forms and accessible labels, links and metadata.",
      "Production interfaces must work for all users and be discoverable.",
      "Build an accessible signup form and check it with keyboard navigation.",
      120,
      [mdn],
    ),
  ]),
  stage("CSS", "Create responsive, maintainable layouts and visual systems.", [
    topic(
      "Cascade, selectors and box model",
      "Reason about specificity, inheritance, sizing and flow.",
      "These fundamentals prevent fragile styling.",
      "Recreate a card layout and debug its spacing with devtools.",
      120,
      [mdn],
    ),
    topic(
      "Flexbox, Grid and responsive design",
      "Choose layout systems and adapt designs to screen sizes.",
      "Users access products across device sizes.",
      "Build a responsive dashboard layout with Grid and Flexbox.",
      180,
      [mdn],
    ),
    topic(
      "Typography, motion and CSS architecture",
      "Use type scales, spacing, transitions and maintainable styles.",
      "Consistency improves usability and change velocity.",
      "Create a small set of reusable design tokens and components.",
      120,
      [mdn],
    ),
  ]),
  stage(
    "JavaScript",
    "Use browser JavaScript to build interactive, data-driven experiences.",
    [
      topic(
        "Language fundamentals",
        "Use variables, types, control flow, functions, arrays and objects.",
        "These are the building blocks of every frontend application.",
        "Write a small data transformation utility with edge cases.",
        180,
        [mdnJs],
      ),
      topic(
        "DOM, events and modules",
        "Update the DOM, handle events and split code into ES modules.",
        "Interactive web pages rely on event-driven behavior.",
        "Build a filterable list with modular JavaScript.",
        180,
        [mdnJs],
      ),
      topic(
        "Async JavaScript and browser APIs",
        "Use promises, async/await, fetch, JSON, error handling and storage.",
        "Modern interfaces depend on remote data and resilient async behavior.",
        "Build an API search page with loading, error and empty states.",
        240,
        [mdnJs],
      ),
    ],
  ),
  stage(
    "React",
    "Build component-based applications with reusable state and navigation.",
    [
      topic(
        "Components, JSX, props and state",
        "Compose UI from components and manage local state.",
        "Component thinking supports scalable interfaces.",
        "Build an interactive task list with reusable components.",
        180,
        [react],
      ),
      topic(
        "Hooks, forms and routing",
        "Use state/effect/context, controlled forms and client-side routes.",
        "These patterns power multi-page product experiences.",
        "Create a routed form workflow with shared application state.",
        240,
        [react],
      ),
      topic(
        "APIs, performance and testing",
        "Integrate APIs; handle loading/error/empty states; test behavior.",
        "Reliable applications need correctness and responsive feedback.",
        "Test and optimize an API-backed React feature.",
        240,
        [react],
      ),
    ],
  ),
  stage(
    "Styling and Production UI",
    "Turn product designs into polished, accessible interfaces.",
    [
      topic(
        "Design systems and responsive UI",
        "Use a styling approach, reusable components and design tokens.",
        "Consistency makes products easier to use and evolve.",
        "Implement a responsive component library for a small product.",
        240,
        [mdn],
      ),
      topic(
        "Accessibility and cross-browser checks",
        "Check keyboard use, contrast, semantics and browser differences.",
        "Accessible interfaces serve more people and avoid common defects.",
        "Audit a project and resolve at least five accessibility issues.",
        120,
        [mdn],
      ),
    ],
  ),
  stage(
    "Production Skills",
    "Prepare frontend applications for release and ongoing maintenance.",
    [
      topic(
        "Build, security and deployment",
        "Configure environment values, production builds and hosting safely.",
        "Shipping is part of frontend engineering.",
        "Deploy a frontend app and document its environment configuration.",
        180,
        [mdn],
      ),
      topic(
        "Performance and debugging",
        "Use devtools, measure loading and reduce avoidable work.",
        "Performance affects usability and retention.",
        "Measure and improve a page load using browser performance tools.",
        180,
        [mdn],
      ),
    ],
  ),
  stage(
    "Projects and Job Preparation",
    "Demonstrate end-to-end frontend skills and prepare for interviews.",
    [
      topic(
        "Portfolio and API project",
        "Present deployed work and explain technical decisions.",
        "Hiring teams need evidence of applied skills.",
        "Ship a responsive portfolio and API-powered application with GitHub documentation.",
        480,
        [react, git],
      ),
      topic(
        "Capstone and interviews",
        "Combine routing, reusable UI, persistent data and interview practice.",
        "A complete project shows readiness beyond isolated exercises.",
        "Deploy a substantial React project and practice explaining tradeoffs.",
        600,
        [react],
      ),
    ],
  ),
];

const backendStages = [
  stage(
    "Programming Foundations",
    "Build core programming and web protocol knowledge.",
    [
      topic(
        "Language, algorithms and command line",
        "Learn core language syntax, data structures, algorithms and shell usage.",
        "Backend work depends on reliable problem solving.",
        "Implement common collection operations and version them with Git.",
        240,
        [node, python, java, git],
      ),
      topic(
        "HTTP and JSON",
        "Understand request/response lifecycle, methods, headers and JSON.",
        "APIs are the main interface of backend systems.",
        "Design sample requests and responses for a small service.",
        120,
        [mdn],
      ),
    ],
  ),
  stage(
    "Backend Fundamentals",
    "Build and operate a maintainable HTTP service.",
    [
      topic(
        "Runtime, modules and web framework",
        "Use a backend runtime, routing, middleware and request validation.",
        "A framework organizes application behavior.",
        "Create a REST service with validated routes and centralized errors.",
        300,
        [node, express],
      ),
      topic(
        "REST design and configuration",
        "Choose resource routes, status codes and environment configuration.",
        "Clear contracts make APIs predictable and deployable.",
        "Document a CRUD API and configure secrets outside source control.",
        180,
        [node, express],
      ),
    ],
  ),
  stage(
    "Databases",
    "Persist application data with appropriate models and queries.",
    [
      topic(
        "Relational data and SQL",
        "Model relational data and use CRUD, joins, indexes and transactions.",
        "Most products depend on correct durable data.",
        "Model a small product schema and implement queries.",
        300,
        [postgres],
      ),
      topic(
        "Document modeling and ODM concepts",
        "Choose document boundaries and understand ODM tradeoffs.",
        "Model choice affects consistency and query complexity.",
        "Model an aggregate in MongoDB and compare it with a relational design.",
        240,
        [mongo],
      ),
    ],
  ),
  stage(
    "Authentication and Security",
    "Protect users, data and service boundaries.",
    [
      topic(
        "Authentication, sessions and authorization",
        "Hash passwords and enforce ownership and role checks.",
        "Private data must be scoped to the authenticated user.",
        "Add session login and role-protected endpoints to a sample service.",
        240,
        [node],
      ),
      topic(
        "Input security and abuse controls",
        "Validate inputs; understand CORS, rate limiting and common vulnerabilities.",
        "Security failures can expose users and systems.",
        "Add validation, rate limits and secret management to the API.",
        240,
        [mdn],
      ),
    ],
  ),
  stage("Reliable APIs", "Make APIs easier to use, debug and operate.", [
    topic(
      "Pagination, uploads and documentation",
      "Support bounded queries, uploads and clear API contracts.",
      "Real clients need predictable interfaces.",
      "Add pagination and OpenAPI-style endpoint documentation.",
      240,
      [node],
    ),
    topic(
      "Testing, logs, jobs and caching",
      "Test endpoints and learn observability, background jobs and caching.",
      "Reliability requires visibility and repeatable checks.",
      "Add API tests, structured logs and one asynchronous task.",
      300,
      [node],
    ),
  ]),
  stage(
    "Production and Deployment",
    "Deploy and improve a production-style service.",
    [
      topic(
        "Deployment, CI/CD and operations",
        "Configure database connections, deployment, monitoring and CI.",
        "Services must keep working outside a developer laptop.",
        "Deploy a tested API with health checks and environment configuration.",
        300,
        [docker],
      ),
      topic(
        "Performance and system design",
        "Optimize queries and reason about scaling and service boundaries.",
        "Good design balances reliability, cost and complexity.",
        "Profile a slow query and propose a scaling plan.",
        240,
        [postgres],
      ),
    ],
  ),
  stage(
    "Practical Projects",
    "Prove backend readiness through deployed services.",
    [
      topic(
        "Authentication and database projects",
        "Build secure CRUD and role-based access control.",
        "These patterns appear in common product APIs.",
        "Ship an authenticated CRUD API with ownership checks and tests.",
        480,
        [node, mongo],
      ),
      topic(
        "Production API capstone",
        "Combine validation, documentation, tests, deployment and observability.",
        "A complete service demonstrates job-ready practice.",
        "Deploy a documented API and link source, API docs and live endpoint.",
        600,
        [docker],
      ),
    ],
  ),
];

const paths = [
  make(
    "frontend-developer",
    "Frontend Developer",
    "Build accessible, responsive web applications from browser foundations through production React.",
    web,
  ),
  make(
    "backend-developer",
    "Backend Developer",
    "Design, secure, persist and operate reliable APIs and services.",
    backendStages,
  ),
];

// Focused role paths reuse shared topics only where they genuinely apply; each includes role-specific milestones.
const focused = (id, title, description, stages, duration) =>
  make(id, title, description, stages, duration);
paths.push(
  focused(
    "full-stack-developer",
    "Full Stack Developer",
    "Connect responsive client applications to secure, persistent backend services.",
    [
      web[0],
      web[1],
      web[2],
      web[3],
      web[4],
      backendStages[1],
      backendStages[2],
      backendStages[3],
      backendStages[4],
      backendStages[5],
      stage(
        "Full Stack Capstone",
        "Integrate frontend and backend into a deployed product.",
        [
          topic(
            "End-to-end product delivery",
            "Connect React UI, API, authentication and database with deployment.",
            "Full stack roles own complete user workflows.",
            "Deploy a tested application with documented architecture and user flow.",
            600,
            [react, node, mongo, docker],
          ),
        ],
      ),
    ],
    "8–12 months",
  ),
);
paths.push(
  focused(
    "java-developer",
    "Java Developer",
    "Develop Java foundations into robust object-oriented applications and services.",
    [
      stage("Java Foundations", "Learn language and tooling fundamentals.", [
        topic(
          "Java syntax and object-oriented programming",
          "Use types, control flow, classes, interfaces and collections.",
          "Java roles depend on fluency in the language and its ecosystem.",
          "Build a command-line inventory app with tests.",
          300,
          [java],
        ),
        topic(
          "Collections, exceptions and tooling",
          "Use collections, exceptions, packages and build tools.",
          "Maintainable applications need clear structure and failure handling.",
          "Package a multi-module exercise and handle invalid input.",
          240,
          [java],
        ),
      ]),
      stage("Java Services", "Build maintainable APIs and data access.", [
        topic(
          "HTTP services and API design",
          "Create REST endpoints, validation and consistent errors.",
          "Java is widely used for production services.",
          "Build a documented REST API.",
          360,
          [java],
        ),
        topic(
          "Persistence and transactions",
          "Use SQL, relational modeling and transaction boundaries.",
          "Data integrity is central to business systems.",
          "Persist an order workflow with transactional behavior.",
          300,
          [postgres, java],
        ),
      ]),
      stage(
        "Production Java",
        "Secure, test and deploy service applications.",
        [
          topic(
            "Testing, security and deployment",
            "Test service behavior, protect endpoints and package deployment.",
            "Production code must be safe and supportable.",
            "Deploy a tested Java service with configuration and logs.",
            480,
            [java, docker],
          ),
        ],
      ),
      stage("Java Portfolio", "Demonstrate end-to-end implementation.", [
        topic(
          "Java capstone",
          "Build a documented service with persistence, tests and deployment.",
          "A complete artifact demonstrates practical readiness.",
          "Publish source, API documentation and a working deployment.",
          600,
          [java, postgres],
        ),
      ]),
    ],
    "7–10 months",
  ),
);
paths.push(
  focused(
    "python-developer",
    "Python Developer",
    "Build Python fluency for application development, APIs, automation and production delivery.",
    [
      stage(
        "Python Foundations",
        "Learn the language and development workflow.",
        [
          topic(
            "Python syntax and data structures",
            "Use functions, collections, modules and exceptions.",
            "These skills underpin Python application work.",
            "Build a tested command-line data processing tool.",
            300,
            [python],
          ),
          topic(
            "Testing and packaging",
            "Organize packages and test behavior reproducibly.",
            "Reliable modules are easier to reuse and deploy.",
            "Package a utility with automated tests.",
            240,
            [python],
          ),
        ],
      ),
      stage("Web and Data Persistence", "Build services and persist data.", [
        topic(
          "Python web APIs",
          "Design routes, validation and clear error responses.",
          "Many Python roles involve service interfaces.",
          "Build a documented JSON API.",
          360,
          [python],
        ),
        topic(
          "SQL and data access",
          "Model relational data and perform indexed queries.",
          "Applications need reliable persistence.",
          "Build CRUD workflows backed by PostgreSQL.",
          300,
          [postgres, python],
        ),
      ]),
      stage("Production Python", "Secure and ship maintainable applications.", [
        topic(
          "Security, deployment and observability",
          "Manage secrets, logs, tests and deployment.",
          "Production Python needs operational discipline.",
          "Deploy a tested service with health checks and logs.",
          480,
          [python, docker],
        ),
      ]),
      stage("Python Portfolio", "Demonstrate applied skills.", [
        topic(
          "Python capstone",
          "Build and deploy a documented application matching a target use case.",
          "A complete project makes skills verifiable.",
          "Publish source, tests, documentation and deployment.",
          600,
          [python],
        ),
      ]),
    ],
    "6–9 months",
  ),
);
paths.push(
  focused(
    "data-analyst",
    "Data Analyst",
    "Turn raw data into accurate analysis and decisions.",
    [
      stage(
        "Data Foundations",
        "Learn spreadsheets, statistics and data quality.",
        [
          topic(
            "Data literacy and spreadsheets",
            "Clean, summarize and validate tabular data.",
            "Analysts must establish trustworthy inputs.",
            "Audit a public dataset and document quality issues.",
            240,
            [postgres],
          ),
          topic(
            "SQL for analysis",
            "Filter, join, aggregate and window over relational data.",
            "SQL is a core tool for analyst roles.",
            "Answer ten business questions using SQL.",
            360,
            [postgres],
          ),
        ],
      ),
      stage(
        "Analysis and Communication",
        "Use statistics and visualization to explain findings.",
        [
          topic(
            "Statistics and exploratory analysis",
            "Understand distributions, sampling, uncertainty and correlation.",
            "Sound interpretation prevents misleading decisions.",
            "Analyze a dataset and state limitations.",
            300,
            [python],
          ),
          topic(
            "Visualization and storytelling",
            "Choose charts and present findings for an audience.",
            "Recommendations matter when decision makers can act on them.",
            "Create a concise dashboard and written insight summary.",
            300,
            [python],
          ),
        ],
      ),
      stage("Analyst Portfolio", "Show complete analytical workflows.", [
        topic(
          "Business analysis project",
          "Combine data cleaning, SQL, visualization and recommendations.",
          "Employers assess reasoning as well as tool knowledge.",
          "Publish reproducible analysis with data sources and caveats.",
          480,
          [postgres, python],
        ),
      ]),
    ],
    "4–7 months",
  ),
);
paths.push(
  focused(
    "data-scientist",
    "Data Scientist",
    "Apply statistics, programming and machine learning to answer complex questions.",
    [
      stage(
        "Programming and Data",
        "Build reproducible data handling skills.",
        [
          topic(
            "Python and data manipulation",
            "Use Python to clean, transform and inspect datasets.",
            "Reproducible analysis starts with robust data work.",
            "Build a notebook with repeatable data preparation.",
            300,
            [python],
          ),
          topic(
            "SQL and data collection",
            "Query, join and validate source data.",
            "Model quality limits every downstream conclusion.",
            "Create a documented analytical dataset.",
            300,
            [postgres],
          ),
        ],
      ),
      stage(
        "Statistics and Modeling",
        "Build and evaluate statistical models.",
        [
          topic(
            "Statistics and experiment design",
            "Reason about distributions, inference, bias and experiments.",
            "Models and decisions require sound evidence.",
            "Design an experiment and explain uncertainty.",
            360,
            [ml],
          ),
          topic(
            "Machine learning foundations",
            "Train, validate and compare appropriate models.",
            "Evaluation determines whether predictions generalize.",
            "Compare a baseline and improved model with held-out data.",
            480,
            [ml],
          ),
        ],
      ),
      stage(
        "Responsible Data Science",
        "Make models reproducible and responsibly useful.",
        [
          topic(
            "Model interpretation and responsible use",
            "Inspect errors, fairness risks and deployment constraints.",
            "Models affect people and require careful evaluation.",
            "Write a model card and error analysis.",
            300,
            [ml],
          ),
        ],
      ),
      stage(
        "Data Science Portfolio",
        "Present an end-to-end, reproducible project.",
        [
          topic(
            "Data science capstone",
            "Frame a question, build a validated model and communicate limits.",
            "A portfolio should show decisions and evidence.",
            "Publish code, reproducible setup, evaluation and clear findings.",
            600,
            [ml, python],
          ),
        ],
      ),
    ],
    "8–12 months",
  ),
);
paths.push(
  focused(
    "ml-ai-engineer",
    "Machine Learning / AI Engineer",
    "Build, evaluate and operate machine learning systems.",
    [
      stage(
        "Software and Math Foundations",
        "Establish programming, data and mathematical foundations.",
        [
          topic(
            "Python, algorithms and linear algebra",
            "Use Python and core numerical concepts for model work.",
            "Engineering models requires understanding data and computation.",
            "Implement and test a basic vector operation workflow.",
            360,
            [python, ml],
          ),
        ],
      ),
      stage("Machine Learning", "Train and evaluate practical models.", [
        topic(
          "Supervised and unsupervised learning",
          "Select models, baselines, validation and metrics.",
          "Correct evaluation prevents unreliable systems.",
          "Train and compare models with a leakage-safe split.",
          480,
          [ml],
        ),
        topic(
          "Neural networks and deep learning",
          "Understand neural network training and common architectures.",
          "Many AI products rely on learned representations.",
          "Train a small model and analyze failure cases.",
          480,
          [ml],
        ),
      ]),
      stage("ML Systems", "Make models usable, observable and responsible.", [
        topic(
          "Serving, monitoring and data pipelines",
          "Package inference, track data/model behavior and plan retraining.",
          "Models must remain reliable in changing production conditions.",
          "Deploy an inference API with tests and monitoring signals.",
          480,
          [ml, docker],
        ),
      ]),
      stage("ML Engineering Capstone", "Demonstrate an end-to-end AI system.", [
        topic(
          "Responsible ML product",
          "Build an evaluated model workflow with documented limitations.",
          "Engineering readiness includes reliability and responsible use.",
          "Publish reproducible training, serving and model evaluation artifacts.",
          600,
          [ml],
        ),
      ]),
    ],
    "9–14 months",
  ),
);
paths.push(
  focused(
    "devops-engineer",
    "DevOps Engineer",
    "Automate delivery and operate secure, observable infrastructure.",
    [
      stage(
        "Linux, Networking and Scripting",
        "Build command-line, operating system and network foundations.",
        [
          topic(
            "Linux, shell and Git",
            "Navigate systems, automate tasks and collaborate through version control.",
            "Infrastructure work starts with reliable systems fluency.",
            "Write a shell automation task and document it in Git.",
            300,
            [git],
          ),
          topic(
            "Networking and cloud fundamentals",
            "Understand DNS, ports, TLS, routing and cloud building blocks.",
            "Services depend on networks and managed infrastructure.",
            "Diagram and deploy a simple public service.",
            300,
            [docker],
          ),
        ],
      ),
      stage(
        "Containers and Delivery",
        "Package applications and automate releases.",
        [
          topic(
            "Containers and Docker",
            "Build images and run services with containers.",
            "Containers improve repeatability across environments.",
            "Containerize a small web service.",
            360,
            [docker],
          ),
          topic(
            "CI/CD and infrastructure as code",
            "Automate checks, releases and repeatable infrastructure changes.",
            "Automation reduces deployment errors.",
            "Create a pipeline that tests and deploys a sample service.",
            420,
            [docker],
          ),
        ],
      ),
      stage(
        "Operations and Reliability",
        "Operate services securely and predictably.",
        [
          topic(
            "Monitoring, security and incident response",
            "Use logs, metrics, access controls, backups and runbooks.",
            "Operations aims to restore service and prevent repeat incidents.",
            "Instrument an app and write a recovery runbook.",
            420,
            [docker],
          ),
          topic(
            "Cloud and orchestration foundations",
            "Understand cloud deployment and container orchestration concepts.",
            "Modern systems need scalable deployment patterns.",
            "Deploy a containerized service and document its architecture.",
            480,
            [docker],
          ),
        ],
      ),
      stage(
        "DevOps Capstone",
        "Demonstrate an automated production workflow.",
        [
          topic(
            "Production delivery project",
            "Build a secure pipeline with observable deployment and rollback plan.",
            "A working delivery path is core evidence for DevOps roles.",
            "Publish pipeline, infrastructure notes and operational runbook.",
            600,
            [docker],
          ),
        ],
      ),
    ],
    "7–12 months",
  ),
);
paths.push(
  focused(
    "ui-ux-designer",
    "UI/UX Designer",
    "Research user needs and turn them into accessible, testable product experiences.",
    [
      stage(
        "Design Foundations",
        "Learn visual communication and interaction fundamentals.",
        [
          topic(
            "Visual hierarchy and layout",
            "Use type, spacing, color, grids and hierarchy intentionally.",
            "Clear visual systems help users understand interfaces.",
            "Redesign a confusing screen and explain the decisions.",
            240,
            [mdn],
          ),
          topic(
            "Accessibility and interaction",
            "Design keyboard, focus, feedback and inclusive interaction states.",
            "Usability includes people with different abilities and contexts.",
            "Audit a flow for keyboard and contrast accessibility.",
            240,
            [mdn],
          ),
        ],
      ),
      stage(
        "Research and Structure",
        "Understand users and organize product information.",
        [
          topic(
            "User research and synthesis",
            "Plan interviews, observe behavior and summarize evidence.",
            "Design decisions should be grounded in user needs.",
            "Conduct a small usability study and synthesize findings.",
            300,
            [nng],
          ),
          topic(
            "Information architecture and flows",
            "Organize content and map user journeys and task flows.",
            "Good structure helps users complete tasks.",
            "Map and test a core product workflow.",
            240,
            [nng],
          ),
        ],
      ),
      stage(
        "Prototyping and Validation",
        "Create and test interaction concepts.",
        [
          topic(
            "Wireframes and interactive prototypes",
            "Translate flows into low and high fidelity prototypes.",
            "Prototypes reveal issues before implementation.",
            "Prototype a multi-step experience and test it with users.",
            360,
            [nng],
          ),
          topic(
            "Usability testing and iteration",
            "Observe users, prioritize issues and iterate designs.",
            "Validation reduces avoidable product friction.",
            "Run moderated tests and document design changes.",
            300,
            [nng],
          ),
        ],
      ),
      stage(
        "Design Systems and Portfolio",
        "Scale design work and communicate outcomes.",
        [
          topic(
            "Design systems and developer handoff",
            "Define reusable patterns, states and implementation-ready specs.",
            "Shared patterns improve consistency across a product.",
            "Document a small design system and handoff states.",
            360,
            [nng],
          ),
          topic(
            "Case study and portfolio",
            "Explain problem, evidence, decisions and outcomes clearly.",
            "A strong case study shows reasoning rather than only polished screens.",
            "Publish a case study with process, iterations and accessibility checks.",
            480,
            [nng, wai],
          ),
        ],
      ),
    ],
    "5–8 months",
  ),
);

export const careerRoadmaps = paths;
export const getCareerRoadmap = (id) =>
  careerRoadmaps.find((roadmap) => roadmap.id === id);
