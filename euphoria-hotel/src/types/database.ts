export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_active_at: string | null
          role: Database["public"]["Enums"]["admin_role"] | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_active_at?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_active_at?: string | null
          role?: Database["public"]["Enums"]["admin_role"] | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          blocked_from: string
          blocked_to: string
          created_at: string | null
          created_by: string | null
          id: string
          reason: string | null
          room_id: string
        }
        Insert: {
          blocked_from: string
          blocked_to: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string | null
          room_id: string
        }
        Update: {
          blocked_from?: string
          blocked_to?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          arrival_time: string | null
          booking_reference: string
          booking_type: string
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in_date: string
          check_out_date: string
          created_at: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          internal_notes: string | null
          notes: string | null
          num_adults: number
          num_children: number | null
          paid_at: string | null
          paystack_reference: string | null
          price_per_night: number
          room_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          subtotal: number
          total_amount: number
          total_nights: number
          vat_amount: number
        }
        Insert: {
          arrival_time?: string | null
          booking_reference: string
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          num_adults?: number
          num_children?: number | null
          paid_at?: string | null
          paystack_reference?: string | null
          price_per_night: number
          room_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          subtotal: number
          total_amount: number
          total_nights: number
          vat_amount?: number
        }
        Update: {
          arrival_time?: string | null
          booking_reference?: string
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          num_adults?: number
          num_children?: number | null
          paid_at?: string | null
          paystack_reference?: string | null
          price_per_night?: number
          room_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          subtotal?: number
          total_amount?: number
          total_nights?: number
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          source: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          source?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          source?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          content: Json
          hero_description: string
          hero_eyebrow: string
          hero_image: string
          hero_title: string
          published_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          hero_description?: string
          hero_eyebrow?: string
          hero_image?: string
          hero_title?: string
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          hero_description?: string
          hero_eyebrow?: string
          hero_image?: string
          hero_title?: string
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_site_settings: {
        Row: {
          content: Json
          key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          badge: string | null
          bed_type: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          gallery_urls: string[] | null
          id: string
          is_active: boolean | null
          max_guests: number
          name: string
          price_per_night: number
          room_size_sqm: number | null
          short_description: string | null
          short_name: string | null
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          badge?: string | null
          bed_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gallery_urls?: string[] | null
          id?: string
          is_active?: boolean | null
          max_guests?: number
          name: string
          price_per_night: number
          room_size_sqm?: number | null
          short_description?: string | null
          short_name?: string | null
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          badge?: string | null
          bed_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          gallery_urls?: string[] | null
          id?: string
          is_active?: boolean | null
          max_guests?: number
          name?: string
          price_per_night?: number
          room_size_sqm?: number | null
          short_description?: string | null
          short_name?: string | null
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_rooms: {
        Args: { p_checkin: string; p_checkout: string; p_guests: number }
        Returns: {
          amenities: string[] | null
          badge: string | null
          bed_type: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          gallery_urls: string[] | null
          id: string
          is_active: boolean | null
          max_guests: number
          name: string
          price_per_night: number
          room_size_sqm: number | null
          short_description: string | null
          short_name: string | null
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "rooms"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      admin_role: "super_admin" | "manager" | "staff"
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "refunded"
        | "expired"
        | "checked_in"
        | "checked_out"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "manager", "staff"],
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "refunded",
        "expired",
        "checked_in",
        "checked_out",
      ],
    },
  },
} as const
