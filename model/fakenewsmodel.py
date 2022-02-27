import numpy as np
import pandas as pd
import itertools
import pickle #To save model

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
from sklearn.metrics import classification_report

# loading data
data=pd.read_csv('news.csv')
x_raw = data.title
y = data.label

# fitting data
cv = CountVectorizer()
x = cv.fit_transform(x_raw)

xtrain, xtest, ytrain, ytest = train_test_split(x, y, test_size=0.2, random_state=47)
model = MultinomialNB()
model.fit(xtrain, ytrain)

# Report and Accuracy Score
ypred=model.predict(xtest)

print("Accuracy:",metrics.accuracy_score(ytest, ypred))
print("Classification Report RF:\n",classification_report(ytest,ypred))

# Testing Headlines
news_headline = "Latest And Perhaps Last Debate Highlights Animosity Of Sanders, Clinton"
data = cv.transform([news_headline]).toarray()
print(news_headline)
print(model.predict(data))

# Saving model
pickle.dump(model, open('fakenewsmodel.pkl', 'wb'))

loaded_model = pickle.load(open('fakenewsmodel.pkl', 'rb'))
result = loaded_model.score(xtest, ytest)
print(loaded_model)