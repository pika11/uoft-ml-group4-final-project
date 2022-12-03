import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from fastai.tabular.all import *


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        # Get today's date in the format the model expects
        today = datetime.today().strftime('%Y-%m-%d')

        # Make a dataframe with the neighborhood ids from 0 to 158 and today's date
        df = pd.DataFrame({'neighborhood_id': range(158), 'date': today})

        # Load the model
        learn = load_learner('./74_fill_imbalance.pkl')

        # Get the predictions
        # Create new dataframe for predictions
        predictions_new = []

        # Loop through the predictions and add the predictions to the dataframe
        for i in range(0, len(df)):
            with learn.no_bar(), learn.no_logging():
                row, clas, probs = learn.predict(df.iloc[i])
            predictions_new.append(int(clas))

        df['thefts'] = predictions_new

        # Send df as a json response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(df.to_dict()).encode('utf-8'))

        return
