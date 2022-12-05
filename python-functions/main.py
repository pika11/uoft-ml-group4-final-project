import json
import functions_framework
import pandas as pd
from datetime import datetime

from fastai.tabular.core import add_datepart
from fastai.learner import load_learner


@functions_framework.http
def predictionsv1(request):
    # Get today's date in the format the model expects
    today = datetime.today().strftime('%Y-%m-%d')

    # Make a dataframe with the neighborhood ids from 0 to 158 and today's date
    df = pd.DataFrame({'hood_id': range(159), 'date': today})

    # Add date features
    add_datepart(df, 'date', drop=False)

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

    # Drop all columns except the predictions
    df = df[['thefts']]

    headers = {}

    # Set CORS headers for the main request
    headers['Access-Control-Allow-Origin'] = '*'

    # Set cache to 2 hours
    headers['Cache-Control'] = 'public, max-age=7200'

    # Set response header to JSON
    headers['Content-Type'] = 'application/json'

    # Send the headers in the response
    return (json.dumps(df.to_dict(orient='records')), 200, headers)
