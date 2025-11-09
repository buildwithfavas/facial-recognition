import { Navbar as BsNavbar, Container, Nav } from 'react-bootstrap';

type Props = {
  onUploadClick?: () => void;
  title?: string;
  onSettingsClick?: () => void;
};

export default function Navbar({ title = 'Facial Recognition' }: Props) {
  return (
    <BsNavbar expand="lg" className="py-3" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <Container fluid className="px-4">
        <BsNavbar.Brand className="d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {title}
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="navbar-nav" />
        
        <BsNavbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#home" className="px-3" style={{ color: 'var(--text-primary)' }}>Home</Nav.Link>
            <Nav.Link href="#about" className="px-3" style={{ color: 'var(--text-primary)' }}>About</Nav.Link>
            <Nav.Link href="#contact" className="px-3" style={{ color: 'var(--text-primary)' }}>Contact</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-primary px-4"
              style={{ borderRadius: '6px' }}
            >
              Log In
            </button>
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#d1d5db',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
