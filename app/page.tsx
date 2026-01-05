import StationSearch from '@/components/StationSearch'

export default function Home() {
  return (
    <main className="main-container">
      <div className="container">
        <header className="header">
          <h1 className="title">Indian Railway Station Search</h1>
          <p className="subtitle">Find railway stations across India</p>
        </header>
        <StationSearch />
      </div>
    </main>
  )
}
