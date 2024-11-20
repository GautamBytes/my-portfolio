'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Sun, Moon, Download, Github, ExternalLink, Briefcase, Calendar, Award, Star, Send, Linkedin, Twitter, ArrowUp, ChevronDown, ChevronUp, Building, X } from 'lucide-react'

export default function Home() {
  const [theme, setTheme] = useState('light')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
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
      },
      {
        category: 'APIs',
        items: [
          { name: 'Gemini API', level: 3 },
          { name: 'Openai API', level: 3 },
          { name: 'Nvidia API', level: 3 },
          { name: 'Groq API', level: 3 }
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
      image: "/bits.png",
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
      demo: 'https://drive.google.com/file/d/15yS1u18rkn8H9NPCrLcZeqOBAeHDz8dE/view?usp=drive_link'
    },
    {
      title: 'Vehicle Detection System',
      description: 'An advanced machine learning application for real-time vehicle detection and classification, utilizing YOLO algorithm for accurate and efficient results.',
      technologies: ['Machine Learning', 'YOLO', 'Computer Vision'],
      github: 'https://github.com/GautamBytes/Jadavpur_Hackathon',
      demo: 'https://drive.google.com/file/d/1C23wweeOFtJIo_OV5zEpsUBD97LbbqFR/view?usp=drive_link'
    },
    {
      title: 'Contract Risk Assessor',
      description: 'This tool, developed as part of the Contract Risk Assessment Hackathon, focuses on using Natural Language Processing (NLP) to analyze and extract key clauses from construction contract documents. The tool answers specific queries about contract details, providing concise summaries and insights.',
      technologies: ['NLP', 'Document Analysis', 'AI'],
      github: 'https://github.com/GautamBytes/IITM_HACKATHON',
      demo: 'https://drive.google.com/file/d/1rRiQIALYMmYL_LEgHB3CQqIyvoUcJl34/view?usp=drive_link'
    },
    {
      title: 'Gesture Recognition App',
      description: 'The Gesture Detection Web-Based App is an innovative application that captures and interprets math gestures drawn in the air, using the Gemini API. This tool is designed to facilitate interactive learning and provide instant feedback on math-related queries by recognizing gestures and converting them into meaningful responses.',
      technologies: ['Gesture Recognition', 'Gemini API', 'Web Development'],
      github: 'https://github.com/GautamBytes/Math_Gesture_Prediction_tool',
      demo: 'https://drive.google.com/file/d/1LZo4HjSHS20_3LVZmHC1KrBdcWM2SKYj/view?usp=sharing'
    },
    {
      title: 'Talaash AI',
      description: 'Talaash AI is an innovative, AI-powered education platform designed to enhance learning experiences for students preparing for competitive exams. With features like Topper&apos;s Evaluation, Quiz Generation, Mindmap Creation, and a Career Hub, Talaash AI is your personal education sidekick, providing tailored support for academic success.',
      technologies: ['AI', 'Education Technology', 'Web Development'],
      github: 'https://github.com/GautamBytes/hackathon-projects',
      demo: 'https://drive.google.com/file/d/1E8Ry9QkDpJaiFhAA12sajxPzSJO5i8JA/view?usp=sharing'
    }
  ]

  const experiences = [
    {
      title: 'PM Intern',
      company: 'BuildFastWithAI',
      duration: 'Oct 2024 - Present',
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
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = ['About', 'Education', 'Projects', 'Experience', 'Skills', 'Achievements', 'Contact', 'Bored?']

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
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">You&apos;re Amazing!</h3>
              <button
                onClick={() => setIsBoredModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                <span className="text-4xl">🎉</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
          >
            Gautam Manchandani
          </motion.h1>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={item === 'Bored?' ? '#' : `#${item.toLowerCase()}`}
                onClick={item === 'Bored?' ? () => setIsBoredModalOpen(true) : undefined}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 transition-colors duration-300"
                initial={{ opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
                whileHover={{scale: 1.1}}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
                className="w-full lg:w-[450px] h-[450px] relative overflow-hidden rounded-full shadow-2xl"
              >
                <Image
                  src="/GM_PIC.png"
                  alt="Gautam Manchandani"
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  priority
                />
              </motion.div>
              <div className="flex-1 px-6 lg:px-0">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">About Me</h2>
                <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                  PM intern @BuildFastwithAI | Hacktoberfest&apos;24 | WOB&apos;24 | Runner-Up(ICCRIP 2024) | 3rd@(IITD Tryst) | CS@BITS PILANI
                </p>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-200">
                  Hi, I&apos;m Gautam Manchandani, a second-year Computer Science student at BITS Pilani with a passion for AI/ML innovation and open-source contributions. Currently serving as a Product Manager Intern at Build Fast with AI, where I&apos;m gaining hands-on experience in AI product development and management. I recently participated in Hacktoberfest 2024, successfully contributing 23 PRs with 10 merged, demonstrating my commitment to collaborative development and code quality.
                </p>
                <motion.a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={24} className="mr-2" />
                  Download Resume
                </motion.a>
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
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
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
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                          <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{edu.school}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-1">{edu.degree}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{edu.duration}</p>
                          {edu.grade && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{edu.grade}</p>
                          )}
                          {edu.current && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Github size={20} className="mr-1" />
                        GitHub
                      </motion.a>
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ExternalLink size={20} className="mr-1" />
                        Demo Video
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
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
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
                  key={exp.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <Briefcase size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{exp.company}</p>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar size={18} className="mr-2" />
                    <span>{exp.duration}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">{exp.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
                {skills.technical.map((category, index) => (
                  <div key={category.category} className="mb-6 last:mb-0">
                    <h4 className="text-lg font-semibold mb-3 text-primary">{category.category}</h4>
                    <div className="space-y-2">
                      {category.items.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + skillIndex * 0.05 }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700 dark:text-gray-200">{skill.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < skill.level ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md h-fit">
                <h3 className="text-2xl font-semibold mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 gap-3">
                  {skills.soft.map((skill, index) => (
                    <motion.div
                      key={skill}
                      className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-blue-800 dark:text-blue-100 font-medium">{skill}</span>
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
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <achievement.icon size={40} className="text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{achievement.description}</p>
                  {achievement.link && (
                    <motion.a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Learn More 🏹
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </div>
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
                  className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-4 rounded-md text-center"
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} className="mr-2" />
                    Send Message
                  </motion.button>
                </form>
              )}
              <div className="mt-8 flex justify-center space-x-6">
                <motion.a
                  href="https://www.linkedin.com/in/gautam-manchandani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a
                  href="https://github.com/GautamBytes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Github size={24} />
                </motion.a>
                <motion.a
                  href="https://x.com/GautamM96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Twitter size={24} />
                </motion.a>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} Gautam Manchandani. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 bg-blue-600 text-white p-2 rounded-full shadow-lg"
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
