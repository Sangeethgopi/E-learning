from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import logging

from app.realtime.connection_manager import manager
from app.realtime.room_manager import room_manager
from app.services.xp_service import XPService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/battle/{room_id}/{user_id}")
async def battle_websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await manager.connect(room_id, websocket)
    
    # Send initial room state
    room_state = room_manager.get_room_state(room_id)
    if room_state:
        await websocket.send_json({
            "event": "ROOM_STATE",
            "payload": room_state
        })

    try:
        while True:
            data = await websocket.receive_json()
            event = data.get("event")
            payload = data.get("payload", {})

            if event == "ANSWER_CORRECT":
                points = payload.get("points", 10)
                player_state = room_manager.update_score(room_id, user_id, points)
                
                # Broadcast update to everyone in the room
                await manager.broadcast(room_id, {
                    "event": "PLAYER_UPDATE",
                    "payload": {
                        "user_id": user_id,
                        "state": player_state
                    }
                })
                
                # Check if anyone has finished (e.g. reached 10 questions)
                # For now, let's assume quiz has 10 questions
                if player_state and player_state["progress"] >= 10:
                    room_manager.rooms[room_id]["finished"] = True
                    room_manager.rooms[room_id]["winner_id"] = user_id
                    
                    await manager.broadcast(room_id, {
                        "event": "GAME_OVER",
                        "payload": {
                            "winner_id": user_id,
                            "final_state": room_manager.get_room_state(room_id)
                        }
                    })

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        logger.info(f"User {user_id} disconnected from room {room_id}")
