import type { Station } from '@/types/station'

interface StationCardProps {
  station: Station
}

const languageLabels: { [key: string]: string } = {
  name_hi: 'हिंदी',
  name_gu: 'ગુજરાતી',
  name_ta: 'தமிழ்',
  name_te: 'తెలుగు',
  name_kn: 'ಕನ್ನಡ',
  name_ml: 'മലയാളം',
  name_mr: 'मराठी',
  name_pa: 'ਪੰਜਾਬੀ',
  name_bn: 'বাংলা',
  name_or: 'ଓଡ଼ିଆ',
  name_as: 'অসমীয়া',
}

export default function StationCard({ station }: StationCardProps) {
  // Get all available regional names
  const regionalNames = Object.keys(languageLabels)
    .filter(key => station[key as keyof Station])
    .map(key => ({
      label: languageLabels[key],
      value: station[key as keyof Station] as string
    }))

  return (
    <div className="station-card">
      <div className="station-header">
        <h3 className="station-name">{station.name}</h3>
        <span className="station-code">{station.code}</span>
      </div>

      <div className="station-details">
        {regionalNames.map((lang, index) => (
          <div key={index} className="detail-row">
            <span className="label">{lang.label}:</span>
            <span className="value">{lang.value}</span>
          </div>
        ))}

        <div className="detail-row">
          <span className="label">Location:</span>
          <span className="value">{station.district}, {station.state}</span>
        </div>

        {station.trainCount !== "0" && (
          <div className="detail-row">
            <span className="label">Trains:</span>
            <span className="value">{station.trainCount}</span>
          </div>
        )}

        {station.address && (
          <div className="detail-row address">
            <span className="label">Address:</span>
            <span className="value">{station.address}</span>
          </div>
        )}

        {station.latitude && station.longitude && (
          <div className="coordinates">
            <small>
              {Number(station.latitude).toFixed(4)}, {Number(station.longitude).toFixed(4)}
            </small>
          </div>
        )}
      </div>
    </div>
  )
}
