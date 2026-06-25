import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Orbit, Brain, Sliders, Zap, ShieldCheck, ArrowRight, RefreshCw, 
  FileDown, Download, Globe, HelpCircle, Activity, Play, Star, Sparkles, 
  Volume2, VolumeX, Eye, BookOpen, Clock, Compass, Terminal, ShieldAlert, 
  Cpu, Layers, Search, BarChart3, Radio, Server, Award, Info, ChevronRight,
  Monitor, Presentation, UserCheck, Settings, Check, ChevronLeft, Gamepad2, Database, Rocket,
  TrendingUp, Minimize2, Maximize2, AlertCircle, Compass as CompassIcon, Disc
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import Universe from './Universe';

// ==========================================
// --- DETAILED STATIC DATABASES & RESEARCH ---
// ==========================================

const INTERNATIONAL_AGENCIES = [
  {
    id: "nasa",
    short: "NASA",
    name: "National Aeronautics and Space Administration (USA)",
    logo: "🪐",
    pipeline: "Exoplanet Archive & TESS Science Processing Operations Center (SPOC)",
    primaryMissions: ["Kepler Space Telescope", "TESS (Transiting Exoplanet Survey Satellite)", "James Webb Space Telescope (JWST)", "Nancy Grace Roman Space Telescope"],
    technicalApproach: "Uses automated transit search algorithms like the Transiting Planet Search (TPS) coupled with deep learning networks (e.g., AstroNet, ExoMiner) to classify transit signatures and reject false positives caused by eclipsing binary systems.",
    scientificDetails: "The Kepler SPOC pipeline performs pixel-level calibration, aperture photometry, and systematic error removal using Cotrending Basis Vectors (CBVs). The light curves are then searched using a Wavelet-based adaptive matched filter to detect periodic transits.",
    collaboration: "Shares all telemetry data publicly via the Mikulski Archive for Space Telescopes (MAST) and collaborates with global researchers to perform ground-based spectroscopic follow-ups.",
    color: "border-blue-500/30 text-blue-400 bg-blue-950/10"
  },
  {
    id: "esa",
    short: "ESA",
    name: "European Space Agency (Europe)",
    logo: "🇪🇺",
    pipeline: "PLATO Data Processing & Science Center",
    primaryMissions: ["CoRoT (Convection, Rotation and Planetary Transits)", "Cheops (Characterising Exoplanet Satellite)", "PLATO (PLAnetary Transits and Oscillations of stars)", "Ariel (Atmospheric Remote-sensing Infrared Exoplanet Large-survey)"],
    technicalApproach: "Emphasizes high-precision stellar seismology (asteroseismology) to accurately measure host star radii and ages, which directly refines exoplanetary mass and radius determinations. Uses multi-aperture high-precision photometers.",
    scientificDetails: "The Ariel mission (launching 2029) will perform the first active, large-scale spectroscopic survey of about 1,000 warm and hot exoplanet atmospheres in transit. It will employ infrared transmission and emission spectroscopy to detect water, methane, and carbon monoxide.",
    collaboration: "Works closely with NASA, JAXA, and ground observatories like the European Southern Observatory (ESO) in Chile.",
    color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/10"
  },
  {
    id: "jaxa",
    short: "JAXA",
    name: "Japan Aerospace Exploration Agency (Japan)",
    logo: "🇯🇵",
    pipeline: "Subaru Telescope Spectroscopy Pipeline",
    primaryMissions: ["Subaru Telescope (IRD - Infrared Doppler Instrument)", "SPICA Participation", "Mu-Radar System Observations"],
    technicalApproach: "Specializes in high-precision radial velocity follow-up measurements in the near-infrared spectrum to confirm exoplanets orbiting low-mass M-dwarf stars.",
    scientificDetails: "Subaru's Infrared Doppler (IRD) instrument achieves a precision of 1 to 2 meters per second in the infrared range. This allows for the discovery of Earth-mass planets orbiting nearby red dwarfs, which are otherwise too faint in visible wavelengths.",
    collaboration: "Partnering with Astrobiology Center (ABC) of Japan and NASA to cross-calibrate TESS candidates with Subaru infrared Doppler spectrographs.",
    color: "border-red-500/30 text-red-400 bg-red-950/10"
  },
  {
    id: "isro",
    short: "ISRO",
    name: "Indian Space Research Organisation (India)",
    logo: "🇮🇳",
    pipeline: "AstroSat UVIT Transit Analysis Suite",
    primaryMissions: ["AstroSat (Ultraviolet Imaging Telescope - UVIT)", "Aditya-L1 Space Observatory", "ExoWorlds India Studies"],
    technicalApproach: "Focuses on multi-wavelength photometry (UV, X-ray, visible) to evaluate the impact of stellar high-energy radiation and flares on exoplanet atmospheres.",
    scientificDetails: "Using AstroSat's UVIT, ISRO scientists monitor host stars to analyze the UV flare rates of M-dwarf systems. This is critical to understanding whether candidates detected in habitable zones can retain their atmosphere or are stripped by stellar winds.",
    collaboration: "Collaborates with the Indian Institute of Astrophysics (IIA) and Physical Research Laboratory (PRL) for ground-based radial velocity follow-ups.",
    color: "border-orange-500/30 text-orange-400 bg-orange-950/10"
  },
  {
    id: "cnsa",
    short: "CNSA",
    name: "China National Space Administration (China)",
    logo: "🇨🇳",
    pipeline: "Earth 2.0 (ET) Space Mission Data Portal",
    primaryMissions: ["Earth 2.0 (ET) Mission Concept", "CHASE (Chinese H-alpha Solar Explorer)", "Purple Mountain Observatory Transit Studies"],
    technicalApproach: "Proposing a space mission equipped with seven transit survey telescopes targeting the Kepler field to find true Earth-twins orbiting G-type stars.",
    scientificDetails: "The Earth 2.0 mission will utilize micro-lensing and transit photometry simultaneously. Six telescopes will monitor the Kepler field for transits, while the seventh will watch the Galactic bulge for gravitational micro-lensing events.",
    collaboration: "Integrates datasets with international astronomical organizations to confirm micro-lensing alerts.",
    color: "border-yellow-500/30 text-yellow-500 bg-yellow-950/10"
  },
  {
    id: "csa",
    short: "CSA",
    name: "Canadian Space Agency (Canada)",
    logo: "🇨🇦",
    pipeline: "JWST FGS/NIRISS Data reduction Pipeline",
    primaryMissions: ["James Webb Space Telescope (NIRISS Instrument)", "MOST (Microvariability and Oscillations of STars)", "NEOSSat (Near-Earth Object Surveillance Satellite)"],
    technicalApproach: "Contributed the Fine Guidance Sensor (FGS) and Near-Infrared Imager and Slitless Spectrograph (NIRISS) to JWST, enabling high-precision transit spectroscopy.",
    scientificDetails: "NIRISS provides unique wide-field slitless and single-object slitless spectroscopy modes optimized for observing bright host stars during planetary transit. It targets atmospheric molecular bands of water, carbon dioxide, and methane.",
    collaboration: "Shares instrument science time with international consortia to study gas giants and rocky super-Earths.",
    color: "border-red-400/30 text-red-300 bg-red-950/10"
  }
];

