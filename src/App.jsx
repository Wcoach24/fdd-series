import { useState, useEffect, useRef } from 'react'
import './App.css'

// Componente de efecto Glitch
const GlitchText = ({ children, className = '' }) => {
  return (
    <span className={`glitch ${className}`} data-text={children}>
      {children}
    </span>
  )
}

// Contador regresivo personalizado
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.days).padStart(3, '0')}</span>
        <span className="countdown-label">DÍAS</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">HORAS</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">MIN</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">SEG</span>
      </div>
    </div>
  )
}

// Simulador de FDD
const FDDSimulator = () => {
  const [stage, setStage] = useState(0)
  const [userFDD, setUserFDD] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const generateFDD = () => {
    setIsProcessing(true)
    setStage(1)

    setTimeout(() => {
      setStage(2)
      setTimeout(() => {
        const futureDate = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + Math.floor(Math.random() * 50) + 20)
        futureDate.setMonth(Math.floor(Math.random() * 12))
        futureDate.setDate(Math.floor(Math.random() * 28) + 1)
        setUserFDD(futureDate)
        setStage(3)
        setIsProcessing(false)
      }, 2000)
    }, 1500)
  }

  const resetSimulator = () => {
    setStage(0)
    setUserFDD(null)
  }

  return (
    <div className="fdd-simulator">
      <div className="simulator-screen">
        <div className="screen-header">
          <span className="system-id">SISTEMA NACIONAL DE DEFUNCIÓN</span>
          <span className="screen-status">{isProcessing ? '● PROCESANDO' : '○ EN ESPERA'}</span>
        </div>

        <div className="screen-content">
          {stage === 0 && (
            <div className="stage-initial">
              <p className="system-text">CIUDADANO: IDENTIFICACIÓN REQUERIDA</p>
              <p className="system-subtext">Pulse para recibir su asignación FDD</p>
              <button className="btn-system" onClick={generateFDD}>
                INICIAR PROTOCOLO
              </button>
            </div>
          )}

          {stage === 1 && (
            <div className="stage-processing">
              <div className="scanner-line"></div>
              <p className="processing-text">ESCANEANDO DATOS BIOMÉTRICOS...</p>
            </div>
          )}

          {stage === 2 && (
            <div className="stage-processing">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <p className="processing-text">CALCULANDO FECHA DE DEFUNCIÓN...</p>
            </div>
          )}

          {stage === 3 && userFDD && (
            <div className="stage-result">
              <p className="result-label">SU FDD ASIGNADA ES:</p>
              <div className="fdd-date">
                <GlitchText>
                  {userFDD.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </GlitchText>
              </div>
              <p className="result-warning">ESTE DATO ES IRREVERSIBLE. CUMPLA CON SU DEBER.</p>
              <button className="btn-reset" onClick={resetSimulator}>
                [REINICIAR SIMULACIÓN]
              </button>
            </div>
          )}
        </div>

        <div className="screen-footer">
          <span>REF: FDD-2026-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}

// Card de Personaje
const CharacterCard = ({ name, role, description, fdd }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div
      className={`character-card ${isRevealed ? 'revealed' : ''}`}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <div className="card-front">
        <div className="card-id-photo"></div>
        <div className="card-info">
          <span className="card-name">{name}</span>
          <span className="card-role">{role}</span>
          <span className="card-desc">{description}</span>
        </div>
        <div className="card-fdd">
          <span className="fdd-label">FDD</span>
          <span className="fdd-value">{isRevealed ? fdd : '██/██/████'}</span>
        </div>
      </div>
    </div>
  )
}

// Card de Episodio
const EpisodeCard = ({ number, title, synopsis }) => {
  return (
    <div className="episode-card">
      <div className="episode-number">
        <span className="ep-label">EP</span>
        <span className="ep-num">{String(number).padStart(2, '0')}</span>
      </div>
      <div className="episode-content">
        <h3 className="episode-title">{title}</h3>
        <p className="episode-synopsis">{synopsis}</p>
      </div>
      <div className="episode-status">
        <span className="status-dot"></span>
        CLASIFICADO
      </div>
    </div>
  )
}

