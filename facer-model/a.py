import cv2
import numpy as np

# im = cv2.imread('./lfw\Aaron_Guiel\Aaron_Guiel_0001.jpg')

# gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
# gray = cv2.medianBlur(gray, 5)

# edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
# color = cv2.bilateralFilter(im, 9 ,250, 250)
# cart = cv2.bitwise_and(color, color, mask=edges)

# cv2.imshow('w', im)
# cv2.imshow('w', color)
# cv2.imshow('w', cart)

# cv2.waitKey(0)
import tensorflow as tf

print(tf.__version__)

from utils import get_encoder

im1 = './lfw/Aaron_Peirsol/Aaron_Peirsol_0002.jpg'
im2 = './lfw/Aaron_Peirsol/Aaron_Peirsol_0004.jpg'
im3 = './lfw/Abba_Eban/Abba_Eban_0001.jpg'
im4 = './lfw/Abdoulaye_Wade/Abdoulaye_Wade_0001.jpg'
im5 = './lfw/Abdoulaye_Wade/Abdoulaye_Wade_0002.jpg'
im6 = './lfw/Abdoulaye_Wade/Abdoulaye_Wade_0003.jpg'
im7 = './lfw/Abdoulaye_Wade/Abdoulaye_Wade_0004.jpg'

THRESH = 0.65

enc = get_encoder()

def read(path):
    return cv2.imread(path)

def processImg(raw):
    img = cv2.cvtColor(raw, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(img, (224, 224))
    return resized

def encode(im):
    return enc.predict(np.asarray([im]))[0]

def compare(enc1, enc2):
    return np.sum(np.square(enc1 - enc2), axis=-1) < THRESH

def compareMany(encodings, encoding):
    result = []
    for item in encodings:
        result.append(compare(encoding, item))

    return result        

im = read(im1)
img = processImg(im)
enc1 = encode(img)  

encs = []
for imgPath in [im2, im3, im4, im5, im6, im7]:
    im = read(im1)
    img = processImg(im)
    encoding = encode(img)
    encs.append(encoding)

encs = np.asarray(encs)
print(compareMany(encs, enc1))


# print(compare(enc1, enc3))
# print(compare(enc2, enc3))
# print(compare(enc1, enc1))


# enc = [0.21671112 0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.0550126  0.         0.         0.         0.
#  0.13209878 0.         0.07214461 0.         0.         0.
#  0.         0.         0.         0.28671777 0.         0.
#  0.12274469 0.         0.         0.         0.28690457 0.
#  0.         0.         0.         0.14648776 0.         0.
#  0.08013251 0.         0.         0.         0.04381564 0.
#  0.         0.         0.27238834 0.         0.         0.00268352
#  0.         0.         0.         0.31290907 0.13073702 0.
#  0.         0.         0.         0.         0.         0.08581177
#  0.         0.01005071 0.11302587 0.         0.         0.
#  0.08008109 0.         0.         0.         0.         0.06614157
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.1939348
#  0.07866634 0.         0.         0.00661435 0.04666795 0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.00328988 0.         0.         0.         0.16559866
#  0.00151231 0.         0.         0.02302679 0.         0.
#  0.         0.21273248 0.         0.         0.07653248 0.
#  0.         0.         0.         0.         0.         0.06102448
#  0.         0.         0.         0.         0.         0.
#  0.06778755 0.16231091 0.16591594 0.08687352 0.         0.
#  0.         0.         0.         0.         0.07861368 0.
#  0.         0.         0.         0.02293671 0.         0.
#  0.20762122 0.         0.11453968 0.         0.0901021  0.
#  0.10404066 0.10658386 0.         0.01745274 0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.04040125 0.10795041 0.         0.         0.         0.
#  0.         0.08709338 0.         0.         0.         0.
#  0.         0.         0.         0.         0.32725358 0.04253651
#  0.         0.         0.         0.         0.         0.
#  0.00195893 0.         0.         0.16943128 0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.01356693 0.         0.02835563
#  0.15251306 0.09989833 0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.
#  0.         0.         0.         0.         0.         0.06461081
#  0.         0.         0.09281481 0.03439046 0.         0.
#  0.         0.         0.05167146 0.        ]

     