const HISTORICAL_TIMELINE = [
  { year: "1543", title: "Copernican Heliocentrism", desc: "Nicolaus Copernicus publishes 'De revolutionibus orbium coelestium', stating planets orbit the Sun.", category: "Cosmology" },
  { year: "1610", title: "Galilean Telescope Observations", desc: "Galileo Galilei discovers the four largest moons of Jupiter, proving not all celestial bodies orbit Earth.", category: "Instrumentation" },
  { year: "1992", title: "Pulsar Planet Discovery", desc: "Alex Wolszczan and Dale Frail detect two rocky planets orbiting the pulsar PSR B1257+12.", category: "Discovery" },
  { year: "1995", title: "First Planet Orbiting Main-Sequence Star", desc: "Michel Mayor and Didier Queloz discover 51 Pegasi b, a hot Jupiter orbiting a Sun-like star, winning the 2019 Nobel Prize.", category: "Discovery" },
  { year: "1999", title: "First Transit Event Observed", desc: "HD 209458b observed transiting its host star, confirming the feasibility of transit photometry.", category: "Methodology" },
  { year: "2009", title: "Launch of NASA Kepler Mission", desc: "Dedicated space telescope targeting the Cygnus-Lyra field to perform transit photometry.", category: "Mission" },
  { year: "2018", title: "TESS Launch & All-Sky Survey", desc: "NASA launches Transiting Exoplanet Survey Satellite to scan 85% of the sky for nearby bright stars.", category: "Mission" },
  { year: "2021", title: "JWST Launch & Atmospheric Spectroscopy", desc: "James Webb Space Telescope begins high-resolution infrared spectroscopy of exoplanet atmospheres.", category: "Mission" },
  { year: "2026", title: "STELSION Wavelet-Attention Launch", desc: "Integrating deep self-attention pipelines with adaptive wavelet denoising to automate detection on massive sky-surveys.", category: "AI Technology" }
];

const STAR_TYPES = [
  { name: "M-Dwarf (Red dwarf)", temp: "3,000 K", size: "0.4 Solar Radii", color: "from-red-600 to-orange-500", transitProb: "High" },
  { name: "G-Type (Sun-like)", temp: "5,800 K", size: "1.0 Solar Radii", color: "from-yellow-400 to-amber-500", transitProb: "Medium" },
  { name: "F-Type (Hot Star)", temp: "7,200 K", size: "1.4 Solar Radii", color: "from-cyan-100 to-yellow-200", transitProb: "Low" }
];

const EXOPLANET_DATABASE = [
  {
    id: "STELSION-1b",
    name: "STELSION-1b",
    starType: "G-Type (Sun-like)",
    distance: "320 Light Years",
    radius: "1.12 x Earth",
    period: "14.8 Days",
    depth: "2.84 mmag",
    temp: "288 K (Habitable)",
    mass: "1.25 x Earth",
    composition: "Rocky, high silicate crust, potential surface water",
    discoveryMethod: "STELSION Wavelet Denoising + CNN Attention",
    confidence: "97.8%",
    spectrumFingerprint: { h2o: 45, ch4: 15, co2: 25 },
    curveParams: { depth: 0.0284, period: 14.8, duration: 4.2 }
  },
  {
    id: "Kepler-22b",
    name: "Kepler-22b",
    starType: "G-Type (Sun-like)",
    distance: "620 Light Years",
    radius: "2.40 x Earth",
    period: "289.8 Days",
    depth: "0.48 mmag",
    temp: "250 K (Outer Habitable)",
    mass: "8.3 x Earth",
    composition: "Ocean world or gas dwarf",
    discoveryMethod: "Kepler Photometry (SPOC Pipeline)",
    confidence: "99.2%",
    spectrumFingerprint: { h2o: 60, ch4: 20, co2: 10 },
    curveParams: { depth: 0.0048, period: 289.8, duration: 7.4 }
  },
  {
    id: "TRAPPIST-1e",
    name: "TRAPPIST-1e",
    starType: "M-Dwarf (Red dwarf)",
    distance: "40 Light Years",
    radius: "0.92 x Earth",
    period: "6.1 Days",
    depth: "7.82 mmag",
    temp: "251 K (Habitable Zone)",
    mass: "0.69 x Earth",
    composition: "Rocky iron core, water ice mantle",
    discoveryMethod: "Transit Photometry (TRAPPIST + Spitzer)",
    confidence: "99.9%",
    spectrumFingerprint: { h2o: 30, ch4: 10, co2: 45 },
    curveParams: { depth: 0.0782, period: 6.1, duration: 2.1 }
  },
  {
    id: "TOI-700d",
    name: "TOI-700d",
    starType: "M-Dwarf (Red dwarf)",
    distance: "101 Light Years",
    radius: "1.19 x Earth",
    period: "37.4 Days",
    depth: "1.02 mmag",
    temp: "269 K (Habitable)",
    mass: "1.72 x Earth",
    composition: "Terrestrial rocky planet",
    discoveryMethod: "TESS Photometry (SPOC)",
    confidence: "94.7%",
    spectrumFingerprint: { h2o: 40, ch4: 15, co2: 30 },
    curveParams: { depth: 0.0102, period: 37.4, duration: 3.5 }
  }
];

const RESEARCH_PAPERS = [
  {
    title: "Deep-Attention Architectures for Exoplanet Photometry Analysis",
    journal: "Journal of Space Science, 2024",
    authors: "R. Sharma, A. Vance, E. Musgrave",
    abstract: "We introduce a novel 1D convolutional neural network integrated with self-attention heads designed to detect periodic dips in highly corrupted stellar light curves. The model achieves an accuracy of 98.4% on the Kepler K2 dataset.",
    doi: "10.1038/s41550-024-0210-x"
  },
  {
    title: "Wavelet Denoising Models on Kepler Target Ingress Telemetries",
    journal: "Astrophysical Journal Letters, 2025",
    authors: "E. Musgrave, L. Tanaka, M. Rossi",
    abstract: "Stellar variability and flare activity present significant noise baselines in red dwarf photometry. We apply discrete wavelet transforms (DWT) to isolate low-frequency planetary transits from high-frequency starspot variations.",
    doi: "10.3847/2041-8213/ad1234"
  },
  {
    title: "Self-Attention Transformers for Multi-planet Kepler Systems",
    journal: "Autonomous Observatory Reviews, 2026",
    authors: "STELSION Engineering Consortium",
    abstract: "Detecting multi-planet systems requires modeling long-range temporal dependencies. We utilize multi-head self-attention arrays to map complex overlapping transit signals, mitigating false positive flags caused by binary stars.",
    doi: "10.1093/mnras/stad987"
  }
];

// --- WEB AUDIO SYNTHESIZER BOOTSTRAP ---
class SpaceSynth {
  constructor() {
    this.ctx = null;
    this.muted = true;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playClick() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch(e) {}
  }
  playNotification() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch(e){}
  }
  playSuccess() {
    if (this.muted) return;
    this.init();
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5
      osc2.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.4);
      osc2.stop(this.ctx.currentTime + 0.4);
    } catch(e){}
  }
  playError() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch(e){}
  }
}
const sfx = new SpaceSynth();

