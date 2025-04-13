'use client';

export default function CreateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #f6e2dd 0%, #fde9e9 3%, #FFFFFF 8%)',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {children}
    </div>
  );
} 