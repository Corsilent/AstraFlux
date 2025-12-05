import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import * as turf from '@turf/turf'

export default function Map(){
  const ref = useRef(null)
  const [state, setState] = useState({ base: 'osm', coords: null, measuring: false, measureLen: 0 })
  useEffect(() => {
    const map = L.map(ref.current, { zoomControl: true })
    map.setView([20, 0], 2)
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })
    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })
    let currentBase = osm.addTo(map)
    const drawGroup = L.featureGroup().addTo(map)
    L.control.scale({ metric: true, imperial: false }).addTo(map)
    new L.Control.Draw({ draw: { polyline: false }, edit: { featureGroup: drawGroup } }).addTo(map)
    const measureLayer = L.polyline([], { color: '#00e1a3' }).addTo(map)
    function setBase(name){
      const next = name === 'imagery' ? esri : osm
      if (currentBase) map.removeLayer(currentBase)
      currentBase = next.addTo(map)
      setState(s => ({ ...s, base: name }))
    }
    map.on('mousemove', e => { setState(s => ({ ...s, coords: e.latlng })) })
    map.on(L.Draw.Event.CREATED, e => {
      const layer = e.layer
      drawGroup.addLayer(layer)
      const gj = layer.toGeoJSON()
      let areaKm2 = null
      if (gj.geometry && (gj.geometry.type === 'Polygon' || gj.geometry.type === 'MultiPolygon')) {
        try { areaKm2 = turf.area(gj) / 1_000_000 } catch {}
      }
      const payload = { id: `aoi-${Date.now()}`, name: 'AOI', geojson: gj, areaKm2 }
      const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : '')
      if (API) fetch(`${API}/api/aoi`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    })
    function toggleMeasure(){
      setState(s => ({ ...s, measuring: !s.measuring }))
      measureLayer.setLatLngs([])
      setState(s => ({ ...s, measureLen: 0 }))
    }
    map.on('click', e => {
      const m = state.measuring
      if (!m) return
      const pts = measureLayer.getLatLngs().concat([e.latlng])
      measureLayer.setLatLngs(pts)
      let len = 0
      for (let i = 1; i < pts.length; i++) len += pts[i-1].distanceTo(pts[i])
      setState(s => ({ ...s, measureLen: len }))
    })
    function geocode(q){
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`).then(r => r.json()).then(arr => {
        if (arr && arr[0]) {
          const { lat, lon, display_name } = arr[0]
          const ll = [parseFloat(lat), parseFloat(lon)]
          map.setView(ll, 12)
          L.circleMarker(ll, { radius: 6, color: '#4cc9ff' }).addTo(map).bindPopup(display_name).openPopup()
        }
      })
    }
    const ctrl = L.control({ position: 'topleft' })
    ctrl.onAdd = () => {
      const d = L.DomUtil.create('div', 'map-controls')
      d.innerHTML = `
        <div class="map-row">
          <select id="baseSel">
            <option value="osm">OSM</option>
            <option value="imagery">影像</option>
          </select>
          <button id="measureBtn">测距</button>
          <button id="measureClear">清除</button>
        </div>
        <div class="map-row">
          <input id="searchInput" placeholder="搜索地点，如 Shanghai" />
          <button id="searchBtn">搜索</button>
        </div>
        <div class="map-row small" id="coordText"></div>
        <div class="map-row small" id="lenText"></div>
      `
      const baseSel = d.querySelector('#baseSel')
      const measureBtn = d.querySelector('#measureBtn')
      const measureClear = d.querySelector('#measureClear')
      const searchBtn = d.querySelector('#searchBtn')
      const searchInput = d.querySelector('#searchInput')
      baseSel.addEventListener('change', () => setBase(baseSel.value))
      measureBtn.addEventListener('click', () => toggleMeasure())
      measureClear.addEventListener('click', () => { measureLayer.setLatLngs([]); setState(s => ({ ...s, measureLen: 0 })) })
      searchBtn.addEventListener('click', () => { const q = searchInput.value.trim(); if (q) geocode(q) })
      L.DomEvent.disableClickPropagation(d)
      return d
    }
    ctrl.addTo(map)
    const int = setInterval(() => {
      const ct = document.querySelector('.map-controls #coordText')
      const lt = document.querySelector('.map-controls #lenText')
      if (ct && state.coords) ct.textContent = `坐标: ${state.coords.lat.toFixed(5)}, ${state.coords.lng.toFixed(5)}`
      if (lt) lt.textContent = state.measuring ? `距离: ${(state.measureLen/1000).toFixed(3)} km` : ''
    }, 200)
    return () => { clearInterval(int); map.remove() }
  }, [state.measuring])
  return <div className="preview-map" ref={ref}></div>
}
