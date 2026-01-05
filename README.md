# Indian Railway Station Search

A modern React Next.js application for searching Indian Railway stations, similar to IRCTC. This demo project uses the official government CDN to fetch real-time station data.

## Live Demo

**Live App:** [https://indian-railway-station-search.vercel.app/](https://indian-railway-station-search.vercel.app/)

**GitHub Repository:** [https://github.com/ProgrammerNomad/indian-railway-station-search](https://github.com/ProgrammerNomad/indian-railway-station-search)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ProgrammerNomad/indian-railway-station-search)

## About

This project provides a user-friendly interface to search through thousands of Indian Railway stations with real-time autocomplete suggestions. Built with Next.js and TypeScript, it features a Select2/IRCTC-style dropdown interface with multi-language support for regional Indian languages.

## Features

- **Real-time Search**: Search stations by name, code, district, or state
- **Multi-language Support**: Displays station names in 11+ Indian languages
- **Smart Fallback**: Automatically switches to offline data if CDN is unavailable
- **Comprehensive Data**: Shows station details including location, train count, coordinates, and addresses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast Performance**: Optimized search with memoization and result limiting
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Data Source Indicator**: Shows whether using live CDN or offline data

## Data Source

This project uses the official Indian Railway station data from:
```
https://cdn.jsdelivr.net/gh/corover/assets@UIChange/askdisha-bucket/stationupdated.json
```

**Offline Fallback**: The app automatically falls back to a local offline copy (`/public/data/stationupdated.json`) if the CDN is unavailable. The data source indicator (Live or Offline) shows which source is active.

The data includes:
- Station name (English and multiple regional languages)
- Station code
- District and State
- Number of trains
- GPS coordinates (latitude/longitude)
- Complete address

### Supported Languages
Station names are available in multiple Indian languages based on regional availability:
- **Hindi** (हिंदी) - name_hi
- **Gujarati** (ગુજરાતી) - name_gu
- **Tamil** (தமிழ்) - name_ta
- **Telugu** (తెలుగు) - name_te
- **Kannada** (ಕನ್ನಡ) - name_kn
- **Malayalam** (മലയാളം) - name_ml
- **Marathi** (मराठी) - name_mr
- **Punjabi** (ਪੰਜਾਬੀ) - name_pa
- **Bengali** (বাংলা) - name_bn
- **Odia** (ଓଡ଼ିଆ) - name_or
- **Assamese** (অসমীয়া) - name_as

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Run the development server**:
```bash
npm run dev
# or
yarn dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
indian-railway-station-search/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── StationSearch.tsx   # Main search component with CDN/offline fallback
│   └── StationCard.tsx     # Station card with multi-language support
├── types/
│   └── station.ts          # TypeScript interfaces
├── public/
│   └── data/
│       └── stationupdated.json  # Offline data backup
├── data/
│   └── stationupdated.json # Source offline data
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── next.config.js          # Next.js config
└── README.md               # Dirst attempts to fetch station data from the government CDN
2. **Automatic Fallback**: If CDN fails, it automatically switches to the offline backup
3. **Search Functionality**: Users can search by typing station name (in any language), code, district, or state
4. **Multi-language Filtering**: Results are filtered across all available regional language names
5. **Display**: Matching stations are displayed in a responsive grid layout with all available languages
6
1. **Data Fetching**: The app fetches station data from the government CDN on initial load
2. **Search Functionality**: Users can search by typing station name, code, district, or state
3. **Filtering**: Results are filtered in real-time using React's `useMemo` hook
4. **Display**: Matching stations are displayed in a responsive grid layout
5. **Performance**: Results are limited to 100 matches to ensure smooth performance

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 18**: UI library with hooks
- **CSS3**: Modern styling with flexbox and grid
- **Government API**: Official Indian Railway data

## Features Breakdown

### Search Component
- Real-time filtering
- Clear button for quick reset
- Results counter
- Loading and error states

### Station Card
- Regional names in all available languagode
- Multi-language names
- Location information
- Train count
- GPS coordinates
- Complete address

## UI/UX

- **Color Scheme**: Purple gradient background with clean white cards
- **Typography**: System fonts for optimal readability
- **Animations**: Smooth hover effects and transitions
- **Accessibility**: Semantic HTML and ARIA labels

## License

This is a demo project for educational purposes.

## Credits

Station data provided by Indian Railways through the government CDN.

**Developer:** [ProgrammerNomad](https://github.com/ProgrammerNomad)

**Repository:** [github.com/ProgrammerNomad/indian-railway-station-search](https://github.com/ProgrammerNomad/indian-railway-station-search)

---

Made for Indian Railway travelers