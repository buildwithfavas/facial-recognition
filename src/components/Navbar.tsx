import { Navbar as BsNavbar, Container } from 'react-bootstrap';

interface NavbarProps {
  onUploadClick?: () => void;
  title?: string;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

export default function Navbar({ title = 'Facial Recognition' }: NavbarProps) {
  return (
    <BsNavbar className="py-3" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <Container fluid className="px-5 px-md-4">
        <BsNavbar.Brand className="d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '18px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Camera body */}
            <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Camera lens */}
            <circle cx="12" cy="13" r="3" stroke="#3b82f6" strokeWidth="2"/>
            {/* Focus frame corners */}
            <path d="M8 10L8 8L10 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10L16 8L14 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16L8 18L10 18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 16L16 18L14 18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="d-none d-sm-inline">{title}</span>
        </BsNavbar.Brand>
        
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button 
            className="btn btn-primary px-3 px-md-4"
            style={{ borderRadius: '6px', fontSize: '14px' }}
          >
            Log In
          </button>
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#d1d5db',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Container>
    </BsNavbar>
  );
}