// Componente Principal
function App() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const targetDate = new Date('2026-09-15').getTime()

  const characters = [
    { name: 'DANIEL VEGA', role: 'Protagonista', description: 'Ciudadano modelo. Creyente del sistema. Verdugo asignado.', fdd: '15/03/2089' },
    { name: 'CIUDADANO #7741', role: 'La Víctima', description: 'Un desconocido. Ordinario. Humano.', fdd: '08/04/2026' },
    { name: 'ELENA MORA', role: 'Funcionaria', description: 'El sistema tiene cara. Ella es una de ellas.', fdd: '22/11/2067' },
    { name: 'SECTOR 9', role: 'Psicópatas Anónimos', description: 'El mercado negro del deber. Matan por ti.', fdd: '[MÚLTIPLE]' },
  ]

  const episodes = [
    { number: 1, title: 'EL SISTEMA', synopsis: 'Un ciudadano cumple su deber. La máquina funciona. Daniel recibe su asignación.' },
    { number: 2, title: 'EL NOMBRE', synopsis: 'Un desconocido. Un archivo. Una prohibición que Daniel decide ignorar.' },
    { number: 3, title: 'CONTACTO', synopsis: 'Ver el rostro de quien debes matar. El protocolo se rompe.' },
    { number: 4, title: 'LA OFERTA', synopsis: 'Sector 9 aparece. Hay otra forma. Pero el precio es diferente.' },
    { number: 5, title: 'GRIETAS', synopsis: 'El sistema no es perfecto. Alguien lo manipula. O siempre fue así.' },
    { number: 6, title: 'CUENTA ATRÁS', synopsis: 'La FDD se acerca. Las salidas se cierran. Daniel elige actuar.' },
    { number: 7, title: 'EL COSTE', synopsis: 'Cada decisión tiene consecuencias. Algunas son irreversibles.' },
    { number: 8, title: 'DEFUNCIÓN', synopsis: 'El día llega. El sistema continúa. La pregunta: ¿quién muere realmente?' },
  ]

  return (
    <div className="app">
      <div className="scanlines"></div>
      <div className="noise"></div>

      <nav className={`nav ${scrollY > 100 ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <GlitchText>FDD</GlitchText>
          </div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#sistema" onClick={() => setMenuOpen(false)}>SISTEMA</a>
            <a href="#personajes" onClick={() => setMenuOpen(false)}>EXPEDIENTES</a>
            <a href="#episodios" onClick={() => setMenuOpen(false)}>EPISODIOS</a>
            <a href="#simular" onClick={() => setMenuOpen(false)}>SIMULAR</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">SERIE LIMITADA · 8 EPISODIOS · 2026</div>
          <h1 className="hero-title">
            <GlitchText className="title-main">FDD</GlitchText>
            <span className="title-sub">FECHA DE DEFUNCIÓN</span>
          </h1>
          <p className="hero-tagline">
            A los 7 años recibes tu fecha de muerte.<br/>
            Tu deber cívico: ser el verdugo de otro.
          </p>
          <div className="hero-countdown">
            <span className="countdown-label-hero">ESTRENO EN:</span>
            <Countdown targetDate={targetDate} />
          </div>
          <div className="hero-cta">
            <a href="#simular" className="btn-primary">
              <span>EXPERIMENTA EL SISTEMA</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      <section id="sistema" className="section section-sistema">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">ARCHIVO CLASIFICADO</span>
            <h2 className="section-title">EL SISTEMA</h2>
          </div>
          <div className="sistema-grid">
            <div className="sistema-card">
              <div className="sistema-icon">07</div>
              <h3>ASIGNACIÓN</h3>
              <p>A los 7 años de edad, cada ciudadano recibe su FDD: la fecha exacta de su muerte. No sabes cómo. Solo cuándo.</p>
            </div>
            <div className="sistema-card">
              <div className="sistema-icon">⚖</div>
              <h3>EL DEBER</h3>
              <p>Antes de morir, debes cumplir tu deber cívico: ejecutar a la persona que te asignen cuando llegue su FDD.</p>
            </div>
            <div className="sistema-card">
              <div className="sistema-icon">∞</div>
              <h3>EL CICLO</h3>
              <p>Nadie muere de forma natural. Toda muerte es administrada. El sistema se perpetúa. La máquina no se detiene.</p>
            </div>
          </div>
          <div className="sistema-quote">
            <blockquote>
              "¿Qué queda de tu humanidad cuando el sistema te obliga a participar directamente en la muerte de otro?"
            </blockquote>
          </div>
        </div>
      </section>

      <section id="personajes" className="section section-personajes">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">EXPEDIENTES ACTIVOS</span>
            <h2 className="section-title">PERSONAJES</h2>
            <p className="section-desc">Pulse en cada tarjeta para revelar la FDD</p>
          </div>
          <div className="characters-grid">
            {characters.map((char, index) => (
              <CharacterCard key={index} {...char} />
            ))}
          </div>
        </div>
      </section>

      <section id="episodios" className="section section-episodios">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">TEMPORADA 1</span>
            <h2 className="section-title">EPISODIOS</h2>
          </div>
          <div className="episodes-grid">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.number} {...ep} />
            ))}
          </div>
        </div>
      </section>

      <section id="simular" className="section section-simulator">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">EXPERIENCIA INTERACTIVA</span>
            <h2 className="section-title">RECIBE TU FDD</h2>
            <p className="section-desc">Experimenta lo que siente un ciudadano al recibir su asignación</p>
          </div>
          <FDDSimulator />
          <p className="simulator-disclaimer">
            * Esto es una simulación ficticia. No refleja ningún dato real.
          </p>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">†</div>
            <h2>EL SISTEMA TE ESPERA</h2>
            <p>Serie limitada · 8 episodios · Estreno 2026</p>
            <div className="cta-buttons">
              <button className="btn-notify">
                <span>NOTIFICARME DEL ESTRENO</span>
              </button>
            </div>
            <div className="creator-credit">
              <span>Creada por Álvaro</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <GlitchText>FDD</GlitchText>
              <span>FECHA DE DEFUNCIÓN</span>
            </div>
            <div className="footer-legal">
              <p>© 2026 FDD Series. Todos los derechos reservados.</p>
              <p className="footer-warning">
                ADVERTENCIA: Este contenido es ficción. El sistema FDD no existe.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App