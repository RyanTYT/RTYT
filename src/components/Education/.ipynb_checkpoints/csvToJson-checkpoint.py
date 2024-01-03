import pandas as pd
import numpy as np
import json

dictTable = pd.read_csv('nusMods.csv')
dictTable = dictTable.fillna(-1)
dictTable.columns = ['name', 'moduleCode', 'semester', 'title', 'description', 'review', 'grade', 'type', 'moduleCredit']
dictTable = dictTable.T.to_dict()
dictArr = [i for i in dictTable.values()]
for i in dictArr:
    for j in i:
        if i[j] == -1:
            i[j] = None
final = {'modules': dictArr}

with open('nusMods.json', 'w') as nusMods:
    json.dump(final, nusMods)