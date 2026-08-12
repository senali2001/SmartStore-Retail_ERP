'use client'

   
import Header from './Header'
import Slidebar from './Slidebar'   


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex' }}>
      
      <Slidebar />

      <div style={{ marginLeft: '240px', width: '100%' }}>
        
        <Header />

        <main style={{ padding: '20px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}