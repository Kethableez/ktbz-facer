import pickle
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score,confusion_matrix, classification_report

def conf_matrix(pos_list, neg_list):
    true = np.array([0]*len(pos_list)+[1]*len(neg_list))
    pred = np.append(pos_list, neg_list)  

    print(f"\nAccuracy of model: {accuracy_score(true, pred)}\n")

    cf_matrix = confusion_matrix(true, pred)

    categories  = ['Similar','Different']
    names = ['True Similar','False Similar', 'False Different','True Different']
    percentages = ['{0:.2%}'.format(value) for value in cf_matrix.flatten() / np.sum(cf_matrix)]

    labels = [f'{v1}\n{v2}' for v1, v2 in zip(names, percentages)]
    labels = np.asarray(labels).reshape(2,2)

    sns.heatmap(cf_matrix, annot = labels, cmap = 'Blues',fmt = '',
                xticklabels = categories, yticklabels = categories)

    plt.xlabel("Predicted", fontdict = {'size':14}, labelpad = 10)
    plt.ylabel("Actual"   , fontdict = {'size':14}, labelpad = 10)
    plt.title ("Confusion Matrix", fontdict = {'size':18}, pad = 20)
    plt.show()


with open('pos-neg-face-recognition-lfw.obj', 'rb') as f:
    pos_neg_scores = pickle.load(f)

df = pd.DataFrame(data=pos_neg_scores)
print(df.head(200))

positives = list(filter(lambda v: v != None, pos_neg_scores['positives']))
positives = list(map(lambda v: not v, positives))
positives = np.asarray(positives)
negatives = list(filter(lambda v: v != None, pos_neg_scores['negatives']))
negatives = list(map(lambda v: not v, negatives))
negatives = np.asarray(negatives)

# conf_matrix(positives, negatives)

with open('scores-celeba-2.obj', 'rb') as f:
    scores = pickle.load(f)

df = pd.DataFrame(data=scores)
df2 = df.drop(columns=['positive_time', 'negative_time'], inplace=False)

sns.set(rc={'figure.figsize': (10, 10)})
sns.set_style('white')
ax = sns.boxplot(data=df2)

plt.show()

# print(len(scores))

# max_positive = np.max(list(map(lambda x: x['positive'], scores)))
# min_positive = np.min(list(map(lambda x: x['positive'], scores)))
# mean_positive = np.mean(list(map(lambda x: x['positive'], scores)))
# max_negative = np.max(list(map(lambda x: x['negative'], scores)))
# min_negative = np.min(list(map(lambda x: x['negative'], scores)))
# mean_negative = np.mean(list(map(lambda x: x['negative'], scores)))

# print("================= POSITIVES =================")
# print(f"MAX  : {max_positive}")
# print(f"MIN  : {min_positive}")
# print(f"MEAN : {mean_positive}")

# print("================= NEGATIVES =================")
# print(f"MAX  : {max_negative}")
# print(f"MIN  : {min_negative}")
# print(f"MEAN : {mean_negative}")




# def reject_outliers(data, m = 2.):
#     d = np.abs(data - np.median(data))
#     mdev = np.median(d)
#     s = d / (mdev if mdev else 1.)
#     return data[s < m]
    
# negatives = list(map(lambda d: d['negative'], scores))
# negatives = reject_outliers(np.asarray(negatives))

# positives = list(map(lambda d: d['positive'], scores))
# positives = reject_outliers(np.asarray(positives))

# positive_mean = np.mean(positives)
# negative_mean = np.mean(negatives)

# print(positive_mean, negative_mean)

# THRESHOLD = 0.65