import random
import os
import cv2

LFW_PATH = './raw-data'
candidates = []
VER = 1

if not os.path.exists('./dataset/v{}'.format(VER)):
    os.mkdir('./dataset/v-{}'.format(VER))

faceClassifier = cv2.CascadeClassifier('./haar.xml')

for file in os.listdir(LFW_PATH):
    facePath = os.path.join(LFW_PATH, file)
    if len(os.listdir(os.path.join(LFW_PATH, file))) > 3:
        candidates.append(facePath)


data = []
reduced = random.sample(candidates, k=80)
for file in reduced:
    imgs = random.sample(os.listdir(file), k = 4)
    name = file.replace('./raw-data\\', '').replace('_', '')
    destPath = './dataset/v{}/{}'.format(VER, name)
    os.mkdir(destPath)

    imgCtr = 0
    for i, faceFile in enumerate(imgs):
        faceImg = cv2.imread(os.path.join(file, faceFile))
        faceGray = cv2.cvtColor(faceImg, cv2.COLOR_BGR2GRAY)
        boxes = faceClassifier.detectMultiScale(faceGray, 1.3, 4)
        if (len(boxes) != 0 and imgCtr <= 2):
          box = boxes[0]
          x, y, w, h = box
          destFace = faceImg[y:y + h, x:x+ w]
          destFace = cv2.resize(destFace, (150, 150))
          cv2.imwrite(os.path.join(destPath, '{}.jpg'.format(i)), destFace)
          imgCtr += 1
        if imgCtr == 2:
            break
        


