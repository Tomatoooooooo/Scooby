from pyexpat import model
from random import sample
import string
from tokenize import String
import uvicorn
import pickle
from sklearn.feature_extraction.text import CountVectorizer

loaded_model = pickle.load(open('model/fakenewsmodel.pkl', 'rb'))
cv = pickle.load(open("model/vectorizer.pickle", 'rb')) 

news_headline = "Latest And Perhaps Last Debate Highlights Animosity Of Sanders, Clinton"
data = cv.transform([news_headline]).toarray()
print(news_headline)
print(loaded_model.predict(data))