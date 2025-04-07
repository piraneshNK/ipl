export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          password: string
          created_at: string
          created_by: string
          status: string
          current_player_id: number | null
          auction_started: boolean
          is_timer_running: boolean
          current_bid: string | null
          current_bid_value: number | null
          current_bidder: string | null
        }
        Insert: {
          id?: string
          name: string
          password: string
          created_at?: string
          created_by: string
          status?: string
          current_player_id?: number | null
          auction_started?: boolean
          is_timer_running?: boolean
          current_bid?: string | null
          current_bid_value?: number | null
          current_bidder?: string | null
        }
        Update: {
          id?: string
          name?: string
          password?: string
          created_at?: string
          created_by?: string
          status?: string
          current_player_id?: number | null
          auction_started?: boolean
          is_timer_running?: boolean
          current_bid?: string | null
          current_bid_value?: number | null
          current_bidder?: string | null
        }
      }
      teams: {
        Row: {
          id: number
          room_id: string
          name: string
          short_name: string
          color: string
          purse: number
          spent: number
          created_at: string
        }
        Insert: {
          id: number
          room_id: string
          name: string
          short_name: string
          color: string
          purse: number
          spent: number
          created_at?: string
        }
        Update: {
          id?: number
          room_id?: string
          name?: string
          short_name?: string
          color?: string
          purse?: number
          spent?: number
          created_at?: string
        }
      }
      players: {
        Row: {
          id: number
          room_id: string
          name: string
          role: string
          base_price: string
          base_price_value: number
          status: string
          team_id: number | null
          sold_for: string | null
          sold_for_value: number | null
          created_at: string
        }
        Insert: {
          id: number
          room_id: string
          name: string
          role: string
          base_price: string
          base_price_value: number
          status: string
          team_id?: number | null
          sold_for?: string | null
          sold_for_value?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          room_id?: string
          name?: string
          role?: string
          base_price?: string
          base_price_value?: number
          status?: string
          team_id?: number | null
          sold_for?: string | null
          sold_for_value?: number | null
          created_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          room_id: string
          message: string
          team_id: number | null
          team_name: string | null
          amount: string | null
          bid_value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          message: string
          team_id?: number | null
          team_name?: string | null
          amount?: string | null
          bid_value?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          message?: string
          team_id?: number | null
          team_name?: string | null
          amount?: string | null
          bid_value?: number | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          room_id: string
          team_id: number | null
          is_auctioneer: boolean
          is_ready: boolean
          created_at: string
        }
        Insert: {
          id: string
          room_id: string
          team_id?: number | null
          is_auctioneer?: boolean
          is_ready?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          team_id?: number | null
          is_auctioneer?: boolean
          is_ready?: boolean
          created_at?: string
        }
      }
      timers: {
        Row: {
          id: string
          room_id: string
          timer_key: number
          timer_running: boolean
          timer_seconds: number
          last_updated: string
        }
        Insert: {
          id?: string
          room_id: string
          timer_key: number
          timer_running: boolean
          timer_seconds: number
          last_updated?: string
        }
        Update: {
          id?: string
          room_id?: string
          timer_key?: number
          timer_running?: boolean
          timer_seconds?: number
          last_updated?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

