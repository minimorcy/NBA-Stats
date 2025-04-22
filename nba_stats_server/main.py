from fastapi import FastAPI, Query
from nba_utils import get_player_stats, get_team_stats
from fastapi.middleware.cors import CORSMiddleware
from nba_api.stats.static import players

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

all_players = players.get_players()

@app.get("/")
def root():
    return {"message": "Bienvenido a la NBA API con FastAPI"}

@app.get("/player-stats")
def player_stats(name: str = Query(..., description="Nombre completo del jugador")):
    return get_player_stats(name)

@app.get("/team-stats")
def team_stats(name: str = Query(..., description="Nombre completo del equipo")):
    return get_team_stats(name)

@app.get("/search-players")
def search_players(q: str = Query(..., min_length=1)):
    results = [
        p for p in all_players if q.lower() in p["full_name"].lower()
    ]
    return results[:10]