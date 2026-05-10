import logging
from app.realtime.room_manager import room_manager

logger = logging.getLogger(__name__)

class MatchmakingService:
    def __init__(self):
        self.waiting_players = []  # List of {user_id, username, quiz_id}

    def find_match(self, user_id: str, username: str, quiz_id: str):
        logger.info(f"User {username} ({user_id}) searching for match in quiz {quiz_id}")
        # Look for a player waiting for the same quiz
        for player in self.waiting_players:
            if player["quiz_id"] == quiz_id and player["user_id"] != user_id:
                # Found a match!
                self.waiting_players.remove(player)
                
                # Create a room
                room_id = room_manager.create_room(quiz_id)
                room_manager.join_room(room_id, player["user_id"], player["username"])
                room_manager.join_room(room_id, user_id, username)
                room_manager.start_game(room_id)
                
                return room_id
        
        # No match found, add to waiting list
        if not any(p["user_id"] == user_id for p in self.waiting_players):
            self.waiting_players.append({
                "user_id": user_id,
                "username": username,
                "quiz_id": quiz_id
            })
            
        return None

matchmaking_service = MatchmakingService()
