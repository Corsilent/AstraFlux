import React from 'react'
import { RotateCcw, Star, Leaf, Building2, Zap, Trees, Home, Train, Shield, Landmark, DollarSign, FileText, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TemplateCard from '../components/TemplateCard.jsx'

export default function PublicGallery() {
  const navigate = useNavigate()
  const templates = [
    {
      title: 'Mapping Palm Oil Plantations | Google Satellite Embeddings',
      tags: ['Nature', 'Farming'],
      type: 'v2.0.0',
      author: 'Dimitris Kirtsios',
      thumbnail: 'https://images.unsplash.com/photo-1596766730268-3c35d8e7c8c6?auto=format&fit=crop&q=80&w=600',
      description: 'Demonstrates how to use unsupervised learning and supervised learning methods to classify palm oil plantations...'
    },
    {
      title: 'Change Detection for Forest Fires | Google Satellite Embeddings',
      tags: ['Public', 'Nature'],
      type: 'v2.0.0',
      author: 'Dimitris Kirtsios',
      thumbnail: 'https://images.unsplash.com/photo-1602166548773-6701b22572b8?auto=format&fit=crop&q=80&w=600',
      description: "Demonstrates two change detection methods to visualize damage from forest fires in Greece's Evros region..."
    },
    {
      title: 'RWI Similarity Score | Google Satellite Embeddings',
      tags: ['Urban', 'Public'],
      type: 'v2.0.0',
      author: 'Dimitris Kirtsios',
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600',
      description: "Demonstrates how to use Google's Satellite Embeddings to map the distribution of wealth across areas of Haiti..."
    },
    {
      title: 'Methane Emissions | Sentinel-5p',
      tags: ['Energy', 'Nature'],
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
      description: 'Analyze methane emissions using Sentinel-5p data.'
    },
    {
      title: 'Open Street Map (OSM) Overpass + Python Examples',
      tags: ['Building', 'Transit', 'Urban'],
      thumbnail: 'https://images.unsplash.com/photo-1577086663218-615d023e1987?auto=format&fit=crop&q=80&w=600',
      description: 'Query OSM data using Overpass API and visualize with Python.'
    },
    {
      title: 'Sand Encroachment - Saudi Arabia',
      tags: ['Urban', 'Public'],
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600',
      description: 'Monitor sand encroachment in urban areas of Saudi Arabia.'
    }
  ]

  const categories = [
    { name: 'Reset', icon: RotateCcw },
    { name: 'Starred', icon: Star },
    { name: 'Farming', icon: Leaf },
    { name: 'Building', icon: Building2 },
    { name: 'Energy', icon: Zap },
    { name: 'Nature', icon: Trees },
    { name: 'Housing', icon: Home },
    { name: 'Transit', icon: Train },
    { name: 'Urban', icon: Building2 },
    { name: 'Defense', icon: Shield },
    { name: 'Public', icon: Landmark },
    { name: '$', icon: DollarSign }
  ]

  return (
    <div className="min-h-screen bg-dark text-text p-8">
      <div className="flex gap-4 mb-8 items-center">
        <button className="flex items-center gap-2 px-6 py-2 bg-card rounded-md text-text font-medium border border-border" onClick={()=>navigate('/')}>
          <Home size={16} />
          <span>Back</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-card rounded-md text-text font-medium border border-border">
          <FileText size={18} />
          Templates
          <span className="ml-2 text-xs bg-surface2 px-2 py-0.5 rounded-full text-muted">20</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-2 text-muted font-medium hover:text-text transition-colors">
          <MessageSquare size={18} />
          Prompts
          <span className="ml-2 text-xs bg-surface2 px-2 py-0.5 rounded-full text-muted">0</span>
        </button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.name}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm whitespace-nowrap border transition-colors ${
              cat.name === 'Reset'
                ? 'bg-transparent border-border text-muted hover:text-text'
                : 'bg-transparent border-transparent text-muted hover:bg-card hover:text-text'
            }`}
          >
            <cat.icon size={14} />
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <TemplateCard key={i} {...t} />
        ))}
      </div>
    </div>
  )
}
