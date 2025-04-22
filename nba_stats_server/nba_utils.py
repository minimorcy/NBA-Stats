from nba_api.stats.endpoints import playergamelog, commonplayerinfo, teamgamelog
from nba_api.stats.static import players, teams
import pandas as pd

season_type = ["Regular Season", "Pre Season", "Playoffs", "All-Star"]
season_year = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21", "2019-20", "2018-19", "2017-18", "2016-17", "2015-16"]

def get_player_id(name):
    player = next((p for p in players.get_players() if name.lower() in p['full_name'].lower()), None)
    return player['id'] if player else None

def get_team_id(name):
    team = next((t for t in teams.get_teams() if name.lower() in t['full_name'].lower()), None)
    return team['id'] if team else None

def get_player_stats(name):
    player_id = get_player_id(name)
    if not player_id:
        return {"error": "Jugador no encontrado"}

    logs = playergamelog.PlayerGameLog(player_id=player_id, season="2024-25", season_type_all_star=season_type[0]).get_data_frames()[0]

    stats = {}
    stats['season_avg'] = logs.mean(numeric_only=True).to_dict()
    stats['last_5_games_avg'] = logs.head(5).mean(numeric_only=True).to_dict()
    stats['last_10_games_avg'] = logs.head(10).mean(numeric_only=True).to_dict()
    
    return stats

def get_team_stats(name):
    team_id = get_team_id(name)
    if not team_id:
        return {"error": "Equipo no encontrado"}

    logs = teamgamelog.TeamGameLog(team_id=team_id, season="2024-25", season_type_all_star=season_type[0]).get_data_frames()[0]
    logs['PTS'] = pd.to_numeric(logs['PTS'])

    return {
        "games_played": len(logs),
        "average_points": logs['PTS'].mean(),
        "last_5_avg": logs.head(5)['PTS'].mean(),
        "last_10_avg": logs.head(10)['PTS'].mean(),
    }
