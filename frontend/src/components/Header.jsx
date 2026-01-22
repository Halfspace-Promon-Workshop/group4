function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        {/* Promon Shield Logo */}
        <svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L4 10V23C4 35.5 11.5 44.5 22 48C32.5 44.5 40 35.5 40 23V10L22 2Z" 
                stroke="#1a1a2e" strokeWidth="2" fill="none"/>
          <path d="M14 25L20 31L32 19" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <svg height="28" viewBox="0 0 140 32" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="26" fill="#1a1a2e">PROMON</text>
        </svg>
      </div>
      <h1 className="header__title">
        <span className="header__title-accent">Promon</span> Lens
      </h1>
      <p className="header__subtitle">
        AI-powered mobile app security analysis in minutes
      </p>
    </header>
  )
}

export default Header
