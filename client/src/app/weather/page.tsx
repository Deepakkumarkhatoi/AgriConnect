'use client';

import React, { useState } from 'react';
import { FALLBACK_DATA } from '../../lib/api';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  MapPin,
  Calendar,
  ShieldAlert,
  Info,
  CheckCircle,
} from 'lucide-react';

export default function WeatherPage() {
  const [district, setDistrict] = useState('Puri');
  const [state, setState] = useState('Odisha');

  const weatherData = FALLBACK_DATA.weather;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>Agro-Meteorological Advisory Service</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Weather & Microclimate Alerts</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Rule-based agricultural weather forecasts tailored to field operations, crop spraying, and drainage.
            </p>
          </div>

          {/* District Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <label className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
              Active Farm District
            </label>
            <div className="flex gap-2">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="text-xs font-bold bg-white text-stone-900 rounded-xl px-3 py-2 border-none shadow-xs"
              >
                <option value="Puri">Puri (Odisha)</option>
                <option value="Khordha">Khordha (Bhubaneswar)</option>
                <option value="Cuttack">Cuttack (Odisha)</option>
                <option value="Sambalpur">Sambalpur (Odisha)</option>
                <option value="Bargarh">Bargarh (Odisha)</option>
                <option value="Karnal">Karnal (Haryana)</option>
                <option value="Nashik">Nashik (Maharashtra)</option>
              </select>
            </div>
            <p className="text-[10px] text-emerald-300">Observation synced at {weatherData.current.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">
          Current Conditions in {district}, {state}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Temperature</p>
              <p className="text-2xl font-black text-stone-900">{weatherData.current.temp}°C</p>
              <span className="text-[11px] text-stone-400">Feels like {weatherData.current.feelsLike}°C</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Relative Humidity</p>
              <p className="text-2xl font-black text-stone-900">{weatherData.current.humidity}%</p>
              <span className="text-[11px] text-stone-400">Canopy saturation high</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Wind Speed</p>
              <p className="text-2xl font-black text-stone-900">{weatherData.current.windSpeedKmph} km/h</p>
              <span className="text-[11px] text-stone-400">Favorable for spraying</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Rain Probability</p>
              <p className="text-2xl font-black text-stone-900">{weatherData.current.rainfallProbability}%</p>
              <span className="text-[11px] text-stone-400">{weatherData.current.condition}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule-based Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Active Agronomic Rule Warnings ({weatherData.alerts.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weatherData.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border shadow-xs space-y-3 ${
                alert.type === 'danger'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : alert.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-blue-50/70 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="font-bold text-base">{alert.title}</h3>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/80">
                  {alert.type}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-stone-700">{alert.description}</p>

              <div className="bg-white/80 p-3 rounded-xl border border-stone-200/50 text-xs">
                <p className="font-bold text-emerald-900 mb-0.5">Recommended Field Action:</p>
                <p className="text-stone-700">{alert.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <span>7-Day Agricultural Field Forecast</span>
          </h2>
          <span className="text-xs text-stone-500">Updated every 6 hours</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weatherData.forecast.map((day, idx) => (
            <div
              key={day.date}
              className={`p-4 rounded-2xl border text-center space-y-2 transition hover:shadow-md ${
                idx === 0 ? 'bg-emerald-50/80 border-emerald-300' : 'bg-stone-50/60 border-stone-200'
              }`}
            >
              <p className="text-xs font-bold text-stone-900">{day.day}</p>
              <p className="text-[10px] text-stone-400">{day.date.slice(5)}</p>

              <div className="py-2">
                <p className="text-lg font-black text-stone-900">{day.tempMax}°</p>
                <p className="text-xs text-stone-400">{day.tempMin}°</p>
              </div>

              <div className="text-[11px] font-semibold text-emerald-800 line-clamp-1">
                {day.condition}
              </div>

              <div className="pt-2 border-t border-stone-200/60 space-y-1 text-[10px] text-stone-500">
                <div className="flex items-center justify-between">
                  <span>Rain:</span>
                  <span className="font-bold text-blue-600">{day.rainfallProbability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Humidity:</span>
                  <span>{day.humidity}%</span>
                </div>
                {day.rainfallMm > 0 && (
                  <div className="flex items-center justify-between text-blue-700 font-semibold">
                    <span>Est. Precip:</span>
                    <span>{day.rainfallMm}mm</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
