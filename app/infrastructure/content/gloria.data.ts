import type { Cv } from '~/domain/cv/types'

/**
 * Single source of truth for the site content. Facts come from Gloria's CV;
 * the jokes are the only invented part.
 */
export const gloriaCv: Cv = {
  profile: {
    name: 'Gloria Galasso',
    headline: 'NLP and LLM data scientist',
    location: 'Stuttgart, Germany',
    email: 'fangalasso@gmail.com',
    tagline: 'I teach machines to read, listen and (sometimes) explain themselves.',
    focusAreas: ['text classification', 'LLM fine-tuning', 'speech & health', 'information extraction', 'interpretability'],
    availability: 'Open to work · Stuttgart or remote',
    summary: [
      'NLP and LLM data scientist with an M.Sc. in Computational Linguistics and hands-on Python experience in text classification, information extraction and fine-tuning.',
      'Experienced in building tested, reproducible ML pipelines on AWS, and in turning ambitious research ideas into working tools together with technical and domain experts.',
    ],
    links: [
      { id: 'github', label: 'GitHub', url: 'https://github.com/gloriagalasso' },
      { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/gloria-g-923657221/' },
    ],
    photo: {
      webp: '/images/gloria.webp',
      jpg: '/images/gloria.jpg',
      alt: 'Portrait of Gloria Galasso',
    },
    cvPdf: '/cv-gloria-galasso.pdf',
  },

  experience: [
    {
      id: 'modality',
      role: 'Clinical AI/ML Intern',
      organization: 'Modality.ai',
      location: 'San Francisco, USA (remote)',
      period: { start: '2026-06', end: '2026-11' },
      kind: 'industry',
      summary: 'Multimodal LLMs for ALS assessment from speech and facial video.',
      highlights: [
        'Benchmarked 8 ML approaches on 7,389 patient videos; Qwen2.5-Omni embeddings outperformed clinical speech measures (balanced accuracy 0.72 vs. 0.66).',
        'Fine-tuned Qwen2.5-Omni-3B and explored LoRA and zero-shot prompting for video captioning.',
        'Built a tested Python pipeline (PyTorch, scikit-learn, pytest) on AWS with Git.',
      ],
      quip: 'Models that listen and watch faces. Multitasking, finally.',
    },
    {
      id: 'stuttgart-research',
      role: 'Research Assistant',
      organization: 'University of Stuttgart',
      location: 'Computational Social Science Department, Stuttgart, Germany',
      period: { start: '2026-03', end: '2026-09' },
      kind: 'research',
      summary: 'Named-entity extraction from biomedical patents and research papers.',
      highlights: [
        'Built and evaluated named-entity extraction pipelines with GLiNER on biomedical patent claims and research papers.',
        'Ran error analysis on missed entities and boundary errors.',
      ],
      quip: 'Spent quality time with patent claims so you do not have to.',
    },
    {
      id: 'gopa',
      role: 'Project Coordinator',
      organization: 'GOPA Com.',
      location: 'Brussels, Belgium',
      period: { start: '2022', end: '2023' },
      kind: 'policy',
      summary: 'EU and public affairs & communications projects.',
      highlights: [],
      quip: 'Fluent in "EU policy"',
    },
    {
      id: 'wonca',
      role: 'Project Manager',
      organization: 'WONCA Europe / EPR',
      location: 'Brussels, Belgium',
      period: { start: '2020', end: '2021' },
      kind: 'policy',
      summary: 'European healthcare communications & policy support.',
      highlights: [],
      quip: 'Healthcare policy, long before healthcare data.',
    },
  ],

  projects: [
    {
      id: 'thesis',
      title: 'Text Classification for Alzheimer’s Disease Detection',
      institution: 'M.Sc. thesis · University of Stuttgart',
      period: { start: '2025', end: '2026' },
      highlights: [
        'Fine-tuned BERT-based transformers to classify spontaneous-speech transcripts, and compared them with logistic regression on linguistic features engineered with the ELFEN library.',
        'Interpretability: applied Integrated Gradients to identify which words drove the transformers’ predictions, and compared them with the most predictive engineered features.',
        'Evaluated cross-dataset generalization and subgroup robustness.',
      ],
      tags: ['BERT', 'ELFEN', 'Integrated Gradients', 'Interpretability'],
      quip: 'Peeked inside the black box. It had opinions.',
    },
    {
      id: 'infant-cry',
      title: 'Infant Cry Audio Classification',
      institution: 'Speech technology project',
      period: { start: '2025', end: '2025' },
      highlights: [
        'Extracted MFCC and log-Mel spectrogram features with Librosa and trained 1D CNNs (TensorFlow/Keras) for infant-cry classification.',
      ],
      tags: ['Librosa', 'MFCC', '1D CNN', 'TensorFlow/Keras'],
      quip: 'The loudest dataset, with zero complaints about the labelling.',
    },
  ],

  skills: [
    {
      id: 'nlp',
      key: 'nlp_and_llms',
      label: 'NLP & LLMs',
      skills: ['LLMs', 'Generative AI', 'Transformers (BERT, Qwen)', 'Text classification', 'Information extraction / NER', 'LoRA fine-tuning', 'Prompt engineering'],
    },
    {
      id: 'ml',
      key: 'machine_learning',
      label: 'ML',
      skills: ['Python', 'PyTorch', 'scikit-learn', 'Hugging Face Transformers'],
    },
    {
      id: 'speech',
      key: 'speech_audio',
      label: 'Speech / Audio',
      skills: ['Librosa', 'Praat', 'MFCC', 'Mel-spectrograms'],
    },
    {
      id: 'tools',
      key: 'tooling',
      label: 'Tools',
      skills: ['AWS', 'Git / GitHub', 'pytest', 'Poetry', 'Linux', 'LaTeX'],
    },
  ],

  languages: [
    { name: 'Italian', level: 'Native' },
    { name: 'English', level: 'C1' },
    { name: 'German', level: 'B2', note: 'B2.2 in progress' },
    { name: 'French', level: 'B1' },
    { name: 'Spanish', level: 'B1' },
  ],

  education: [
    {
      id: 'msc',
      degree: 'Master of Science in Computational Linguistics',
      institution: 'University of Stuttgart',
      location: 'Stuttgart, Germany',
      period: { start: '2023-10', end: '2026-07' },
      highlights: [
        'NLP & ML: Natural Language Processing, Text Technology, Information Retrieval and Text Mining, Computational Semantics, Deep Learning for Speech and Text Processing.',
        'Speech & health: Speech Analysis for Health Care Applications, Current Topics in Speech Technology, Topics in Phonetics.',
      ],
    },
    {
      id: 'ma',
      degree: 'Master of Arts in International Development',
      institution: 'University of Kent, Brussels School of International Studies',
      location: 'Brussels, Belgium',
      period: { start: '2019-09', end: '2022-04' },
      highlights: ['Coursework in international human rights law and health care in humanitarian disasters.'],
    },
    {
      id: 'ba',
      degree: 'B.A. in Linguistic Sciences for International Relations',
      institution: 'Università Cattolica del Sacro Cuore',
      location: 'Milan, Italy',
      period: { start: '2016', end: '2019-07' },
      grade: '110/110 cum laude',
      highlights: ['English, German and Spanish, general linguistics.'],
    },
  ],

  questions: [
    {
      id: 'finetune',
      prompt: 'Can she fine-tune an LLM?',
      answer:
        'Yes. At Modality.ai she fine-tuned Qwen2.5-Omni-3B and explored LoRA and zero-shot prompting for video captioning. Her M.Sc. thesis fine-tuned BERT-based transformers too.',
      confidence: 0.98,
      source: 'Experience › Modality.ai',
    },
    {
      id: 'tests',
      prompt: 'Does she ship tested, reproducible code?',
      answer:
        'Routinely. Her pipeline was written in Python (PyTorch, scikit-learn), tested with pytest, versioned with Git and run on AWS.',
      confidence: 0.97,
      source: 'Experience › Modality.ai',
    },
    {
      id: 'explain',
      prompt: 'Can she explain what her models are doing?',
      answer:
        'Yes. She used Integrated Gradients to see which words drove transformer predictions, then compared them with the most predictive engineered linguistic features.',
      confidence: 0.95,
      source: 'Projects › Thesis',
    },
    {
      id: 'german',
      prompt: 'Does she speak German?',
      answer:
        'Ja. B2 today, B2.2 in progress, and she is based in Stuttgart. Also Italian (native), English (C1), French and Spanish (B1).',
      confidence: 0.99,
      source: 'Languages',
    },
    {
      id: 'teams',
      prompt: 'Can she work with non-technical experts?',
      answer:
        'It is her second language. Before NLP she coordinated EU and public-affairs projects in Brussels and managed a European healthcare communications and policy project. Now she turns research ideas into working tools together with technical and domain experts.',
      confidence: 0.96,
      source: 'Experience › Brussels',
    },
    {
      id: 'available',
      prompt: 'Is she available?',
      answer:
        'Yes. M.Sc. done, based in Stuttgart, experienced in remote work. Output confidence is high; please act on it.',
      confidence: 1,
      source: 'This page, honestly',
    },
  ],
}
