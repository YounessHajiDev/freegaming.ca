export type GameSource = 'GAMEMONETIZE' | 'GAMEDISTRIBUTION' | 'HTML5GAMES' | 'MANUAL'

export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string | null
  order_num: number
  created_at: string
}

export interface Game {
  id: number
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail: string
  iframe_url: string
  source_id: string
  source: GameSource
  category_id: number
  tags: string[]
  width: number
  height: number
  is_new: boolean
  is_hot: boolean
  is_featured: boolean
  is_active: boolean
  views: number
  created_at: string
  updated_at: string
  categories?: Category
}

export interface SyncLog {
  id: number
  source: GameSource
  total_fetched: number
  added: number
  updated: number
  errors: string | null
  created_at: string
}

export interface LiveStats {
  totalPlayers: number
  topGame: string
  newToday: number
  totalGames: number
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      games: {
        Row: Game
        Insert: Omit<Game, 'id' | 'created_at' | 'updated_at' | 'categories'>
        Update: Partial<Omit<Game, 'id' | 'created_at' | 'updated_at' | 'categories'>>
      }
      sync_logs: {
        Row: SyncLog
        Insert: Omit<SyncLog, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}
