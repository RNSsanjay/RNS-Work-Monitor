from fastapi import APIRouter, Depends
from app.core.security import require_role

router = APIRouter()

@router.get("/dashboard")
async def get_employee_dashboard(
    current_user: dict = Depends(require_role(["employee"]))
):
    """Get employee dashboard data"""
    return {
        "user_id": str(current_user["_id"]),
        "full_name": current_user["full_name"],
        "shift_start": current_user.get("shift_start"),
        "shift_end": current_user.get("shift_end"),
        "manager_id": current_user.get("manager_id")
    }
