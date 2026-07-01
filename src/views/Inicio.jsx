import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Inicio.css'
import { animate, createTimeline, stagger } from "animejs"

// IMAGENES
import logo from "../assets/inicio/logo-restaurante.jpg";
import heroImg from "../assets/inicio/hero.jpg";
import aboutImg from "../assets/inicio/about.webp";
import hero2Img from "../assets/inicio/hero2-img.webp";
import fotoImg1 from "../assets/inicio/img-fotos-1.jpg";
import fotoImg2 from "../assets/inicio/img-fotos-2.jpg";
import fotoImg3 from "../assets/inicio/img-fotos-3.jpg";

const MENU_HIGHLIGHTS = [
  {
    icon: "🥩",
    name: "Lomo al Carbón",
    desc: "Corte premium de res madurado 28 días, con reducción de vino tinto y papas gratinadas.",
    price: "Desde $18.50",
  },
  {
    icon: "🦐",
    name: "Ceviche de Camarón",
    desc: "Camarones frescos macerados en cítricos, con cebolla morada, cilantro y ají peruano.",
    price: "Desde $12.00",
  },
  {
    icon: "🍷",
    name: "Selección de Vinos",
    desc: "Maridaje cuidadosamente elegido por nuestro sommelier para complementar cada plato.",
    price: "Carta disponible",
  },
];

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────*/
export default function Inicio() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef(null);
  const heroTagRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtaRef = useRef(null);
  const heroScrollRef = useRef(null);
  const heroBgRef = useRef(null);
  const statsRef = useRef(null);
  const aboutRefs = useRef([]);
  const galleryCardsRef = useRef([]);
  const menuItemsRef = useRef([]);
  const expRef = useRef(null);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Scroll nav effect
  useEffect(() => {
    const nav = navRef.current;
    const handler = () => {
      if (window.scrollY > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Parallax hero bg
  useEffect(() => {
    const handler = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Hero entrance
  useEffect(() => {
    const tl = createTimeline({ ease: "outExpo" });

    tl.add(heroTagRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 900,
      delay: 300,
    })
      .add(heroTitleRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1100,
      }, 700)
      .add(heroSubRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 900,
      }, 1100)
      .add(heroCtaRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
      }, 1600)
      .add(heroScrollRef.current, {
        opacity: [0, 1],
        duration: 600,
      }, 2000);
  }, []);

  // ── Scroll-triggered animations via IntersectionObserver
  useEffect(() => {
    const observe = (elements, animFn) => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animFn(e.target);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      elements.forEach((el) => el && io.observe(el));
      return io;
    };

    // Stats bar
    const statsItems = statsRef.current
      ? statsRef.current.querySelectorAll(".stat-item")
      : [];
    const statsIO = observe(Array.from(statsItems), (el) => {
      animate(el, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        ease: "outExpo",
      });
    });

    // About
    const aboutIO = observe(aboutRefs.current.filter(Boolean), (el) => {
      animate(el, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        ease: "outExpo",
      });
    });

    // Gallery
    const galleryIO = observe(galleryCardsRef.current.filter(Boolean), (el) => {
      animate(el, {
        opacity: [0, 1],
        scale: [0.94, 1],
        duration: 900,
        ease: "outExpo",
      });
    });

    // Menu items
    const menuIO = observe(menuItemsRef.current.filter(Boolean), (el) => {
      animate(el, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
        ease: "outExpo",
      });
    });

    // Experience
    const expIO = observe(expRef.current ? [expRef.current] : [], (el) => {
      animate(
        el.querySelectorAll(".section-tag, .section-title, .section-divider, .section-text, .exp-btn"),
        {
          opacity: [0, 1],
          translateX: [-30, 0],
          delay: stagger(120),
          duration: 800,
          ease: "outExpo",
        }
      );
    });

    return () => {
      [statsIO, aboutIO, galleryIO, menuIO, expIO].forEach((io) => io.disconnect());
    };
  }, []);

  return (
    <>
      <nav className="inicio-nav" ref={navRef}>
        <img src={logo} alt="Logo Restaurante" className="nav-logo" />

        {/* Links escritorio */}
        <ul className="nav-links">
          <li><a href="#hero-inicio">Inicio</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#galeria">Galería</a></li>
          <li><a href="#menu-inicio">Menú</a></li>
        </ul>

        {/* Derecha escritorio */}
        <div className="nav-right">
          <span className="nav-phone">☏ 0898 766 574</span>
          <Link to="/reserva" className="btn-nav-reserva">Reservar</Link>
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menú"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      <div className={`nav-mobile-menu${mobileOpen ? ' visible' : ''}`}>
        <ul className="nav-mobile-links">
          {[
            ['#hero-inicio', 'Inicio'],
            ['#nosotros',    'Nosotros'],
            ['#galeria',     'Galería'],
            ['#menu-inicio', 'Menú'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={() => setMobileOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-mobile-footer">
          <span className="nav-phone" style={{ color: 'var(--text-muted)' }}>☏ 0898 766 574</span>
          <Link to="/reserva" className="btn-primary-gold" onClick={() => setMobileOpen(false)}>
            Reservar Mesa
          </Link>
        </div>
      </div>

      {/* ── HERO ─────────────────────────── */}
      <section id="hero-inicio" className="hero-section">
        <div className="hero-bg" ref={heroBgRef} style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-tag" ref={heroTagRef}>
            ✦ Experiencia Gastronómica
          </span>
          <h1 className="hero-title" ref={heroTitleRef}>
            El Arte de la<br /><em>Buena Mesa</em>
          </h1>
          <p className="hero-subtitle" ref={heroSubRef}>
            Sabores que despiertan los sentidos. Vive una experiencia culinaria
            única en el corazón de la ciudad, donde cada plato cuenta una historia.
          </p>
          <div className="hero-cta-group" ref={heroCtaRef}>
            <Link to="/reserva" className="btn-primary-gold">
              Reservar Mesa
            </Link>
            <a href="#nosotros" className="btn-outline-light-hero">
              Conoce más
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────── */}
      <div className="stats-bar" ref={statsRef}>
        {[
          { n: "12+", label: "Años de Experiencia" },
          { n: "48",  label: "Mesas Disponibles" },
          { n: "200+", label: "Platos en Carta" },
          { n: "4.9★", label: "Calificación Promedio" },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-number">{s.n}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── ABOUT ─────────────────────────── */}
      <section id="nosotros" className="about-section">
        <div className="about-content">
          <span
            className="section-tag"
            ref={(el) => (aboutRefs.current[0] = el)}
          >
            ✦ Sobre Nosotros
          </span>
          <h2
            className="section-title"
            ref={(el) => (aboutRefs.current[1] = el)}
          >
            Más de una década<br />sirviendo pasión
          </h2>
          <div
            className="section-divider"
            ref={(el) => (aboutRefs.current[2] = el)}
          />
          <p
            className="section-text"
            ref={(el) => (aboutRefs.current[3] = el)}
          >
            Somos un restaurante nacido de la pasión por la gastronomía
            ecuatoriana y mediterránea. Desde 2012, hemos fusionado ingredientes
            locales con técnicas internacionales para crear platos que van más
            allá de la comida: son momentos memorables.
          </p>
          <p
            className="section-text"
            ref={(el) => (aboutRefs.current[4] = el)}
          >
            Nuestro equipo de chefs trabaja con productores locales para
            garantizar la frescura y calidad de cada ingrediente. Cada visita
            es una nueva experiencia cuidadosamente diseñada para ti.
          </p>
          <div ref={(el) => (aboutRefs.current[5] = el)} style={{ opacity: 0 }}>
            <a href="#galeria" className="btn-primary-gold" style={{ display: "inline-block" }}>
              Ver Galería
            </a>
          </div>
        </div>
        <div className="about-img-container">
          <img src={aboutImg} alt="Interior del restaurante" />
          <div className="about-img-overlay" />
        </div>
      </section>

      {/* ── GALERÍA ─────────────────────────── */}
      <section id="galeria" className="gallery-section">
        <div className="gallery-header">
          <span className="section-tag" style={{ opacity: 1, display: "block", marginBottom: "12px" }}>
            ✦ Galería
          </span>
          <h2 className="section-title" style={{ opacity: 1, textAlign: "center" }}>
            Nuestra Atmósfera
          </h2>
        </div>
        <div className="gallery-grid">
          {[
            { img: fotoImg1, label: "Salón Principal" },
            { img: fotoImg2, label: "Platos Estrella" },
            { img: fotoImg3, label: "Terraza" },
          ].map((item, i) => (
            <div
              key={i}
              className="gallery-card"
              ref={(el) => (galleryCardsRef.current[i] = el)}
            >
              <img src={item.img} alt={item.label} />
              <div className="gallery-card-overlay">
                <span className="gallery-card-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="gallery-cta">
          <Link to="/reserva" className="btn-primary-gold">
            Buscar Mesa
          </Link>
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────── */}
      <section className="experience-section">
        <div className="experience-bg" style={{ backgroundImage: `url(${hero2Img})` }} />
        <div className="experience-content" ref={expRef}>
          <span className="section-tag">✦ Una Experiencia Única</span>
          <h2 className="section-title" style={{ marginTop: "12px" }}>
            Reserva tu momento<br />especial con nosotros
          </h2>
          <div className="section-divider" style={{ margin: "20px 0" }} />
          <p className="section-text">
            Ya sea una cena íntima, un aniversario o una reunión de negocios,
            te garantizamos la atención personalizada y el ambiente perfecto
            para que cada momento sea inolvidable.
          </p>
          <Link to="/reserva" className="btn-primary-gold exp-btn" style={{ marginTop: "8px" }}>
            Hacer una Reserva
          </Link>
        </div>
      </section>

      {/* ── MENÚ HIGHLIGHTS ─────────────────── */}
      <section id="menu-inicio" className="menu-section">
        <div className="menu-header">
          <span className="section-tag" style={{ opacity: 1, display: "block", marginBottom: "12px" }}>
            ✦ Nuestro Menú
          </span>
          <h2 className="section-title" style={{ opacity: 1, textAlign: "center" }}>
            Especialidades de la Casa
          </h2>
        </div>
        <div className="menu-grid">
          {MENU_HIGHLIGHTS.map((item, i) => (
            <div
              key={i}
              className="menu-item"
              ref={(el) => (menuItemsRef.current[i] = el)}
            >
              <span className="menu-icon">{item.icon}</span>
              <div className="menu-item-name">{item.name}</div>
              <p className="menu-item-desc">{item.desc}</p>
              <span className="menu-item-price">{item.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer className="inicio-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="Logo" />
            <p className="footer-brand-text">
              Un espacio donde la gastronomía se convierte en arte. Te esperamos
              para compartir momentos únicos alrededor de la buena mesa.
            </p>
          </div>
          <div>
            <p className="footer-col-title">Navegación</p>
            <ul className="footer-links">
              <li><a href="#hero-inicio">Inicio</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#galeria">Galería</a></li>
              <li><a href="#menu-inicio">Menú</a></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Horarios</p>
            <div className="footer-contact">
              <p>Lunes – Viernes<br />12:00 – 22:00</p>
              <p style={{ marginTop: "10px" }}>Sábados y Domingos<br />12:00 – 23:00</p>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Contacto</p>
            <div className="footer-contact">
              <p>📞 0898 766 574</p>
              <p style={{ marginTop: "6px" }}>📍 Av. Principal 123<br />Quito, Ecuador</p>
              <p style={{ marginTop: "6px" }}>✉ info@restaurante.ec</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">
            © 2024 Restaurante · Todos los derechos reservados
          </span>
          <div className="footer-social">
            {["IG", "FB", "TW"].map((s) => (
              <div className="social-dot" key={s} title={s}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}