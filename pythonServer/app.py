from flask import Flask, request, jsonify, make_response,json
from flask_restplus import Api, Resource, fields
import numpy as np
import sys
from werkzeug.utils import cached_property
import pandas as pd
from pandas import DataFrame
from sklearn.cluster import KMeans

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "Iris Plant identifier", 
		  description = "Predict the type of iris plant")

name_space = app.namespace('prediction', description='Prediction APIs')


@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	def post(self):
		try: 
			allformData = request.json
			formData = allformData['rows']
			rowOne = allformData['formData']['coordinatX']
			rowTwo = allformData['formData']['coordinatY']
			covot = allformData['formData']['covot']
			print("bagan 1: ",rowOne, "bagan 2: ",rowTwo ,"covot: ",covot)
			covotInt = int(covot)
			df = DataFrame(formData,columns=[rowOne,rowTwo])  
			kmeans = KMeans(n_clusters=covotInt).fit(df)
			centroids = kmeans.cluster_centers_

			color=[]
			for i in kmeans.labels_:
			    color.append(i)
			df["color"] = color

			df_list = df.values.tolist()
			JSONP_data = jsonify(df_list)

			print(JSONP_data)
			print("Ssssssssssssssssssss")

			JSONP_data.headers.add('Access-Control-Allow-Origin', '*')
			return JSONP_data
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})
