/* eslint-disable camelcase */
import forge from 'mappersmith'
import BasicAuthMiddleware from 'mappersmith/middleware/basic-auth'
import EncodeJson from 'mappersmith/middleware/encode-json'
import env from '../env'

const BasicAuth = BasicAuthMiddleware({
  username: env.challongeUsername,
  password: env.challongeApiKey,
})

export const client = forge({
  clientId: 'challonge',
  host: 'https://api.challonge.com/v1',
  middleware: [BasicAuth, EncodeJson],
  resources: {
    Tournament: {
      create: { method: 'POST', path: '/tournaments.json' },
      bulkAdd: { method: 'POST', path: '/tournaments/{tournamentId}/participants/bulk_add.json' },
      start: { method: 'POST', path: '/tournaments/{tournamentId}/start.json' },
    },
  },
})

interface Tournament {
  accept_attachments: boolean
  accepting_predictions: boolean
  allow_participant_match_reporting: boolean
  anonymous_voting: boolean
  category: null // ???
  check_in_duration: null // ???
  completed_at: Date
  created_at: Date
  created_by_api: boolean
  credit_capped: boolean
  description_source: string
  description: string
  full_challonge_url: string
  game_id: number
  game_name: string
  group_stages_enabled: boolean
  group_stages_were_started: boolean
  hide_forum: boolean
  hide_seeds: boolean
  hold_third_place_match: boolean
  id: number
  live_image_url: string
  max_predictions_per_user: number
  name: string
  notify_users_when_matches_open: boolean
  notify_users_when_the_tournament_ends: boolean
  open_signup: boolean
  participants_count: number
  participants_locked: boolean
  participants_swappable: boolean
  prediction_method: number
  predictions_opened_at: Date
  private: boolean
  progress_meter: number
  pts_for_bye: string
  pts_for_game_tie: string
  pts_for_game_win: string
  pts_for_match_tie: string
  pts_for_match_win: string
  quick_advance: boolean
  ranked_by: 'match wins' | 'game wins' | 'points scored' | 'points difference' | 'custom'
  require_score_agreement: boolean
  review_before_finalizing: boolean
  rr_pts_for_game_tie: string
  rr_pts_for_game_win: string
  rr_pts_for_match_tie: string
  rr_pts_for_match_win: string
  sequential_pairings: boolean
  show_rounds: boolean
  sign_up_url: null
  signup_cap: number
  start_at: Date
  started_at: Date
  started_checking_in_at: Date
  state: 'pending'
  subdomain: string
  swiss_rounds: number
  team_convertable: boolean
  teams: boolean
  tie_breaks: string[] // ???
  tournament_type: 'single elimination' | 'double elimination' | 'round robin' | 'swiss'
  updated_at: Date
  url: string
}
// grand_finals_modifier?: null | 'single match' | 'skip'

function addSeed<P extends Record<string, unknown>>(p: P, idx: number) {
  return { ...p, seed: idx + 1 }
}

export default {
  async createTournament(
    params: Partial<
      Pick<
        Tournament,
        | 'name'
        | 'hold_third_place_match'
        | 'description'
        | 'open_signup'
        | 'tournament_type'
        | 'accept_attachments'
        | 'show_rounds'
      >
    >
  ): Promise<Tournament> {
    return client.Tournament.create({ body: params }).then(
      (res) => res.data<{ tournament: Tournament }>().tournament
    )
  },

  async addParticipantsToTournament(
    tournamentId: number,
    participants: Array<{ name: string; misc?: string }>
  ): Promise<void> {
    return client.Tournament.bulkAdd({
      tournamentId,
      body: { participants: participants.map(addSeed) },
    }).then(() => undefined)
  },

  async startTournament(tournamentId: number): Promise<Tournament> {
    return client.Tournament.start({ tournamentId }).then(
      (res) => res.data<{ tournament: Tournament }>().tournament
    )
  },
}