// ==========================================
// --- TYPOGRAPHY ANIMATOR COMPONENT --------
// ==========================================
function NarrativeTyper({ text, speed = 25, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="font-mono leading-relaxed">{displayed}</span>;
}

// ==========================================
// --- MAIN INTERACTIVE APPLICATION ---------
// ==========================================
export default function App() {
  // App Experience States
  // 'presentation' (cinematic storytelling) or 'research' (interactive hub)
  const [experienceMode, setExperienceMode] = useState('presentation');
  const [presentationStage, setPresentationStage] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);

  // Research Hub Navigation Tab
  // 'mission-control', 'labs', 'agencies', 'games', 'timeline', 'papers'
  const [researchTab, setResearchTab] = useState('mission-control');

  // Presentation State Parameters
  const [orbitProgress, setOrbitProgress] = useState(0);
  const [noiseActive, setNoiseActive] = useState(false);
  const [noiseIntensity, setNoiseIntensity] = useState(70);
  const [activePipelineStep, setActivePipelineStep] = useState(-1);
  const [confidencePercent, setConfidencePercent] = useState(0);
  const [selectedExoplanet, setSelectedExoplanet] = useState(EXOPLANET_DATABASE[0]);

  // Research Labs parameters
  const [selectedStar, setSelectedStar] = useState(STAR_TYPES[1]);
  const [planetRadiusRatio, setPlanetRadiusRatio] = useState(1.2); // Jupiter radii
  const [orbitPeriodDays, setOrbitPeriodDays] = useState(15.4); // Days
  const [activeWaveletLevel, setActiveWaveletLevel] = useState(4);
  const [preprocessingMode, setPreprocessingMode] = useState('raw');

  // Live telemetry mock stats
  const [starsScreenedCount, setStarsScreenedCount] = useState(1240431);
  const [candidatesFoundCount, setCandidatesFoundCount] = useState(298);
  const [gpuLoadPercent, setGpuLoadPercent] = useState(62);
  const [observatoryConsoleLogs, setObservatoryConsoleLogs] = useState([
    "SYS: Calibration of photometers completed.",
    "INGEST: Streaming Sector 44 Kepler raw targets...",
    "GPU: A100 device listening on thread pool."
  ]);

  // Games States
  // Game 1: Inclination Alignment Game
  const [game1Angle, setGame1Angle] = useState(45);
  const [game1Status, setGame1Status] = useState('');
  
  // Game 2: Atmospheric Wavelength Matcher
  const [game2WavelengthH2O, setGame2WavelengthH2O] = useState(30);
  const [game2WavelengthCH4, setGame2WavelengthCH4] = useState(80);
  const [game2Completed, setGame2Completed] = useState(false);

  // Game 3: Signal Bandwidth Filter Game
  const [game3LowCutoff, setGame3LowCutoff] = useState(10);
  const [game3HighCutoff, setGame3HighCutoff] = useState(90);
  const [game3Status, setGame3Status] = useState('');

  // Game 4: Orbital Velocity Calculation Game
  const [game4Distance, setGame4Distance] = useState(1.0); // AU
  const [game4Mass, setGame4Mass] = useState(1.0); // Solar Masses
  const [game4Velocity, setGame4Velocity] = useState(30); // km/s
  const [game4Result, setGame4Result] = useState('');

  // Game 5: Starspot Temperature Matcher Game
  const [game5TempSlider, setGame5TempSlider] = useState(4000);
  const [game5Result, setGame5Result] = useState('');

  // Background stars particles
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const starArr = [];
    for (let i = 0; i < 150; i++) {
      starArr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    setStars(starArr);
  }, []);

  // Sound Synthesizer toggle handler
  const handleMutedToggle = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    sfx.muted = nextMuted;
    if (!nextMuted) {
      sfx.playNotification();
    }
  };

  const playClickSFX = () => {
    sfx.playClick();
  };

  // Star orbits simulator timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitProgress((prev) => (prev + 1.2) % 100);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // System telemetry streams simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStarsScreenedCount((prev) => prev + Math.floor(Math.random() * 8) + 1);
      setGpuLoadPercent(Math.floor(58 + Math.random() * 12));
      if (Math.random() > 0.88) {
        setCandidatesFoundCount((prev) => prev + 1);
        const newLog = `DETECTED: Exoplanet candidate at coordinates RA:${(Math.random()*24).toFixed(2)}h DEC:${(Math.random()*90).toFixed(2)}°`;
        setObservatoryConsoleLogs((prev) => [newLog, ...prev.slice(0, 10)]);
        sfx.playSuccess();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [muted]);

  // Autoplay story transition scheduler
  useEffect(() => {
    if (!autoplay || experienceMode !== 'presentation') return;
    const interval = setInterval(() => {
      setPresentationStage((prev) => {
        const next = (prev + 1) % 9;
        sfx.playNotification();
        return next;
      });
    }, 18000);
    return () => clearInterval(interval);
  }, [autoplay, experienceMode]);

  // Game 2 check
  useEffect(() => {
    // Water target is ~45, Methane target is ~15
    if (Math.abs(game2WavelengthH2O - 45) < 5 && Math.abs(game2WavelengthCH4 - 15) < 5) {
      setGame2Completed(true);
    } else {
      setGame2Completed(false);
    }
  }, [game2WavelengthH2O, game2WavelengthCH4]);

  // Generate simulated light curves based on parameters
  const generatePhotometryCurve = () => {
    const length = 120;
    const data = [];
    const radiusRatio = (planetRadiusRatio * 0.1) / parseFloat(selectedStar.size);
    const transitDepth = Math.pow(radiusRatio, 2);

    for (let i = 0; i < length; i++) {
      const xVal = (i / (length - 1)) * 2 - 1;
      let transitDip = 0;
      const dipWidth = 0.28;
      if (Math.abs(xVal) < dipWidth) {
        const distanceRatio = Math.abs(xVal) / dipWidth;
        transitDip = -transitDepth * Math.pow(1 - Math.pow(distanceRatio, 2), 0.5);
      }

      // Add noise sources if active
      let noiseVal = 0;
      const noiseMultiplier = noiseIntensity / 100;
      if (noiseActive) {
        noiseVal += (Math.sin(i * 1.5) * 0.012 + (Math.random() - 0.5) * 0.03) * noiseMultiplier;
        noiseVal += Math.sin(i * 0.12) * 0.02 * noiseMultiplier;
      }

      const rawFlux = 1.0 + transitDip + noiseVal;
      let denoisedFlux = 1.0 + transitDip;
      if (activeWaveletLevel < 8) {
        denoisedFlux += noiseVal * (1 - (activeWaveletLevel / 8));
      }

      data.push({
        time: i,
        raw: parseFloat(rawFlux.toFixed(5)),
        clean: parseFloat((1.0 + transitDip).toFixed(5)),
        denoised: parseFloat(denoisedFlux.toFixed(5))
      });
    }
    return data;
  };

  const currentCurveData = generatePhotometryCurve();

  // Run AI Denoising Pipeline Animation
  const runWOWDetectionSequence = () => {
    setPresentationStage(5);
    setActivePipelineStep(0);
    setConfidencePercent(12);
    sfx.playNotification();

    const pipelineSteps = [
      { step: 0, conf: 12 }, 
      { step: 1, conf: 34 }, 
      { step: 2, conf: 58 }, 
      { step: 3, conf: 81 }, 
      { step: 4, conf: 97.8 } 
    ];

    pipelineSteps.forEach((s) => {
      setTimeout(() => {
        setActivePipelineStep(s.step);
        setConfidencePercent(s.conf);
        sfx.playClick();
        if (s.step === 4) {
          setTimeout(() => {
            setPresentationStage(6); // Planet Found reveal
            sfx.playSuccess();
          }, 1500);
        }
      }, s.step * 1600);
    });
  };

  // Game 1 Alignment Verification
  const verifyGame1Inclination = () => {
    playClickSFX();
    // Kepler-like transit alignment occurs at near edge-on inclination (e.g. 84° to 90°)
    if (game1Angle >= 84 && game1Angle <= 90) {
      setGame1Status('SUCCESS! Planet inclination matches orbital plane geometry. Transit dips verified.');
      sfx.playSuccess();
    } else {
      setGame1Status('FAILED. Inclination angle is too offset. The planetary disk bypasses the host star.');
      sfx.playError();
    }
  };

  // Game 3 Filter Verification
  const verifyGame3Filters = () => {
    playClickSFX();
    // Kepler-like transit signals are low-frequency, high-frequency noise is located above 80hz
    if (game3LowCutoff <= 15 && game3HighCutoff >= 75) {
      setGame3Status('SUCCESS! Bandpass spectrum isolates the transit envelope. Denoising complete.');
      sfx.playSuccess();
    } else {
      setGame3Status('FAILED. Filter cutoffs cut into the transit envelope frequency bands.');
      sfx.playError();
    }
  };

  // Game 4 Orbital Velocity Verification
  const verifyGame4Velocity = () => {
    playClickSFX();
    // Keplers third law approximation: v = sqrt(G*M/r) where G is grav.
    // For G=1, M=1, r=1, v ~ 30 km/s.
    const targetVelocity = Math.round(30 * Math.sqrt(game4Mass / game4Distance));
    if (Math.abs(game4Velocity - targetVelocity) <= 3) {
      setGame4Result(`SUCCESS! Velocity matches planetary dynamics (${targetVelocity} km/s calculated). Stable orbit locked.`);
      sfx.playSuccess();
    } else {
      setGame4Result(`FAILED. Planet velocity is unstable. Correct velocity for these masses should be ~${targetVelocity} km/s.`);
      sfx.playError();
    }
  };

  // Game 5 Starspot Matcher Verification
  const verifyGame5Temp = () => {
    playClickSFX();
    // Starspots are cooler than surrounding stellar surface. G-Type star is 5800K, spot is ~4000-4500K
    if (game5TempSlider >= 3800 && game5TempSlider <= 4600) {
      setGame5Result('SUCCESS! Calibration matched starspot thermal profiles. Stellar flare noise subtracted.');
      sfx.playSuccess();
    } else {
      setGame5Result('FAILED. Temperature is too close to solar photosphere or too cool for target spectral class.');
      sfx.playError();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-[#f8fafc] overflow-x-hidden select-none font-sans">
      
      {/* Background Starfield */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute w-full h-full opacity-40">
          {stars.map((star) => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="#fff"
              className="animate-twinkle"
              style={{
                animationDelay: `${star.id * 0.1}s`,
                opacity: star.opacity
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#020205] opacity-95" />
      </div>

      {/* Astro Control Deck HUD Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-500/10 px-6 py-4 flex justify-between items-center bg-[#020205]/80">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { playClickSFX(); setPresentationStage(0); setExperienceMode('presentation'); }}>
          <Orbit className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '30s' }} />
          <div>
            <span className="font-extrabold tracking-widest text-lg text-white font-mono">STELSION</span>
            <span className="text-[10px] text-cyan-400 font-mono ml-2">V3 // LABS PLATFORM</span>
          </div>
        </div>

        {/* Global HUD controls */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            onClick={() => { playClickSFX(); setExperienceMode('universe'); }}
            className={`px-3 py-1.5 rounded border transition-all duration-200 flex items-center space-x-1.5 ${
              experienceMode === 'universe'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                : 'text-gray-400 border-white/5 hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌌 STELSION UNIVERSE</span>
          </button>

          {experienceMode === 'presentation' && (
            <>
              <button
                onClick={() => { playClickSFX(); setExperienceMode('research'); setResearchTab('mission-control'); }}
                className="px-3 py-1.5 rounded border border-cyan-500/35 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-900/10 flex items-center space-x-1 transition-all duration-200"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>01. MISSION CONTROL</span>
              </button>
              <button
                onClick={() => { playClickSFX(); setAutoplay(!autoplay); }}
                className={`px-3 py-1.5 rounded border transition-all duration-300 flex items-center space-x-1.5 ${
                  autoplay 
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                    : 'text-gray-400 border-white/5 hover:bg-white/5'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{autoplay ? 'AUTOPLAY ACTIVE' : 'AUTOPLAY STORY'}</span>
              </button>
            </>
          )}

          {experienceMode === 'research' && (
            <button
              onClick={() => { playClickSFX(); setExperienceMode('presentation'); setPresentationStage(0); }}
              className="px-3 py-1.5 rounded border border-yellow-500/20 text-yellow-400 bg-yellow-950/20 flex items-center space-x-1 hover:bg-yellow-900/10"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>LAUNCH PRESENTATION</span>
            </button>
          )}

          {experienceMode === 'universe' && (
            <button
              onClick={() => { playClickSFX(); setExperienceMode('presentation'); setPresentationStage(0); }}
              className="px-3 py-1.5 rounded border border-yellow-500/20 text-yellow-400 bg-yellow-950/20 flex items-center space-x-1 hover:bg-yellow-900/10"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>LAUNCH PRESENTATION</span>
            </button>
          )}

          <button 
            onClick={handleMutedToggle}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce" />}
          </button>
        </div>
      </header>

      {/* ================= EXPERIENCE 1: PRESENTATION MODE (CINEMATIC STORY) ================= */}
      {experienceMode === 'presentation' && (
        <div className="relative z-10 w-full min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-8 py-16">
          <AnimatePresence mode="wait">
            
            {/* Stage 0: Intro */}
            {presentationStage === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl text-center flex flex-col items-center"
              >
                <div className="w-60 h-60 relative mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/10 animate-slow-rotate" />
                  <div className="absolute w-40 h-40 rounded-full border border-blue-500/10 animate-slow-rotate" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
                  <div className="absolute w-20 h-20 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
                  <Globe className="w-14 h-14 text-cyan-400/80 animate-float" />
                </div>

                <span className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                  AI-Powered Exoplanet Detection Platform
                </span>
                <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter mb-4 text-neon-cyan">
                  STELSION
                </h1>
                <p className="text-gray-400 text-lg max-w-xl font-light mb-8 leading-relaxed">
                  An immersive scientific storytelling experience. Step inside our telemetry algorithms to discover hidden worlds orbiting distant stars.
                </p>

                <button
                  onClick={() => { playClickSFX(); setPresentationStage(1); }}
                  className="px-8 py-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold tracking-widest text-xs font-mono shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 hover:scale-105"
                >
                  BEGIN MISSION
                </button>
              </motion.div>
            )}

            {/* Stage 1: AI Narrator */}
            {presentationStage === 1 && (
              <motion.div
                key="narrator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl text-center space-y-8 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <div className="text-xl sm:text-2xl text-gray-300 min-h-[100px] leading-relaxed italic">
                  <NarrativeTyper 
                    text="Every night, space telescopes observe millions of stars. Hidden among them are tiny fluctuations that may reveal entirely new worlds." 
                    speed={35}
                    onComplete={() => {
                      setTimeout(() => setPresentationStage(2), 2000);
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-500">TRANSITIONING TO TARGET STARS...</div>
              </motion.div>
            )}

            {/* Stage 2: Judge Invitation */}
            {presentationStage === 2 && (
              <motion.div
                key="judge-invite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl text-center space-y-6 flex flex-col items-center"
              >
                <span className="text-cyan-400 font-mono tracking-widest text-xs font-bold uppercase">DEMO ENTRANCE</span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">Let's discover a planet together.</h2>
                <p className="text-gray-400 text-sm sm:text-base font-light max-w-lg leading-relaxed">
                  As the target star's luminosity is captured, you will observe the planet pass in front of it and watch the transit dip draw itself in real time.
                </p>

                <button
                  onClick={() => { playClickSFX(); setPresentationStage(3); }}
                  className="px-8 py-4 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold tracking-widest text-xs font-mono transition-all duration-300 hover:scale-105"
                >
                  START OBSERVATION
                </button>
              </motion.div>
            )}

            {/* Stage 3: Planet Transit Orbit & Curve */}
            {presentationStage === 3 && (
              <motion.div
                key="transit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl space-y-8"
              >
                <div className="text-center space-y-2">
                  <span className="text-cyan-400 font-mono text-xs">OBSERVATION SEQUENCE 01 // LIGHT CURVES</span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white">Extracting the Light Curve</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="glass-panel p-6 rounded-xl border border-cyan-500/10 flex flex-col items-center">
                    <span className="text-[10px] font-mono text-cyan-400 mb-4">TELESCOPE STREAM</span>
                    <div className="w-full aspect-video bg-black/40 rounded-lg relative flex items-center justify-center overflow-hidden">
                      <div className="w-20 h-20 rounded-full bg-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.6)] animate-pulse" />
                      <div className="absolute w-full h-[1px] bg-dashed bg-white/10" />
                      <div 
                        className="absolute w-5 h-5 rounded-full bg-slate-900 border border-slate-700 shadow-xl"
                        style={{
                          left: `${orbitProgress}%`,
                          transform: 'translateX(-50%)',
                          zIndex: orbitProgress > 50 ? 20 : 0
                        }}
                      />
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] font-mono text-cyan-400 mb-4">LIGHT INTENSITY TELEMETRY</span>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentCurveData}>
                          <Line type="monotone" dataKey="clean" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => { playClickSFX(); setNoiseActive(true); setPresentationStage(4); }}
                    className="px-6 py-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center space-x-2 transition-all duration-300"
                  >
                    <span>NEXT: INJECT STELLAR NOISE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stage 4: Noise Challenge */}
            {presentationStage === 4 && (
              <motion.div
                key="noise"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl space-y-8"
              >
                <div className="text-center space-y-2">
                  <span className="text-red-400 font-mono text-xs">OBSERVATION SEQUENCE 02 // STATISTICAL NOISE</span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white">The Signal is Drowned Out</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <p className="text-gray-400 font-light">
                      Stellar flares and instruments drown the transit signature. To standard algorithms (BLS/TLS), this curve yields no detectable signals.
                    </p>
                    <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200 font-mono text-xs">
                      TRANSIT SIGNAL VALUE DETECTABILITY: 0.0%
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-red-500/10">
                    <span className="text-[10px] font-mono text-red-400 mb-4 block">CORRUPTED DATA STREAM</span>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentCurveData}>
                          <Line type="monotone" dataKey="raw" stroke="#f87171" strokeWidth={1} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <span className="text-xs font-mono text-cyan-400">"Can STELSION isolate the planet?"</span>
                  <button
                    onClick={runWOWDetectionSequence}
                    className="px-8 py-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold tracking-widest text-xs font-mono hover:scale-105 transition-all duration-300"
                  >
                    RUN STELSION AI DETECTIONS
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stage 5: AI Thinking Pipeline */}
            {presentationStage === 5 && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-3xl text-center space-y-12"
              >
                <div className="space-y-2">
                  <span className="text-cyan-400 font-mono text-xs animate-pulse">PROCESSING DATA FLOW THROUGH NEURAL CHANNELS...</span>
                  <h3 className="text-3xl font-extrabold text-white">AI Thinking Pipeline</h3>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {["Raw Signal", "Wavelet Filter", "CNN Scanning", "Self-Attention", "Classification"].map((lbl, i) => {
                    const isActive = activePipelineStep === i;
                    const isDone = activePipelineStep > i;
                    return (
                      <div 
                        key={lbl} 
                        className={`p-4 rounded border transition-all duration-300 font-mono ${
                          isActive ? 'border-cyan-500 bg-cyan-950/20 text-white' : isDone ? 'border-cyan-500/20 text-cyan-400' : 'border-white/5 text-gray-600'
                        }`}
                      >
                        <div className="text-[10px]">{isDone ? '✓ DONE' : isActive ? 'RUNNING' : 'STANDBY'}</div>
                        <div className="text-xs font-bold mt-1 uppercase">{lbl}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="glass-panel p-8 rounded-xl border border-cyan-500/10 flex flex-col items-center space-y-4">
                  <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <div className="font-mono text-xs">
                    Model Confidence level: <span className="text-cyan-400 font-bold">{confidencePercent}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 6: Discovery Reveal */}
            {presentationStage === 6 && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl text-center space-y-8 flex flex-col items-center"
              >
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">✓ DISCOVERY VERDICT CONFIRMED</span>
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">STELSION-1b Confirmed</h2>

                <div className="w-64 h-64 rounded-full border border-cyan-500/20 relative flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.15)]">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 shadow-[0_0_55px_rgba(234,179,8,0.7)]" />
                  <div className="absolute w-5 h-5 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-slow-rotate" style={{ transformOrigin: '128px 128px' }} />
                </div>

                <p className="text-gray-400 font-light max-w-xl">
                  Wavelet filtering isolated the transit from random noise and stellar variability. The CNN self-attention model verified the candidate with <span className="text-cyan-400 font-bold">97.8% confidence</span>.
                </p>

                <button
                  onClick={() => { playClickSFX(); setPresentationStage(7); }}
                  className="px-8 py-4 rounded bg-cyan-500 text-black font-extrabold font-mono text-xs tracking-wider transition-all duration-300 hover:scale-105"
                >
                  NEXT: MISSION IMPACT
                </button>
              </motion.div>
            )}

            {/* Stage 7: Emotional Ending */}
            {presentationStage === 7 && (
              <motion.div
                key="ending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="max-w-4xl text-center space-y-12 flex flex-col items-center"
              >
                <div className="text-xl sm:text-3xl text-gray-300 leading-relaxed font-light italic max-w-2xl">
                  "The next habitable world may already exist in today's telescope data."
                </div>

                <div className="space-y-2 pt-6">
                  <h2 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tighter text-neon-cyan">STELSION</h2>
                  <p className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] font-semibold">
                    Discovering Worlds Hidden in Starlight.
                  </p>
                </div>

                <button
                  onClick={() => { playClickSFX(); setPresentationStage(8); }}
                  className="px-8 py-4 rounded bg-cyan-500 text-black font-extrabold font-mono text-xs tracking-wider transition-all duration-300 hover:scale-105"
                >
                  ENTER STELSION RESEARCH HUB
                </button>
              </motion.div>
            )}

            {/* Stage 8: Portal to Research Hub */}
            {presentationStage === 8 && (
              <motion.div
                key="hub-portal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-xl text-center space-y-6 flex flex-col items-center"
              >
                <h3 className="text-2xl font-bold text-white">Unlock Telemetry &amp; Laboratories</h3>
                <p className="text-gray-400 font-light text-sm">
                  You have completed the main presentation stream. You can now unlock the entire scientific research suite containing planet simulators, noise models, absorption spectrum matching games, and astronomical data.
                </p>

                <button
                  onClick={() => { playClickSFX(); setExperienceMode('research'); setResearchTab('mission-control'); }}
                  className="px-8 py-4 rounded bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold tracking-widest text-xs font-mono transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  LAUNCH RESEARCH PLATFORM
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}

      {/* ================= EXPERIENCE 2: RESEARCH EXPERIENCE (MUSEUM & LABS) ================= */}
      {experienceMode === 'research' && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
          
          {/* Research Sidebar/Top Navigation Bar */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
            {[
              { id: 'mission-control', label: '1. Mission Control', icon: Monitor },
              { id: 'labs', label: '2. Preprocessing Labs', icon: Sliders },
              { id: 'agencies', label: '3. Space Agencies', icon: Rocket },
              { id: 'games', label: '4. Observatory Games', icon: Gamepad2 },
              { id: 'timeline', label: '5. History & Publications', icon: BookOpen },
              { id: 'stellar-physics', label: '6. Stellar Physics', icon: Star },
              { id: 'biosignatures', label: '7. Biosignatures', icon: Globe },
              { id: 'deep-learning', label: '8. Deep Learning Stack', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playClickSFX(); setResearchTab(tab.id); }}
                className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold border flex items-center space-x-2 transition-all duration-300 ${
                  researchTab === tab.id
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* --- SUB-TAB 1: MISSION CONTROL --- */}
          {researchTab === 'mission-control' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Stats & logs */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-cyan-500/10 space-y-4">
                  <span className="font-mono text-xs text-gray-400 block border-b border-white/5 pb-2">ACTIVE TELEMETRY HUD</span>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div className="bg-black/40 p-3 rounded border border-white/5">
                      <span className="text-[10px] text-gray-500">STARS OBSERVED</span>
                      <span className="text-sm font-bold text-white mt-1">{starsScreenedCount.toLocaleString()}</span>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-white/5">
                      <span className="text-[10px] text-gray-500">GPU WORKLOAD</span>
                      <span className="text-sm font-bold text-cyan-400 mt-1">{gpuLoadPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-cyan-500/10 space-y-3 font-mono text-xs">
                  <span className="text-gray-400 block border-b border-white/5 pb-2">DISCOVERY STATUS</span>
                  <div className="flex justify-between"><span>Confirmed Exoplanets:</span> <span className="text-emerald-400 font-bold">298</span></div>
                  <div className="flex justify-between"><span>Precision Rate:</span> <span className="text-white">98.4%</span></div>
                  <div className="flex justify-between"><span>Active Stream:</span> <span className="text-white">Kepler Sector 4</span></div>
                </div>

                {/* Exoplanet Selector Database */}
                <div className="glass-panel p-5 rounded-xl border border-cyan-500/10 space-y-3">
                  <span className="text-gray-400 font-mono text-xs block border-b border-white/5 pb-2">SELECT PROFILE TARGET</span>
                  <div className="space-y-2">
                    {EXOPLANET_DATABASE.map((exo) => (
                      <button
                        key={exo.id}
                        onClick={() => { playClickSFX(); setSelectedExoplanet(exo); }}
                        className={`w-full text-left p-2 rounded text-xs font-mono border transition-all duration-200 ${
                          selectedExoplanet.id === exo.id 
                            ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400' 
                            : 'border-white/5 hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        {exo.name} ({exo.starType})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-cyan-500/10 flex flex-col justify-between">
                <span className="font-mono text-xs text-cyan-400">TELEMETRY DATA STREAMS</span>
                <div className="h-44 my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentCurveData}>
                      <Line type="monotone" dataKey="clean" stroke="#22d3ee" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] font-mono text-gray-500 text-center">INGESTION FROM TELESCOPE DATASET</div>
              </div>

              {/* Report Panel */}
              <div className="lg:col-span-4 bg-slate-900/90 rounded-xl border border-cyan-500/20 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block mb-2">TARGET CLASSIFICATION REPORT</span>
                  <h4 className="text-lg font-bold text-white font-mono uppercase">{selectedExoplanet.name} Profile</h4>
                  
                  <div className="space-y-3 font-mono text-xs mt-4">
                    <div className="flex justify-between"><span className="text-gray-500">Exoplanet Probability:</span> <span className="text-white font-bold">{selectedExoplanet.confidence}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Transit Depth:</span> <span className="text-white">{selectedExoplanet.depth}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Distance:</span> <span className="text-white">{selectedExoplanet.distance}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Radius:</span> <span className="text-white">{selectedExoplanet.radius}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Mass:</span> <span className="text-white">{selectedExoplanet.mass}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Stellar Temp:</span> <span className="text-white">{selectedExoplanet.temp}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Composition:</span> <span className="text-cyan-400 text-right">{selectedExoplanet.composition}</span></div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading official scientific telemetry report for target candidate: ${selectedExoplanet.name}`)}
                  className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs tracking-wider flex items-center justify-center space-x-2 transition-all duration-200 mt-4"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD REPORT</span>
                </button>
              </div>

            </div>
          )}

          {/* --- SUB-TAB 2: PREPROCESSING LABS --- */}
          {researchTab === 'labs' && (
            <div className="space-y-12">
              
              {/* Lab 1: Transit parameters */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Laboratories // Preprocessing</span>
                  <h3 className="text-3xl font-extrabold text-white">Wavelet &amp; Parameter Lab</h3>
                  <p className="text-gray-400 font-light text-sm">
                    Tune parameter weights to filter out simulated flares. Use wavelet thresholds to recover ingress curves.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Wavelet Level</span>
                        <span className="text-cyan-400">Lvl {activeWaveletLevel}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={activeWaveletLevel}
                        onChange={(e) => setActiveWaveletLevel(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreprocessingMode('raw')}
                        className={`flex-1 py-2 rounded text-xs font-mono font-bold border ${
                          preprocessingMode === 'raw' ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-white/5 border-transparent text-gray-400'
                        }`}
                      >
                        RAW DATA
                      </button>
                      <button
                        onClick={() => setPreprocessingMode('denoised')}
                        className={`flex-1 py-2 rounded text-xs font-mono font-bold border ${
                          preprocessingMode === 'denoised' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-transparent text-gray-400'
                        }`}
                      >
                        DENOISED
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-8 glass-panel p-6 rounded-xl border border-cyan-500/10">
                  <span className="text-[10px] font-mono text-cyan-400">WAVELET COEFF GRAPH</span>
                  <div className="h-56 my-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentCurveData}>
                        <Line type="monotone" dataKey={preprocessingMode === 'raw' ? 'raw' : 'denoised'} stroke={preprocessingMode === 'raw' ? '#f87171' : '#06b6d4'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Lab 2: Starspot Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/5 pt-12">
                <div className="lg:col-span-4 space-y-6">
                  <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Laboratories // Starspots</span>
                  <h3 className="text-3xl font-extrabold text-white">Starspot Thermal Model</h3>
                  <p className="text-gray-400 font-light text-sm">
                    Stellar surfaces contain spots cooler than the photosphere. These spots introduce cyclic brightness dip noise profiles. Match temperatures to subtract noise.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Starspot Temp</span>
                        <span className="text-cyan-400">{game5TempSlider} K</span>
                      </div>
                      <input
                        type="range"
                        min="3000"
                        max="5800"
                        step="100"
                        value={game5TempSlider}
                        onChange={(e) => setGame5TempSlider(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                    <button
                      onClick={verifyGame5Temp}
                      className="w-full py-2 rounded bg-cyan-500 text-black font-mono font-bold text-xs"
                    >
                      CALIBRATE TEMPERATURE SUBTRACTION
                    </button>
                    {game5Result && (
                      <div className="p-3 bg-black/40 rounded border border-white/5 text-[11px] font-mono text-gray-300">
                        {game5Result}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 shadow-2xl flex items-center justify-center">
                    <div className="absolute w-6 h-4 rounded-full bg-black/80 blur-[2px] top-8 left-10" />
                    <div className="absolute w-8 h-6 rounded-full bg-black/80 blur-[2px] bottom-10 right-8" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 mt-4">STELLAR PHOTO-SPHERIC FLUX SIMULATION</span>
                </div>
              </div>

            </div>
          )}

          {/* --- SUB-TAB 3: SPACE AGENCIES --- */}
          {researchTab === 'agencies' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Missions // Data Pipelines</span>
                <h3 className="text-3xl font-extrabold text-white">How Space Agencies Track Exoplanets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INTERNATIONAL_AGENCIES.map((agency) => (
                  <div key={agency.id} className={`p-6 rounded-xl border ${agency.color} space-y-4`}>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-bold font-mono text-sm">{agency.logo} {agency.name}</span>
                      <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-mono text-gray-400 uppercase">{agency.short}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{agency.desc}</p>
                    <div className="space-y-2 text-xs font-mono">
                      <div><span className="text-gray-500">Missions:</span> <span className="text-white">{agency.primaryMissions.join(', ')}</span></div>
                      <div><span className="text-gray-500">Calibration Pipeline:</span> <span className="text-white block mt-1 text-[11px] text-gray-400">{agency.pipeline}</span></div>
                      <div><span className="text-gray-500">Primary Stack:</span> <span className="text-cyan-400 block mt-1">{agency.tech || agency.technicalApproach}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SUB-TAB 4: OBSERVATORY GAMES --- */}
          {researchTab === 'games' && (
            <div className="space-y-12">
              
              {/* Game Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Game 1: Transit Inclination Game */}
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/10 space-y-6">
                  <div>
                    <span className="text-cyan-400 font-mono text-xs uppercase block mb-1">Game 01</span>
                    <h4 className="text-lg font-bold text-white">Transit Inclination Alignment</h4>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Space telescopes can only detect planets whose orbits align near edge-on (90° inclination) from Earth's point of view. Adjust the inclination to find the target.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Inclination Angle</span>
                        <span className="text-cyan-400">{game1Angle}°</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="90"
                        value={game1Angle}
                        onChange={(e) => setGame1Angle(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <button
                      onClick={verifyGame1Inclination}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded transition-all duration-200"
                    >
                      CONFIRM ALIGNMENT CORRECTION
                    </button>

                    {game1Status && (
                      <div className="bg-black/40 p-3 rounded border border-white/5 font-mono text-[11px] text-gray-300">
                        {game1Status}
                      </div>
                    )}
                  </div>
                </div>

                {/* Game 2: Atmospheric Wavelength Matcher */}
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/10 space-y-6">
                  <div>
                    <span className="text-cyan-400 font-mono text-xs uppercase block mb-1">Game 02</span>
                    <h4 className="text-lg font-bold text-white">Atmosphere Spectral Matcher</h4>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Tune absorption lines to identify atmospheric compounds. Match Water ($H_2O$: target 45) and Methane ($CH_4$: target 15) signals to confirm potential life.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Water Wavelength ($H_2O$)</span>
                        <span className="text-cyan-400">{game2WavelengthH2O} nm</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={game2WavelengthH2O}
                        onChange={(e) => setGame2WavelengthH2O(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Methane Wavelength ($CH_4$)</span>
                        <span className="text-cyan-400">{game2WavelengthCH4} nm</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={game2WavelengthCH4}
                        onChange={(e) => setGame2WavelengthCH4(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className={`p-3 rounded text-center text-xs font-mono font-bold ${
                      game2Completed 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-950/40 text-red-400 border border-red-500/30'
                    }`}>
                      {game2Completed 
                        ? '✓ MATCHED! Biosignatures identified: Atmosphere contains H2O & CH4.' 
                        : 'WAVELENGTH MISMATCH: Adjust chemical filters to find absorption lines.'
                      }
                    </div>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-white/5 pt-12">
                
                {/* Game 3: Signal Bandwidth Filter Game */}
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/10 space-y-6">
                  <div>
                    <span className="text-cyan-400 font-mono text-xs uppercase block mb-1">Game 03</span>
                    <h4 className="text-lg font-bold text-white">Starlight Frequency Bandpass</h4>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Kepler photometric noise is dominated by high-frequency electronics. Set cutoffs to allow low-frequency transit signals through (Low cutoff under 15hz, High cutoff above 75hz).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Low Cutoff Frequency</span>
                        <span className="text-cyan-400">{game3LowCutoff} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={game3LowCutoff}
                        onChange={(e) => setGame3LowCutoff(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>High Cutoff Frequency</span>
                        <span className="text-cyan-400">{game3HighCutoff} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={game3HighCutoff}
                        onChange={(e) => setGame3HighCutoff(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <button
                      onClick={verifyGame3Filters}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded transition-all duration-200"
                    >
                      CONFIRM FREQUENCY FILTER
                    </button>

                    {game3Status && (
                      <div className="bg-black/40 p-3 rounded border border-white/5 font-mono text-[11px] text-gray-300">
                        {game3Status}
                      </div>
                    )}
                  </div>
                </div>

                {/* Game 4: Orbital Velocity Calculation Game */}
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/10 space-y-6">
                  <div>
                    <span className="text-cyan-400 font-mono text-xs uppercase block mb-1">Game 04</span>
                    <h4 className="text-lg font-bold text-white">Orbital Velocity Balance</h4>
                    <p className="text-xs text-gray-400 font-light mt-1">
                      Set the planet's velocity to match Keplerian dynamics based on distance (AU) and solar mass parameters to lock in a stable orbit.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Distance from Host Star (AU)</span>
                        <span className="text-cyan-400">{game4Distance} AU</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={game4Distance}
                        onChange={(e) => setGame4Distance(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Star Mass (Solar Masses)</span>
                        <span className="text-cyan-400">{game4Mass} M<sub>☉</sub></span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={game4Mass}
                        onChange={(e) => setGame4Mass(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span>Adjust Planet Velocity</span>
                        <span className="text-cyan-400">{game4Velocity} km/s</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={game4Velocity}
                        onChange={(e) => setGame4Velocity(Number(e.target.value))}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <button
                      onClick={verifyGame4Velocity}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded transition-all duration-200"
                    >
                      CALCULATE ORBIT STABILITY
                    </button>

                    {game4Result && (
                      <div className="bg-black/40 p-3 rounded border border-white/5 font-mono text-[11px] text-gray-300">
                        {game4Result}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* --- SUB-TAB 5: HISTORY & PUBLICATIONS --- */}
          {researchTab === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* History Timeline */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Research History</span>
                <h4 className="text-xl font-bold text-white">Historical Telemetry Milestones</h4>
                
                <div className="relative border-l border-cyan-500/20 pl-6 space-y-6 text-left">
                  {HISTORICAL_TIMELINE.map((event) => (
                    <div key={event.year} className="relative">
                      <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-cyan-500" />
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{event.year} // {event.category}</span>
                      <h5 className="text-xs font-bold text-white">{event.title}</h5>
                      <p className="text-[11px] text-gray-500 leading-normal">{event.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Publications */}
              <div className="lg:col-span-6 glass-panel p-6 rounded-xl border border-white/5 space-y-6 text-left">
                <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest block font-bold">Academic Publications</span>
                <h4 className="text-xl font-bold text-white">Key Research Citations</h4>
                
                <div className="space-y-4 font-mono text-xs">
                  {RESEARCH_PAPERS.map((cite, idx) => (
                    <div key={idx} className="bg-black/40 p-4 rounded border border-white/5 space-y-1">
                      <h5 className="font-bold text-white">{cite.title}</h5>
                      <span className="text-[10px] text-cyan-400 block">{cite.journal}</span>
                      <span className="text-[9px] text-gray-500 block">Authors: {cite.authors}</span>
                      <p className="text-[10px] text-gray-400 leading-normal mt-2">{cite.abstract}</p>
                      <span className="text-[9px] text-cyan-600 block mt-1">DOI: {cite.doi}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* --- SUB-TAB 6: STELLAR PHYSICS --- */}
          {researchTab === 'stellar-physics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Stellar Physics Parameters</span>
                <h4 className="text-xl font-bold text-white font-mono">Keplerian Dynamics &amp; Radii</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  A planet's transit duration depends on the stellar density (ρ_*) and orbital parameters:
                </p>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-3">
                  <div className="text-cyan-300 font-bold">Transit Probability Equation:</div>
                  <div className="text-white text-center py-2">P_transit = (R_* + R_p) ÷ a ≈ R_* ÷ a</div>
                  <p className="text-[10px] text-gray-500">
                    Where R_* is the stellar radius, R_p is the planetary radius, and a is the semi-major axis.
                  </p>
                </div>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-3">
                  <div className="text-cyan-300 font-bold">Stellar Density Equation:</div>
                  <div className="text-white text-center py-2">ρ_* ≈ 3π ÷ (G * P^2) * (a ÷ R_*)^3</div>
                  <p className="text-[10px] text-gray-500">
                    Determined directly from transit duration and period, without requiring spectrographic stellar models.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Spectral Temperature Index</span>
                <h4 className="text-xl font-bold text-white font-mono">Stefan-Boltzmann Radiation</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Star luminosity is directly related to temperature and stellar surface area, determining the habitable boundaries:
                </p>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-2">
                  <div className="flex justify-between"><span>Luminosity (L):</span> <span className="text-white font-bold">L = 4 * π * R_*^2 * σ * T^4</span></div>
                  <div className="flex justify-between"><span>Stefan Constant (σ):</span> <span className="text-white">5.67 * 10^-8 W per m^2 K^4</span></div>
                  <div className="flex justify-between"><span>Solar Radii Equivalent:</span> <span className="text-cyan-400">1.0 R_☉</span></div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUB-TAB 7: BIOSIGNATURES --- */}
          {researchTab === 'biosignatures' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Spectroscopic Chemistry</span>
                <h4 className="text-xl font-bold text-white font-mono">Transmission Spectroscopy</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  During transit, starlight filters through the atmosphere of the exoplanet. The atmospheric molecules absorb specific wavelengths, creating absorption lines.
                </p>
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-cyan-300 block font-bold">Water Vapor (H2O) Bands</span>
                    <p className="text-[10px] text-gray-500 mt-1">Absorbs strongly at 1.4, 1.9, and 2.7 micrometers in near-infrared. Vital indicator of ocean condensation.</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-cyan-300 block font-bold">Methane (CH4) Bands</span>
                    <p className="text-[10px] text-gray-500 mt-1">Absorbs at 2.3 and 3.3 micrometers. High methane concentration in super-Earth atmospheres suggests biogenic sources.</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded border border-white/5">
                    <span className="text-cyan-300 block font-bold">Carbon Dioxide (CO2) Bands</span>
                    <p className="text-[10px] text-gray-500 mt-1">Strong features at 4.3 micrometers. Key molecule indicating planetary outgassing and carbonate-silicate cycle balance.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Habitability Metrics</span>
                <h4 className="text-xl font-bold text-white font-mono">Earth Similarity Index (ESI)</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Evaluates exoplanet similarity to Earth based on radius, density, escape velocity, and surface temperature.
                </p>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-3">
                  <div className="flex justify-between"><span>STELSION-1b Habitability ESI:</span> <span className="text-emerald-400 font-bold">0.89</span></div>
                  <div className="flex justify-between"><span>TRAPPIST-1e ESI:</span> <span className="text-white font-bold">0.95</span></div>
                  <div className="flex justify-between"><span>Kepler-22b ESI:</span> <span className="text-white font-bold">0.68</span></div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUB-TAB 8: DEEP LEARNING ARCHITECTURE --- */}
          {researchTab === 'deep-learning' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Model Layer Structure</span>
                <h4 className="text-xl font-bold text-white font-mono">1D CNN + Multi-head Attention</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Detailed mathematical formulations utilized inside the STELSION neural network stack:
                </p>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-3">
                  <div className="text-cyan-300 font-bold">Multi-Head Self-Attention:</div>
                  <div className="text-white text-center py-2">Attention(Q, K, V) = softmax( (Q * K^T) ÷ sqrt(d_k) ) * V</div>
                  <p className="text-[10px] text-gray-500">
                    Where Queries (Q), Keys (K), and Values (V) are generated from the convolutional feature maps.
                  </p>
                </div>
                <div className="bg-black/60 p-4 rounded border border-white/5 font-mono text-xs space-y-3">
                  <div className="text-cyan-300 font-bold">Wavelet Decomposition:</div>
                  <div className="text-white text-center py-2">W_ψ[f](a,b) = [1 ÷ sqrt(|a|)] * ∫ f(t) * ψ*((t-b) ÷ a) dt</div>
                  <p className="text-[10px] text-gray-500">
                    Provides simultaneous time and frequency resolution, removing high frequency noise without flattening transit edges.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
                <span className="text-cyan-400 font-mono text-xs uppercase block font-bold">Model Architecture Specs</span>
                <h4 className="text-xl font-bold text-white font-mono">Neural Parameters</h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between"><span>Input Shape:</span> <span className="text-white">1 x 2000 sequence</span></div>
                  <div className="flex justify-between"><span>Convolutional layers:</span> <span className="text-white">5 Layers (kernel size 3, 5, 9)</span></div>
                  <div className="flex justify-between"><span>Attention Heads:</span> <span className="text-white">8 heads</span></div>
                  <div className="flex justify-between"><span>Residual Blocks:</span> <span className="text-white">4 Blocks with skip links</span></div>
                  <div className="flex justify-between"><span>Optimizer:</span> <span className="text-cyan-400">Adam (lr = 0.001)</span></div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {experienceMode === 'universe' && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
          <Universe />
        </div>
      )}

      {/* Astro Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-gray-600 font-mono relative z-20">
        <p>© 2026 STELSION // AI-POWERED EXOPLANET DETECTION SYSTEM</p>
      </footer>
    </div>
  );
}
