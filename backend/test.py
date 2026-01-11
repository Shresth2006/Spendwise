from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Test(BaseModel):
    name: str
