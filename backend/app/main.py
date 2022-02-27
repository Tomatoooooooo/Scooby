from pyexpat import model
from random import sample
import string
from tokenize import String
import uvicorn
import pickle
import os

from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sklearn.feature_extraction.text import CountVectorizer

# initialize fast api
app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# model

model = pickle.load(open('./app/models/fakenewsmodel.pkl', 'rb'))
cv = pickle.load(open("./app/models/vectorizer.pickle", 'rb')) 


class Headline(BaseModel):
    title: str


@app.get("/")
def read_root():
    return{"data": "Fake News Prediction Model"}


@app.post("/prediction/")
async def get_predict(data: Headline):
    news_headline = str(data.title)
    sample = cv.transform([news_headline]).toarray()
    fake = model.predict(sample)

    fake = str(fake[0])
    return {
        "data": {
            'prediction': fake
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, root_path= '/api', proxy_headers=True,  port=8080, host='0.0.0.0')