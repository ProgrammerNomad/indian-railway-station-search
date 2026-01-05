'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Fuse from 'fuse.js'
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
  const fuseRef = useRef<Fuse<Station> | null>(null)

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
      
      // Initialize Fuse.js with fuzzy search configuration
      fuseRef.current = new Fuse(data, {
        keys: [
          { name: 'name', weight: 2 },        // Station name - highest weight
          { name: 'code', weight: 2 },        // Station code - highest weight
          { name: 'name_hi', weight: 1.5 },   // Hindi name
          { name: 'name_gu', weight: 1.5 },   // Gujarati name
          { name: 'name_ta', weight: 1.5 },   // Tamil name
          { name: 'name_te', weight: 1.5 },   // Telugu name
          { name: 'name_kn', weight: 1.5 },   // Kannada name
          { name: 'name_ml', weight: 1.5 },   // Malayalam name
          { name: 'name_mr', weight: 1.5 },   // Marathi name
          { name: 'name_pa', weight: 1.5 },   // Punjabi name
          { name: 'name_bn', weight: 1.5 },   // Bengali name
          { name: 'name_or', weight: 1.5 },   // Odia name
          { name: 'name_as', weight: 1.5 },   // Assamese name
          { name: 'district', weight: 1 },    // District
          { name: 'state', weight: 1 },       // State
        ],
        threshold: 0.4,           // 0.0 = perfect match, 1.0 = match anything
        distance: 100,            // How far to search for patterns
        minMatchCharLength: 2,    // Minimum characters to start matching
        includeScore: true,       // Include match score
        ignoreLocation: true,     // Search entire string, not just beginning
        useExtendedSearch: true,  // Enable extended search patterns
      })
      
      setError(null)
    } catch (err) {
      setError('Failed to load station data. Please check your connection.')
      console.error('Error fetching stations:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim() || !fuseRef.current) {
      return []
    }

    const query = searchQuery.trim()
    
    // Use Fuse.js for fuzzy search with typo tolerance
    const results = fuseRef.current.search(query)
    
    // Extract the station objects from Fuse.js results
    return results.slice(0, 50).map(result => result.item)
  }, [searchQuery])

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
          placeholder="Search by station name, code, district, or state (typo-tolerant)..."
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
          <p className="hint">Fuzzy search enabled - typos like "GZB" for "GBZ" will work!</p>
          <p className="hint-sub">Search by name, code, district, state, or regional language</p>
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
