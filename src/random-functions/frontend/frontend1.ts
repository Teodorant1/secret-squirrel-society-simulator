import { type game_info_state } from "../backend/backend1";

export function notInArray<T>(array: T[], value: T): boolean {
  return !array.includes(value);
}

export function CanBeNominated_for_chancellor(found_match: game_info_state) {
  const not_eligible_people = get_uneligible_people_for_chancellor(found_match);
  const alive_players = found_match.player_order;

  const eligible = alive_players.filter(
    (player) => !not_eligible_people.includes(player),
  );

  return eligible;
}

function get_uneligible_people_for_chancellor(found_match: game_info_state) {
  if (found_match.player_order.length > 5) {
    const not_eligible_people = [
      found_match.last_Chancellor,
      found_match.last_President,
      found_match.president,
    ];

    return not_eligible_people;
  }

  return [found_match.last_Chancellor, found_match.president];
}
