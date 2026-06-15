from fastapi import APIRouter, Depends, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.dataset_service import DatasetService
from app.schemas.dataset import DatasetResponse, DatasetListResponse

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post("", response_model=DatasetResponse, status_code=201)
async def upload_dataset(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DatasetService(db)
    return await service.upload_dataset(
        file=file,
        user_id=current_user.id,
        user_plan=current_user.plan.value,
        name=name,
        description=description,
    )


@router.get("", response_model=DatasetListResponse)
async def list_datasets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DatasetService(db)
    datasets = await service.list_datasets(current_user.id)
    return DatasetListResponse(datasets=datasets, total=len(datasets))


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DatasetService(db)
    return await service.get_dataset(dataset_id, current_user.id)


@router.get("/{dataset_id}/preview")
async def preview_dataset(
    dataset_id: uuid.UUID,
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DatasetService(db)
    return await service.preview_dataset(dataset_id, current_user.id, limit)


@router.delete("/{dataset_id}")
async def delete_dataset(
    dataset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DatasetService(db)
    return await service.delete_dataset(dataset_id, current_user.id)