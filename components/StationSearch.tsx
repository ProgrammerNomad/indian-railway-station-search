'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import type { Station } from '@/types/station'
import StationCard from './StationCard'

const STATION_DATA_URL = 'https://cdn.jsdelivr.net/gh/corover/assets@UIChange/askdisha-bucket/stationupdated.json'
const OFFLINE_DATA_URL = '/data/stationupdated.json'
const RECENT_STATIONS_KEY = 'recentStations'
const MAX_RECENT = 10

export default function StationSearch() {
  const [stations, setStations] = useState<Station[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'cdn' | 'offline'>('cdn')
  const [recentStations, setRecentStations] = useState<Station[]>([])
  const [selectedStations, setSelectedStations] = useState<Station[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchStations()
    loadRecentStations()
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadRecentStations = () => {
    try {
      const stored = localStorage.getItem(RECENT_STATIONS_KEY)
      if (stored) {
        setRecentStations(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load recent stations:', err)
    }
  }

  const addToRecent = (station: Station) => {
    try {
      const updated = [
        station,
        ...recentStations.filter(s => s.code !== station.code)
      ].slice(0, MAX_RECENT)
      
      setRecentStations(updated)
      localStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save recent station:', err)
    }
  }

  const handleSelectStation = (station: Station) => {
    addToRecent(station)
    setSelectedStations(prev => {
      const exists = prev.find(s => s.code === station.code)
      if (exists) return prev
      return [...prev, station]
    })
    setSearchQuery('')
    setShowDropdown(false)
    setActiveIndex(-1)
  }

  const handleRemoveStation = (code: string) => {
    setSelectedStations(prev => prev.filter(s => s.code !== code))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredStations.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev < filteredStations.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelectStation(filteredStations[activeIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIndex(-1)
    }
  }

  const fetchStations = async () => {
    try {
      setLoading(true)
      
      let response = await fetch(STATION_DATA_URL)
      
      if (!response.ok) {
        console.warn('CDN failed, trying offline data...')
        response = await fetch(OFFLINE_DATA_URL)
        setDataSource('offline')
        
        if (!response.ok) {
          throw new Error('Failed to fetch station data from both sources')
        }
      } else {
        setDataSource('cdn')
      }
      
      const data = await response.json()
      setStations(data)
      setError(null)
    } catch (err) {
      setError('Failed to load station data. Please check your connection.')
      console.error('Error fetching stations:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const query = searchQuery.toLowerCase()
    return stations.filter((station) => {
      const languageMatch = 
        (station.name_hi && station.name_hi.includes(query)) ||
        (station.name_gu && station.name_gu.includes(query)) ||
        (station.name_ta && station.name_ta.includes(query)) ||
        (station.name_te && station.name_te.includes(query)) ||
        (station.name_kn && station.name_kn.includes(query)) ||
        (station.name_ml && station.name_ml.includes(query)) ||
        (station.name_mr && station.name_mr.includes(query)) ||
        (station.name_pa && station.name_pa.includes(query)) ||
        (station.name_bn && station.name_bn.includes(query)) ||
        (station.name_or && station.name_or.includes(query)) ||
        (station.name_as && station.name_as.includes(query))
      
      return (
        station.name.toLowerCase().includes(query) ||
        station.code.toLowerCase().includes(query) ||
        languageMatch ||
        station.district.toLowerCase().includes(query) ||
        station.state.toLowerCase().includes(query)
      )
    }).slice(0, 50)
  }, [stations, searchQuery])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading stations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchStations} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="search-container">
      <div className="search-box" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by station name, code, district, or state..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowDropdown(true)
            setActiveIndex(-1)
          }}
          onFocus={() => searchQuery && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setShowDropdown(false)
              inputRef.current?.focus()
            }}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {showDropdown && filteredStations.length > 0 && (
          <div className="dropdown">
            {filteredStations.map((station, index) => (
              <div
                key={station.code}
                className={`dropdown-item ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelectStation(station)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="dropdown-item-main">
                  <span className="dropdown-station-name">{station.name}</span>
                  <span className="dropdown-station-code">{station.code}</span>
                </div>
                <div className="dropdown-item-sub">
                  {station.district}, {station.state}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDropdown && searchQuery && filteredStations.length === 0 && (
          <div className="dropdown">
            <div className="dropdown-item disabled">
              No stations found for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {selectedStations.length > 0 && (
        <div className="results-info">
          <p>
            Selected <strong>{selectedStations.length}</strong> station{selectedStations.length > 1 ? 's' : ''}
            {' '}
            <span className="data-source">
              ({dataSource === 'cdn' ? 'Live' : 'Offline'})
            </span>
          </p>
        </div>
      )}

      {selectedStations.length === 0 && !searchQuery && recentStations.length > 0 && (
        <>
          <div className="results-info">
            <p>Recently viewed stations</p>
          </div>
          <div className="stations-grid">
            {recentStations.map((station) => (
              <div key={station.code}>
                <StationCard station={station} />
              </div>
            ))}
          </div>
        </>
      )}

      {selectedStations.length === 0 && !searchQuery && recentStations.length === 0 && (
        <div className="no-results">
          <p>Start typing to search for stations</p>
          <p className="hint">Search by name, code, district, state, or regional language</p>
        </div>
      )}

      {selectedStations.length > 0 && (
        <div className="stations-grid">
          {selectedStations.map((station) => (
            <div key={station.code} className="station-wrapper">
              <button
                className="remove-station"
                onClick={() => handleRemoveStation(station.code)}
                aria-label="Remove station"
              >
                ✕
              </button>
              <StationCard station={station} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
