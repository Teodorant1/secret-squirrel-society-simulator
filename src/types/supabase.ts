/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      "secret-squirrel-society-simulator_actual_users": {
        Row: {
          email: string;
          id: string;
          image: string | null;
          password: string;
          username: string;
        };
        Insert: {
          email: string;
          id: string;
          image?: string | null;
          password: string;
          username: string;
        };
        Update: {
          email?: string;
          id?: string;
          image?: string | null;
          password?: string;
          username?: string;
        };
        Relationships: [];
      };
      "secret-squirrel-society-simulator_created_match_statistic": {
        Row: {
          creator: string;
          Date: string;
          players: string[];
        };
        Insert: {
          creator: string;
          Date?: string;
          players?: string[];
        };
        Update: {
          creator?: string;
          Date?: string;
          players?: string[];
        };
        Relationships: [];
      };
      "secret-squirrel-society-simulator_cronjob_Runs": {
        Row: {
          runDate: string;
        };
        Insert: {
          runDate?: string;
        };
        Update: {
          runDate?: string;
        };
        Relationships: [];
      };
      "secret-squirrel-society-simulator_election": {
        Row: {
          chancellor_candidate: string;
          created_at: string;
          id: string;
          is_over: boolean;
          is_special_election: boolean;
          match: string;
          passed: boolean | null;
          president_candidate: string;
          voting_list: string[];
        };
        Insert: {
          chancellor_candidate?: string;
          created_at?: string;
          id: string;
          is_over?: boolean;
          is_special_election?: boolean;
          match: string;
          passed?: boolean | null;
          president_candidate?: string;
          voting_list?: string[];
        };
        Update: {
          chancellor_candidate?: string;
          created_at?: string;
          id?: string;
          is_over?: boolean;
          is_special_election?: boolean;
          match?: string;
          passed?: boolean | null;
          president_candidate?: string;
          voting_list?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "secret-squirrel-society-simulator_election_match_secret-squirre";
            columns: ["match"];
            isOneToOne: false;
            referencedRelation: "secret-squirrel-society-simulator_match";
            referencedColumns: ["id"];
          },
        ];
      };
      "secret-squirrel-society-simulator_match": {
        Row: {
          alive_players: string[];
          chancellor: string;
          chancellor_has_activated_veto: boolean;
          chancellor_laws_pile: string[];
          chancellor_role_image_url: string;
          chancellor_role_name: string;
          creator_owner: string;
          deck: string[];
          discard_pile: string[];
          executive_power: string | null;
          executive_power_active: boolean;
          failed_elections: number;
          fascist_faction_image_url: string;
          fascist_faction_name: string;
          fascist_laws: number;
          fascist_laws_array: string[];
          has_started: boolean | null;
          hitler: string;
          hitler_has_intel: boolean;
          hitler_role_image_url: string | null;
          hitler_role_name: string;
          id: string;
          isOver: boolean;
          last_Chancellor: string;
          last_President: string;
          last_regular_president: string;
          liberal_faction_image_url: string;
          liberal_faction_name: string;
          liberal_laws: number;
          liberal_laws_array: string[];
          name: string;
          open_source_intel: string[];
          original_players_array: string[];
          password: string | null;
          president: string;
          president_accepted_veto: boolean;
          president_laws_pile: string[];
          president_role_image_url: string;
          president_role_name: string;
          result: string | null;
          scheduled_for_deletion: boolean | null;
          stage: string;
          substage: string;
          veto_power_unlocked: boolean;
          veto_session_over: boolean;
          waiting_on: string;
        };
        Insert: {
          alive_players?: string[];
          chancellor?: string;
          chancellor_has_activated_veto?: boolean;
          chancellor_laws_pile?: string[];
          chancellor_role_image_url?: string;
          chancellor_role_name?: string;
          creator_owner?: string;
          deck?: string[];
          discard_pile?: string[];
          executive_power?: string | null;
          executive_power_active?: boolean;
          failed_elections?: number;
          fascist_faction_image_url?: string;
          fascist_faction_name?: string;
          fascist_laws?: number;
          fascist_laws_array?: string[];
          has_started?: boolean | null;
          hitler?: string;
          hitler_has_intel?: boolean;
          hitler_role_image_url?: string | null;
          hitler_role_name: string;
          id: string;
          isOver?: boolean;
          last_Chancellor?: string;
          last_President?: string;
          last_regular_president?: string;
          liberal_faction_image_url?: string;
          liberal_faction_name?: string;
          liberal_laws?: number;
          liberal_laws_array?: string[];
          name?: string;
          open_source_intel?: string[];
          original_players_array?: string[];
          password?: string | null;
          president?: string;
          president_accepted_veto?: boolean;
          president_laws_pile?: string[];
          president_role_image_url?: string;
          president_role_name?: string;
          result?: string | null;
          scheduled_for_deletion?: boolean | null;
          stage?: string;
          substage?: string;
          veto_power_unlocked?: boolean;
          veto_session_over?: boolean;
          waiting_on?: string;
        };
        Update: {
          alive_players?: string[];
          chancellor?: string;
          chancellor_has_activated_veto?: boolean;
          chancellor_laws_pile?: string[];
          chancellor_role_image_url?: string;
          chancellor_role_name?: string;
          creator_owner?: string;
          deck?: string[];
          discard_pile?: string[];
          executive_power?: string | null;
          executive_power_active?: boolean;
          failed_elections?: number;
          fascist_faction_image_url?: string;
          fascist_faction_name?: string;
          fascist_laws?: number;
          fascist_laws_array?: string[];
          has_started?: boolean | null;
          hitler?: string;
          hitler_has_intel?: boolean;
          hitler_role_image_url?: string | null;
          hitler_role_name?: string;
          id?: string;
          isOver?: boolean;
          last_Chancellor?: string;
          last_President?: string;
          last_regular_president?: string;
          liberal_faction_image_url?: string;
          liberal_faction_name?: string;
          liberal_laws?: number;
          liberal_laws_array?: string[];
          name?: string;
          open_source_intel?: string[];
          original_players_array?: string[];
          password?: string | null;
          president?: string;
          president_accepted_veto?: boolean;
          president_laws_pile?: string[];
          president_role_image_url?: string;
          president_role_name?: string;
          result?: string | null;
          scheduled_for_deletion?: boolean | null;
          stage?: string;
          substage?: string;
          veto_power_unlocked?: boolean;
          veto_session_over?: boolean;
          waiting_on?: string;
        };
        Relationships: [];
      };
      "secret-squirrel-society-simulator_player": {
        Row: {
          hashed_password: string;
          id: string;
          intel: string[];
          is_fascist: boolean;
          is_hitler: boolean;
          joined_at: string;
          match: string;
          party: string | null;
          role: string | null;
          score: number;
          username: string;
        };
        Insert: {
          hashed_password: string;
          id: string;
          intel?: string[];
          is_fascist?: boolean;
          is_hitler?: boolean;
          joined_at?: string;
          match: string;
          party?: string | null;
          role?: string | null;
          score?: number;
          username: string;
        };
        Update: {
          hashed_password?: string;
          id?: string;
          intel?: string[];
          is_fascist?: boolean;
          is_hitler?: boolean;
          joined_at?: string;
          match?: string;
          party?: string | null;
          role?: string | null;
          score?: number;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "secret-squirrel-society-simulator_player_match_secret-squirrel-";
            columns: ["match"];
            isOneToOne: false;
            referencedRelation: "secret-squirrel-society-simulator_match";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret-squirrel-society-simulator_player_username_secret-squirr";
            columns: ["username"];
            isOneToOne: false;
            referencedRelation: "secret-squirrel-society-simulator_actual_users";
            referencedColumns: ["username"];
          },
        ];
      };
      "secret-squirrel-society-simulator_vote": {
        Row: {
          election: string;
          id: string;
          playerID: string;
          username: string;
          voting_yes: boolean;
        };
        Insert: {
          election: string;
          id: string;
          playerID: string;
          username: string;
          voting_yes: boolean;
        };
        Update: {
          election?: string;
          id?: string;
          playerID?: string;
          username?: string;
          voting_yes?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "secret-squirrel-society-simulator_vote_election_secret-squirrel";
            columns: ["election"];
            isOneToOne: false;
            referencedRelation: "secret-squirrel-society-simulator_election";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "secret-squirrel-society-simulator_vote_playerID_secret-squirrel";
            columns: ["playerID"];
            isOneToOne: false;
            referencedRelation: "secret-squirrel-society-simulator_player";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      stage:
        | "lobby"
        | "election"
        | "legislation"
        | "executive_action"
        | "game_over";
      substage:
        | "lobby"
        | "nominating"
        | "voting"
        | "voting_result"
        | "president_discard"
        | "chancellor_discard"
        | "power_action"
        | "game_over";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      stage: [
        "lobby",
        "election",
        "legislation",
        "executive_action",
        "game_over",
      ],
      substage: [
        "lobby",
        "nominating",
        "voting",
        "voting_result",
        "president_discard",
        "chancellor_discard",
        "power_action",
        "game_over",
      ],
    },
  },
} as const;
