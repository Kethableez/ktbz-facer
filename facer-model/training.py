import os
import cv2
import time
import random
import pandas as pd
from math import floor
import numpy as np

import seaborn as sns

import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.applications import InceptionV3

from tensorflow.keras import backend, layers, metrics

from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import Xception
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.callbacks import Callback

from tensorflow.keras.utils import plot_model
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
  tf.config.experimental.set_memory_growth(gpu, True)

# Some Consts
IM_SIZE = 224
TARGET_SIZE = (IM_SIZE, IM_SIZE, 3)
FILEDIR = './images'
CSVDIR = './triplets.csv'
BATCH_SIZE = 32
EPOCHS = 250

datagen = ImageDataGenerator(rescale = 1/255.)


class DistanceLayer(layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def call(self, anchor, positive, negative):
        ap_distance = tf.reduce_sum(tf.square(anchor - positive), -1)
        an_distance = tf.reduce_sum(tf.square(anchor - negative), -1)
        return (ap_distance, an_distance)
    
class TripletsGenerator(tf.keras.utils.Sequence):
    def __init__(self, gen1, gen2, gen3):
        
        self.gen1 = gen1
        self.gen2 = gen2
        self.gen3 = gen3

    def __len__(self):
        
        return len(self.gen1)

    def __getitem__(self, i):
        
        x1 = self.gen1[i]
        x2 = self.gen2[i]
        x3 = self.gen3[i]
        
        return [x1,x2,x3]
    
def create_generator(folder,dataset,column):
    generator = datagen.flow_from_dataframe(dataframe=dataset,
                                            directory=folder,
                                            x_col=column,
                                            target_size=(IM_SIZE, IM_SIZE),
                                            batch_size=BATCH_SIZE,
                                            class_mode=None,
                                            shuffle=False)
    return generator

def getEncoder(inputShape):
    pretrained = Xception(
    input_shape=inputShape, weights='imagenet', include_top=False, pooling='avg')
    for i in range(len(pretrained.layers) - 27):
        pretrained.layers[i].trainable = False
        
    encoder = Sequential([
        pretrained,
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Lambda(lambda x: tf.math.l2_normalize(x, axis=1))
    ], name ='encoder')
    return encoder
    
def getSiameseNet(inputShape = (224, 224, 3)):
    encoder = getEncoder(inputShape)
    anc = layers.Input(inputShape, name='anchor')
    pos = layers.Input(inputShape, name='positive')
    neg = layers.Input(inputShape, name='negative')
        
    ancEnc = encoder(anc)
    posEnc = encoder(pos)
    negEnc = encoder(neg)
        
    distances = DistanceLayer()(ancEnc, posEnc, negEnc)
    
    siameseNet = Model(inputs = [anc, pos, neg], outputs = distances, name='siamese_net')
    return siameseNet

# siam
class SiameseModel(Model):
    def __init__(self, siameseNet, margin=1.0):
        super(SiameseModel, self).__init__()
        
        self.margin = margin
        self.siameseNet = siameseNet
        self.loss_tracker = metrics.Mean(name = 'loss')
        
    def call(self, inputs):
        return self.siameseNet(inputs)
    
    def train_step(self, data):
        with tf.GradientTape() as tape:
            loss = self._compute_loss(data)
        
        gradients = tape.gradient(loss, self.siameseNet.trainable_weights)
        self.optimizer.apply_gradients(zip(gradients, self.siameseNet.trainable_weights))
        
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}

    def test_step(self, data):
        loss = self._compute_loss(data)
        
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}

    def _compute_loss(self, data):
        # Get the two distances from the network, then compute the triplet loss
        ap_distance, an_distance = self.siameseNet(data)
        loss = tf.maximum(ap_distance - an_distance + self.margin, 0.0)
        return loss


    @property
    def metrics(self):
        # We need to list our metrics so the reset_states() can be called automatically.
        return [self.loss_tracker]
    
# class TestCallback(Callback):

#     def __init__(self, testTriplets):
#         super().__init__()
#         self.test_triplets = testTriplets

#     def on_epoch_end(self, epoch, logs=None):
#         pass

#     def test(self):
#         prediction
        
    


# Prepare data and data generators
data = pd.read_csv(CSVDIR)
data = data.sample(frac=1).reset_index(drop=True)

total_len = data.shape[0]
train_len = floor(total_len * 0.8)
test_len = total_len - train_len

train_dataset = data.head(train_len)
test_dataset = data.tail(test_len)

train_generator1 = create_generator(FILEDIR,train_dataset,'anchor')
train_generator2 = create_generator(FILEDIR,train_dataset,'pos')
train_generator3 = create_generator(FILEDIR,train_dataset,'neg')

test_generator1 = create_generator(FILEDIR,test_dataset,'anchor')
test_generator2 = create_generator(FILEDIR,test_dataset,'pos')
test_generator3 = create_generator(FILEDIR,test_dataset,'neg')

train_generator = TripletsGenerator(train_generator1,train_generator2,train_generator3)
test_generator = TripletsGenerator(test_generator1,test_generator2,test_generator3)

# def processImg(imgName, dir = './images'):
#     imgPath = os.path.join(dir, imgName)
#     raw = cv2.imread(imgPath)
#     img = cv2.cvtColor(raw, cv2.COLOR_BGR2RGB)
#     resized = cv2.resize(img, (224, 224))
#     return resized

# X1 = np.asarray([processImg('Aaron_Peirsol_0001.jpg', './lfw/Aaron_Peirsol')])
# X2 = np.asarray([processImg('Aaron_Peirsol_0004.jpg', './lfw/Aaron_Peirsol')])
# X3 = np.asarray([processImg('Abba_Eban_0001.jpg', './lfw/Abba_Eban')])

# # X = [X1, X2, X3]
# X = np.asarray([X1, X2, X3])

siameseNet = getSiameseNet(TARGET_SIZE)
siameseNet.summary()
# eval = siameseNet.predict((X1, X2, X3))

# print(eval)
siameseModel = SiameseModel(siameseNet)
optimizer = Adam(learning_rate=1e-3, epsilon=1e-01)
siameseModel.compile(optimizer=optimizer)

model_path = "./out_model/model.h5"
checkpoint = ModelCheckpoint(model_path,
                             monitor="val_loss",
                             mode="min",
                             save_best_only = True,
                             verbose=1,
                             save_weights_only=True)

earlystop = EarlyStopping(monitor = 'val_loss', 
                          min_delta = 0, 
                          patience = 50,
                          verbose = 1,
                          restore_best_weights = True)

learning_rate_reduction = ReduceLROnPlateau(monitor='val_loss', 
                                            patience=20, 
                                            verbose=1, 
                                            factor=0.3, 
                                            min_lr=0.00000001)

try:
    history = siameseModel.fit(train_generator, validation_data=test_generator, epochs=EPOCHS, callbacks=[checkpoint, earlystop, learning_rate_reduction])
except KeyboardInterrupt:
    print("\nTraining Stopped!")

loss = history.history['loss']
val_loss = history.history['val_loss']
epochs = range(len(loss))

plt.figure(figsize=(20, 10), dpi=100)
plt.plot(epochs, loss,'r', label='Loss')
plt.plot(epochs, val_loss,'b', label='Val loss')
plt.xlabel('Epochs')
plt.ylabel('Loss value')
plt.legend()
plt.show()

siameseModel.save_weights('./weights-v2.h5')
# siameseModel.save('./final.h5')
# # jsoned = siameseModel.to_json()
# # with open('./model.json', 'w') as f:
# #     f.write(jsoned)