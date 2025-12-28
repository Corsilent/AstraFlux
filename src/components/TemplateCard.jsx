import React from 'react'
import { Heart } from 'lucide-react'

export default function TemplateCard({ title, tags, thumbnail, author, type, description }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition-all flex flex-col h-full p-4">
      <div className="h-40 bg-surface2 relative group rounded-md overflow-hidden mb-4">
        <img
          src={thumbnail || 'https://placehold.co/600x400/2a3040/FFF?text=Map+Preview'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-accent hover:bg-opacity-90 text-text px-4 py-2 rounded-md font-medium">
            Preview
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-text line-clamp-2">{title}</h3>
          {type && <span className="text-xs bg-dark text-muted px-2 py-1 rounded">{type}</span>}
        </div>
        {description && (
          <p className="text-muted text-sm mb-4 line-clamp-3 flex-1">{description}</p>
        )}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags && tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 rounded bg-dark text-text">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <button className="text-muted hover:text-red-500 transition-colors">
              <Heart size={18} />
            </button>
            <button className="bg-accent hover:bg-opacity-90 text-text px-4 py-2 rounded text-sm font-medium transition-colors">
              Remix
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
