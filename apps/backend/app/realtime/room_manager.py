import uuid

class RoomManager:
    def __init__(self):
        self.rooms = {}

    def create_room(self, quiz_id: str = None):
        room_id = str(uuid.uuid4())
        self.rooms[room_id] = {
            "quiz_id": quiz_id,
            "players": {},  # user_id: {"score": 0, "progress": 0, "username": str}
            "started": False,
            "finished": False,
            "winner_id": None
        }
        return room_id

    def join_room(self, room_id: str, user_id: str, username: str):
        if room_id in self.rooms:
            if user_id not in self.rooms[room_id]["players"]:
                self.rooms[room_id]["players"][user_id] = {
                    "score": 0,
                    "progress": 0,
                    "username": username
                }
            return True
        return False

    def update_score(self, room_id: str, user_id: str, points: int):
        if room_id in self.rooms and user_id in self.rooms[room_id]["players"]:
            self.rooms[room_id]["players"][user_id]["score"] += points
            self.rooms[room_id]["players"][user_id]["progress"] += 1
            return self.rooms[room_id]["players"][user_id]
        return None

    def start_game(self, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id]["started"] = True
            return True
        return False

    def get_room_state(self, room_id: str):
        return self.rooms.get(room_id)

room_manager = RoomManager()
