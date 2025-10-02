'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import GitHubCalendar from 'react-github-calendar';
import Image from 'next/image'
import { Sun, Moon, Download, Github, ExternalLink, Briefcase, Calendar, Award, Star, Send, Linkedin, Twitter, ArrowUp, ChevronDown, ChevronUp, Building, X, Menu } from 'lucide-react'
import { Bell, Check, Play, Youtube } from 'lucide-react'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBoredModalOpen, setIsBoredModalOpen] = useState(false)

  const [skills] = useState({
    technical: [
      {
        category: 'PROGRAMMING',
        items: [
          { name: 'C', level: 4 },
          { name: 'Java', level: 3 },
          { name: 'Python', level: 4 },
          { name: 'JavaScript', level: 3 },
          { name: 'GoLang', level: 2 },
          { name: 'SQL', level: 4 }
        ]
      },
      {
        category: 'WEB DEVELOPMENT',
        items: [
          { name: 'HTML', level: 4 },
          { name: 'CSS', level: 4 },
          { name: 'JavaScript', level: 3 },
          { name: 'Node.js', level: 3 },
          { name: 'React', level: 3 },
          { name: 'Streamlit', level: 4 },
          { name: 'Flask', level: 4 },
          { name: 'Django', level: 2}
        ]
      },
      {
        category: 'DEVOPS & TOOLS',
        items: [
          { name: 'Git', level: 4 },
          { name: 'Github', level: 4 },
          { name: 'Docker', level: 3 },
          { name: 'Kubernetes', level: 3 }
        ]
      },
      {
        category: 'AI & MACHINE LEARNING',
        items: [
          { name: 'YOLO', level: 4 },
          { name: 'Langchain', level: 3 }
        ]
      }
    ],
    soft: [
      'Problem Solving',
      'Teamwork',
      'Communication',
      'Adaptability',
      'Time Management',
      'Critical Thinking'
    ]
  })

  const education = [
    {
      school: "Birla Institute of Technology and Science, Pilani",
      degree: "BSc, Computer Science",
      duration: "Jul 2023 - Jul 2027",
      image: "/Bits.png",
      current: true
    },
    {
      school: "C.M.A HR. SEC. SCHOOL",
      degree: "PCM",
      duration: "Apr 2013 - Dec 2022",
      grade: "Class 12 - 96.2%",
      image: "/CMA.png"
    }
  ]

  const projects = [
    {
      title: 'AI-Powered Medical Chatbot',
      description: 'An AI-powered medical chatbot providing users with personalized healthcare support across 16 specializations, with features like symptom checking, medication reminders, expert consultations, and emergency assist. The chatbot supports multilingual communication and voice input for accessibility.',
      technologies: ['AI', 'NLP', 'Healthcare'],
      github: 'https://github.com/GautamBytes/Medecro_AI_PERSONALIZED_PLATFORM',
      demo: 'https://drive.google.com/file/d/15yS1u18rkn8H9NPCrLcZeqOBAeHDz8dE/view?usp=drive_link',
      demoType: 'Demo Video'
    },
    {
      title: 'Vehicle Detection System',
      description: 'An advanced machine learning application for real-time vehicle detection and classification, utilizing YOLO algorithm for accurate and efficient results.',
      technologies: ['Machine Learning', 'YOLO', 'Computer Vision'],
      github: 'https://github.com/GautamBytes/Jadavpur_Hackathon',
      demo: 'https://drive.google.com/file/d/1C23wweeOFtJIo_OV5zEpsUBD97LbbqFR/view?usp=drive_link',
      demoType: 'Demo Video'
    },
    {
      title: 'Contract Risk Assessor',
      description: 'This tool, developed as part of the Contract Risk Assessment Hackathon, focuses on using Natural Language Processing (NLP) to analyze and extract key clauses from construction contract documents. The tool answers specific queries about contract details, providing concise summaries and insights.',
      technologies: ['NLP', 'Document Analysis', 'AI'],
      github: 'https://github.com/GautamBytes/IITM_HACKATHON',
      demo: 'https://drive.google.com/file/d/1rRiQIALYMmYL_LEgHB3CQqIyvoUcJl34/view?usp=drive_link',
      demoType: 'Demo Video'
    },
    {
      title: 'Gesture Recognition App',
      description: 'The Gesture Detection Web-Based App is an innovative application that captures and interprets math gestures drawn in the air, using the Gemini API. This tool is designed to facilitate interactive learning and provide instant feedback on math-related queries by recognizing gestures and converting them into meaningful responses.',
      technologies: ['Gesture Recognition', 'Gemini API', 'Web Development'],
      github: 'https://github.com/GautamBytes/Math_Gesture_Prediction_tool',
      demo: 'https://drive.google.com/file/d/1LZo4HjSHS20_3LVZmHC1KrBdcWM2SKYj/view?usp=sharing',
      demoType: 'Demo Video'
    },
    {
      title: 'Talaash AI',
      description: 'Talaash AI is an innovative, AI-powered education platform designed to enhance learning experiences for students preparing for competitive exams. With features like Topper&apos;s Evaluation, Quiz Generation, Mindmap Creation, and a Career Hub, Talaash AI is your personal education sidekick, providing tailored support for academic success.',
      technologies: ['AI', 'Education Technology', 'Web Development'],
      github: 'https://github.com/GautamBytes/hackathon-projects',
      demo: 'https://drive.google.com/file/d/1E8Ry9QkDpJaiFhAA12sajxPzSJO5i8JA/view?usp=sharing',
      demoType: 'Demo Video'
    },
    {
      title: 'TimeCapsule Smart Contract',
      description: 'A Solidity smart contract that enables users to create time-locked messages on the Ethereum blockchain. Perfect for storing messages that can only be retrieved after a specified time period has elapsed. Features include creating time-locked messages, retrieving messages after the lock period, and viewing capsule details.',
      technologies: ['Solidity', 'Ethereum', 'Smart Contracts'],
      github: 'https://github.com/GautamBytes/Bitcoin-Themed-Time-Capsule',
      demo: 'https://github.com/GautamBytes/Bitcoin-Themed-Time-Capsule',
      demoType: 'Live Demo'
    },
    {
      title: 'Bitcoin Timestamp Verifier',
      description: 'A web application designed for users to verify the existence of files on the Bitcoin blockchain. This tool utilizes the Blockstream API to facilitate the verification process, ensuring users can check if specific documents or data hashes are recorded on the blockchain. Features include file upload, blockchain verification, and user feedback.',
      technologies: ['React.js', 'Blockstream API', 'Web Development'],
      github: 'https://github.com/GautamBytes/Bitcoin-Timestamp-Verifier',
      demo: 'https://bitcoin-timestamp-verifier.vercel.app/',
      demoType: 'Live Demo'
    }
  ]

  const experiences = [
    {
      title: 'Bitcoin Dev Fellow',
      company: 'Bitshala',
      duration: 'Oct 2025 - Present',
      description: 'Contributing to open-source Bitcoin projects like Shopstr under expert mentorship, fostering high-impact work and building a career in the Bitcoin FOSS ecosystem.',
      skills: ['Bitcoin', 'Open Source', 'Next.js', 'TypeScript', 'Nostr'],
      link: 'https://www.linkedin.com/in/gautam-manchandani/'
    },
    {
      title: 'Open Source Bitcoin Engineer Intern',
      company: 'Shopstr',
      duration: 'Sep 2025 - Present',
      description: 'Continuing contributions to Shopstr\'s Bitcoin-based payment systems, focusing on enhancing security and user experience through open-source development.',
      skills: ['Next.js', 'TypeScript', 'Nostr', 'Cashu', 'Lightning Network'],
      link: 'https://www.linkedin.com/in/gautam-manchandani/'
    },
    {
      title: 'Mentee',
      company: 'Shopstr (Summer of Bitcoin)',
      duration: 'May 2025 - Aug 2025',
      description: 'Spearheaded a payment escrow system, reducing manual processing by 40%. Utilized P2PK time-locked Cashu tokens to secure funds and implemented a new UI for dispute resolution, decreasing transaction-related support tickets by over 30%.',
      skills: ['Next.js', 'TypeScript', 'Nostr', 'Cashu', 'Lightning Network', 'Bitcoin'],
      link: 'https://gautambytes.github.io/'
    },
    {
      title: 'PM Intern',
      company: 'BuildFastWithAI',
      duration: 'Oct 2024 - Aug 2025',
      description: 'Developed GTM strategy for Educhain, increasing adoption by 20%. Optimized UX with AI-driven features, improving engagement by 15%. Conducted market research, boosting signups by 25%.',
      skills: ['Product Strategy', 'GTM Strategy', 'Team Leadership', 'Data-Driven Decision Making', 'Customer Focus'],
      link: 'https://www.linkedin.com/in/gautam-manchandani/'
    },
    {
      title: 'Contributor',
      company: 'Winter of Blockchain',
      duration: 'Sep 2024 - Nov 2024 · 3 mos',
      description: 'Contributed to BuddyTrail & Skillwise projects, focusing on web development and enhancing smart contract functionalities.',
      skills: ['Web Development', 'HTML', 'CSS', 'JS', 'React', 'Python', 'Git', 'Github'],
      link: 'https://www.linkedin.com/in/gautam-manchandani/'
    },
    {
      title: 'Contributor',
      company: 'Hacktoberfest',
      duration: 'Oct 2024 · 1 mo',
      description: 'Contributed 23 PRs (10 merged) to projects like Unialgo, EventTrakka & Year-in-Progress, focusing on web development & Python improvements.',
      skills: ['Open Source', 'Web Development', 'Python', 'Git'],
      link: 'https://www.linkedin.com/in/gautam-manchandani/'
    }
  ];

  const achievements = [
    {
      title: 'IIT Madras & NICMAR ICCRIP 2024',
      description: '1st Runner-Up',
      icon: Award,
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7233899197953916930/'
    },
    {
      title: 'IIT Delhi Finifesta Case Competition',
      description: '2nd Runner-Up',
      icon: Star,
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7180257322286366720/'
    },
    {
      title: 'Hacktoberfest 2024',
      description: 'Earned multiple Holopin badges for open-source contributions',
      icon: Github,
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7254448752332079106/'
    },
    {
      title: 'Anmol Ratan Award',
      description: 'Academic Excellence in AISSEE 2020 and 2022 || Class-10[90.6%] || Class-12[96.2%]',
      icon: Award
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = ['Education', 'Projects', 'Experience', 'Achievements', 'github', 'Contact', 'Bored?']

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setMessageSent(true)
    }, 1000)
  }

  const BoredModal = () => (
    <AnimatePresence>
      {isBoredModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsBoredModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, rotate: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-700 p-6 rounded-lg shadow-xl max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">You&apos;re Amazing!</h3>
              <button
                onClick={() => setIsBoredModalOpen(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-4">
              Wow! You&apos;ve made it this far on my website. Your curiosity and interest are truly appreciated. You&apos;re not just a visitor; you&apos;re an explorer of digital realms!
            </p>
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <span className="text-4xl">✨</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen text-white transition-colors duration-300">

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/80 backdrop-blur-sm border-b border-neutral-800' : ''}`}>
        <div className="container--wide flex items-center justify-between py-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-100"
          >
            Gautam Manchandani
          </motion.h1>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={item === 'Bored?' ? '#' : `#${item.toLowerCase()}`}
                onClick={item === 'Bored?' ? () => setIsBoredModalOpen(true) : undefined}
                className="nav-button-custom"
                initial={{ opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                whileHover={{scale: 1.1}}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          {/* --- Add Mobile Menu Button --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      {/* --- Add Mobile Navigation Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-0 left-0 w-full h-screen bg-neutral-900/95 backdrop-blur-sm z-40"
          >
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={item === 'Bored?' ? '#' : `#${item.toLowerCase()}`}
                  className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false); // Close menu on any link click
                    if (item === 'Bored?') {
                      setIsBoredModalOpen(true);
                    }
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container--wide px-0 py-8 max-w-7xl">
        <AnimatePresence>
          {/* About Section */}
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 min-h-[calc(100vh-6rem)] flex items-center"
          >
            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-[450px] h-[450px] relative avatar-spot"
              >
                <div style={{position:'relative', width:'100%', height:'100%'}}>
                  <Image
                    src="/GM_PIC.png"
                    alt="Gautam Manchandani"
                    fill
                    className="object-cover object-center avatar-img"
                    priority
                  />
                </div>
              </motion.div>
              <div className="flex-1 px-6 lg:px-0">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-100">About Me</h2>
                <p className="text-lg mb-4 text-neutral-400">
                  Intern @Shopstr | Bitshala Dev Fellow | SOB&apos;25 | Former PM intern @BuildFastwithAI | 2nd@(ICCRIP 2024) | 3rd@(IITD Tryst) | CS@BITS PILANI
                </p>
                <p className="text-lg mb-8 text-neutral-400">
                  Hi, I&apos;m Gautam Manchandani, a third-year Computer Science student at BITS Pilani with a deep passion for open-source development and the Bitcoin ecosystem. I am currently honing my skills as an Open Source Bitcoin Engineer Intern at Shopstr and contributing to impactful projects as a Bitshala Dev Fellow. My journey includes a successful Summer of Bitcoin '25 mentorship and a background in AI/ML, highlighted by my contributions during Hacktoberfest '24. I am dedicated to building secure, decentralized financial solutions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="https://drive.google.com/file/d/1IC4NRo2S5wNTRNMu0VmchpKQzhc2vg25/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-neutral-900 border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-300 text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={24} className="mr-2" />
                    View Resume
                  </motion.a>
                  <motion.a
                    href="https://cal.com/gautam-manchandani"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-neutral-900 border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-300 text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar size={24} className="mr-2" />
                    Book a Call
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section
            id="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.school}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-dark-800 rounded-lg shadow-md overflow-hidden surface"
                >
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    <div className="relative h-[200px] md:h-full">
                      <Image
                        src={edu.image}
                        alt={edu.school}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-neutral-800 p-2 rounded-lg">
                          <Building className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{edu.school}</h3>
                          <p className="text-gray-300 mb-1">{edu.degree}</p>
                          <p className="text-gray-400 text-sm mb-2">{edu.duration}</p>
                          {edu.grade && (
                            <p className="text-neutral-400 font-medium">{edu.grade}</p>
                          )}
                          {edu.current && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section
            id="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, showAllProjects ? projects.length : 4).map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-dark-800 rounded-lg shadow-md overflow-hidden surface"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-sm rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-gray-100"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Github size={20} className="mr-1" />
                        GitHub
                      </motion.a>
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-gray-100"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ExternalLink size={20} className="mr-1" />
                        {project.demoType}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {projects.length > 4 && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="inline-flex items-center px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded-md hover:bg-neutral-800 transition-colors duration-300"
                >
                  {showAllProjects ? (
                    <>
                      <ChevronUp size={20} className="mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} className="mr-2" />
                      View More
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.section>

          {/* Experience Section */}
          <motion.section
            id="experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.title + exp.company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-dark-800 rounded-lg shadow-md p-6 surface"
                >
                  <div className="flex items-center mb-4">
                    <Briefcase size={24} className="text-neutral-400 mr-2" />
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-2">{exp.company}</p>
                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar size={18} className="mr-2" />
                    <span>{exp.duration}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-neutral-400 hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Learn More
                    <ExternalLink size={16} className="ml-1" />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            id="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-dark-800 border border-gray-700 p-4 rounded-lg shadow-md surface">
                <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
                {skills.technical.map((category, index) => (
                  <div key={category.category} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-semibold mb-3 text-neutral-300">{category.category}</h4>
                    <div className="space-y-2">
                      {category.items.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + skillIndex * 0.05 }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-200">{skill.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < skill.level ? "text-neutral-400 fill-current" : "text-neutral-700"}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-dark-800 border border-gray-700 p-4 rounded-lg shadow-md h-fit surface">
                <h3 className="text-2xl font-semibold mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 gap-3">
                  {skills.soft.map((skill, index) => (
                    <motion.div
                      key={skill}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-neutral-200 font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Achievements Section */}
          <motion.section
            id="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  className="bg-dark-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center surface"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <achievement.icon size={40} className="text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-300 mb-4">{achievement.description}</p>
                  {achievement.link && (
                    <motion.a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Learn More
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* GitHub Contributions Section */}
          <motion.section
            id="github"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">GitHub Contributions</h2>
            <motion.div
              className="surface p-6 flex justify-center rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <a
                href="https://github.com/GautamBytes"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubCalendar
                  username="GautamBytes"
                  colorScheme="dark"
                />
              </a>
            </motion.div>
          </motion.section>

          {/* YouTube Section */}
          <motion.section
            id="youtube"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">YouTube Channel</h2>
            <motion.div
              className="bg-dark-800 rounded-2xl p-8 surface"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    <Image
                      src="/Youtube_img.jpg"
                      alt="YouTube Channel Coming Soon"
                      fill
                      className="rounded-xl object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center shadow-lg">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-gray-100">
                        Exciting Content Coming Soon!
                      </h3>
                      <p className="text-gray-300 text-lg">
                        Get ready for an amazing journey into the world of technology! Subscribe now and be the first to experience:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-2 text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-500" />
                          </span>
                          <span>AI/ML Project Tutorials</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-500" />
                          </span>
                          <span>Web Development Tips & Tricks</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-500" />
                          </span>
                          <span>Tech Industry Insights</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.a
                        href="https://www.youtube.com/@GRM-0925"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 border border-neutral-700 text-white rounded-xl hover:bg-neutral-800 transition-colors duration-300 text-lg font-medium shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Youtube size={24} className="mr-2" />
                        Subscribe Now
                      </motion.a>
                      <motion.button
                        className="inline-flex items-center justify-center px-6 py-3 bg-neutral-800 text-gray-200 rounded-xl hover:bg-neutral-700 transition-colors duration-300 text-lg font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bell size={24} className="mr-2" />
                        Get Notified
                      </motion.button>
                    </div>
                  </div>
                </div>
            </motion.div>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-20 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Me</h2>
            <div className="max-w-3xl mx-auto">
              {messageSent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900 text-green-100 p-4 rounded-md text-center surface"
                >
                  <p className="text-lg font-semibold">Your message has been sent!</p>
                  <p className="mt-2">I will get back to you soon. Thank you for reaching out.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-neutral-900 text-white"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-neutral-900 text-white"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-neutral-900 text-white"
                    ></textarea>
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 border border-neutral-700 rounded-md shadow-sm text-base font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} className="mr-2" />
                    Send Message
                  </motion.button>
                </form>
              )}
              <div className="text-center my-8">
                <p className="text-neutral-400 mb-4">Or, schedule a meeting directly:</p>
                <motion.a
                  href="https://cal.com/gautam-manchandani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full max-w-xs px-4 py-3 border border-neutral-700 rounded-md shadow-sm text-base font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar size={20} className="mr-2" />
                  Book a Call on Cal.com
                </motion.a>
              </div>
              <div className="mt-8 flex justify-center space-x-6">
                <motion.a
                  href="https://www.linkedin.com/in/gautam-manchandani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a
                  href="https://github.com/GautamBytes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Github size={24} />
                </motion.a>
                <motion.a
                  href="https://x.com/GautamM96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Twitter size={24} />
                </motion.a>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="bg-dark-800 py-8 border-t border-neutral-800">
        <div className="container--wide flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Gautam Manchandani. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 bg-neutral-800 text-white p-2 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
      </footer>
      <BoredModal />
    </div>
  )
}
