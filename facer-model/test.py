from utils import get_encoder
import numpy as np
import os
import random
import cv2
import pandas as pd
from math import floor
from time import time
import pickle
import face_recognition as fr


def processImg(path):
    raw = cv2.imread(path)
    img = cv2.cvtColor(raw, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img, (224, 224))
    return resized

def predict(im1, im2, encoder):
    t1 = encoder.predict(np.asarray([im1]))
    t2 = encoder.predict(np.asarray([im2]))
    return np.sum(np.square(t1-t2), axis=-1)[0]

def is_similar(score, threshold = 0.65):
    return score <= threshold

def create_lfw_triplets(path = './lfw'):
    triplets = []
    dirs = os.listdir('./lfw')
    for dir in dirs:
        sub_dir = os.path.join(path, dir)
        sub_dir_items = os.listdir(sub_dir)
        if len(sub_dir_items) >= 2:
            samples = random.sample(sub_dir_items, 2)
            samples = list(map(lambda x: os.path.join(path, dir, x), samples))
            dirs = list(filter(lambda x: x != dir, dirs))
            negative_dir = os.path.join(path, random.sample(dirs, 1)[0])
            negative_dir_items = os.listdir(negative_dir)
            negative = random.sample(negative_dir_items, 1)[0]
            negative = os.path.join(negative_dir, negative)
            triplets.append([samples[0], samples[1], negative])

    return triplets

def create_celeba_triplets():
    triplets = []
    data = pd.read_csv('./triplets.csv')
    data = data.sample(frac=1).reset_index(drop=True)

    total_len = data.shape[0]

    df = data.head(total_len)
    for _, row in df.iterrows():
        anchor = os.path.join('./images', row['anchor'])
        positive = os.path.join('./images', row['pos'])
        negative = os.path.join('./images', row['neg'])
        triplets.append((anchor, positive, negative))

    return triplets
        

def test_on_triplets(triplets, encoder, dataset):
    scores = []
    pos_list = []
    neg_list = []
    print(len(triplets))
    for iter, triplet in enumerate(triplets):
    # for triplet in range(4):
        print(f"ITER: {iter}: STATUS: STARTED")
        [anchor, positive, negative] = list(map(lambda x: processImg(x), triplet))
        print("POSITIVE PREDICT STARTED")
        t = time()
        pos_score = predict(anchor, positive, encoder)
        pos_list.append(is_similar(pos_score))
        pos_time = time() - t
        t = time()
        print("POSITIVE PREDICT ENDED")
        print("NEGATIVE PREDICT STARTED")

        neg_score = predict(anchor, negative, encoder)
        neg_list.append(is_similar(neg_score))
        neg_time = time() - t
        print("NEGATIVE PREDICT ENDED")

        score = {
            'positive': pos_score,
            'positive_time': pos_time,
            'negative': neg_score,
            'negative_time': neg_time,
        }
        scores.append(score)
        print(f"ITER: {iter} STATUS: DONE")

    pos_neg = {
        'positives': pos_list,
        'negatives': neg_list,   
    }

    with open(f'pos-neg-{dataset}.obj', 'wb') as f:
        pickle.dump(pos_neg, f)

    with open(f'scores-{dataset}.obj', 'wb') as f:
        pickle.dump(scores, f)


# encoder = get_encoder()
celeba_triplets = create_celeba_triplets()
lfw_triplets = create_lfw_triplets()

def compareTriplets(anchor, positive, negative):
    anc = fr.face_encodings(anchor)
    if (len(anc) == 0):
        return (None, None, None, None)
    anc = anc[0]
    pos = fr.face_encodings(positive)
    print(pos)
    t = time()
    ap_res =  None if pos == None or len(pos) == 0 else fr.compare_faces([anc], pos[0])[0]
    pos_time = time() - t
    neg = fr.face_encodings(negative)
    t = time()
    print(neg)
    an_res = None if neg == None or len(neg) == 0 else fr.compare_faces([anc], neg[0])[0]
    neg_time = time() - t
    return (ap_res, pos_time, an_res, neg_time)


def test_fr_on_triplets(triplets):
    pos_list = []
    neg_list = []
    pos_times = []
    neg_times = []

    for iter, triplet in enumerate(triplets):
        print(f'Current iteration: {iter}')
        [anchor, positive, negative] = list(map(lambda x: processImg(x), triplet))
        res = compareTriplets(anchor, positive, negative)
        print(res)
        ap_res, ap_time, an_res, an_time = res
        pos_list.append(ap_res)
        neg_list.append(an_res)
        pos_times.append(ap_time)
        neg_times.append(an_time)

    pos_neg = {
        'positives': pos_list,
        'positive_times': pos_times,
        'negatives': neg_list,
        'negative_times': neg_times,   

    }
    return pos_neg


pos_neg_fr = test_fr_on_triplets(lfw_triplets)

with open(f'pos-neg-face-recognition-lfw.obj', 'wb') as f:
    pickle.dump(pos_neg_fr, f)

pos_neg_fr = test_fr_on_triplets(celeba_triplets)

with open(f'pos-neg-face-recognition-celeba.obj', 'wb') as f:
    pickle.dump(pos_neg_fr, f)
# test_on_triplets(lfw_triplets, encoder, 'lfw-2')
# test_on_triplets(celeba_triplets, encoder, 'celeba-2')

# triplets = create_lfw_triplets()



    
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


