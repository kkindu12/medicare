from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LabTest(BaseModel):
    id: Optional[str]
    reportName: str
    reportDetails: str
    fee: str